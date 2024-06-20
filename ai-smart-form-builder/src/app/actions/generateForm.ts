'use server';

import dotenv from 'dotenv';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
	GoogleGenerativeAI,
	GenerateContentResult,
} from '@google/generative-ai';
import { createLogger, transports, format } from 'winston';
import { saveForm } from './mutateForm';

dotenv.config();

// Initialize logger
const logger = createLogger({
	level: 'debug',
	format: format.combine(format.colorize(), format.simple()),
	transports: [new transports.Console()],
});

// Utility function to get environment variables with validation
function getEnvVar(name: string, defaultValue?: string): any {
	const value = process.env[name] || defaultValue;
	if (!value) {
		logger.warn(
			`Environment variable ${name} is not set, using default value: ${defaultValue}`
		);
	}
	return value;
}

// Initialize the generative model with the API key
const genAI = new GoogleGenerativeAI(getEnvVar('GOOGLE_GEN_AI_KEY'));
const modelName = getEnvVar('GEN_AI_MODEL_NAME', 'gemini-1.5-pro-latest');
const model = genAI.getGenerativeModel({ model: modelName });

const CONFIG = {
	MAX_RETRIES: Number(getEnvVar('MAX_RETRIES', '5')),
	RETRY_DELAY_MS: Number(getEnvVar('RETRY_DELAY_MS', '2000')), // 2 seconds delay between retries
};

const PROMPT_EXPLANATION = `
Based on the provided description, generate a detailed survey object that includes the following fields:
- name: A string representing the name of the form.
- description: A string describing the purpose of the form.
- questions: An array of question objects, where each object has the following fields:
  - text: A string representing the question text.
  - fieldType: A string representing the type of field, which must be one of the following: 'RadioGroup', 'Select', 'Input', 'Textarea', or 'Switch'.
  - fieldOptions: An array of option objects (only required for 'RadioGroup' and 'Select' types), where each object has:
    - text: A string representing the option text.
    - value: A string representing the option value.

Please ensure:
1. Each question is meaningful, clear, and detailed.
2. For 'RadioGroup' and 'Select' types, provide at least 4 unique options.
3. The response is in valid JSON format.
4. If the output is too long to be completed in one response, indicate this at the end of the response and include the text 'CONTINUE'.
5. Verify that all questions are fully complete and well-formed.

Return the JSON response with all fields correctly populated.
`;

type FieldType = 'RadioGroup' | 'Select' | 'Input' | 'Textarea' | 'Switch';

interface FieldOption {
	text: string;
	value: string;
}

interface Question {
	text: string;
	fieldType: FieldType;
	fieldOptions?: FieldOption[];
}

interface FormResponse {
	name: string;
	description: string;
	questions: Question[];
	formId?: string;
}

const cache: { [key: string]: FormResponse } = {};

export async function generateForm(
	prevState: { message: string },
	formData: FormData
): Promise<{ message: string; data?: { form: FormResponse } }> {
	logger.info('generateForm called with formData:', formData);

	const parseResult = await validateFormData(formData);
	if (!parseResult.success) {
		logger.error('Schema parsing failed:', parseResult.error);
		return { message: 'Failed to parse data' };
	}

	const data = parseResult.data;
	logger.info('Parsed data:', data);

	let requestBody = `${data.description} ${PROMPT_EXPLANATION}`;
	let fullResponseContent = '';
	let responseObj: FormResponse | null = null;

	for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
		try {
			logger.info(
				`Attempt ${attempt}: Sending request to API with body:`,
				requestBody
			);

			responseObj = await getCachedResponse(data.description, requestBody);

			if (responseObj) {
				fullResponseContent = ''; // Reset for next parts if needed
				if (isResponseComplete(responseObj)) {
					const formId = await saveForm(responseObj); // Save the form and get the form ID
					responseObj.formId = formId.toString();
					logger.debug('Generated form ID:', formId);
					revalidatePath('/');
					return {
						message: 'success',
						data: { form: responseObj },
					};
				} else {
					logger.warn('Response is incomplete, retrying...');
					const feedback = generateFeedback(responseObj);
					requestBody = `${data.description} ${PROMPT_EXPLANATION} ${feedback}`;
				}
			}
		} catch (error) {
			handleException(error);
		}

		await delay(CONFIG.RETRY_DELAY_MS);
	}

	return {
		message: 'Failed to create a complete form after multiple attempts',
	};
}

// Validate form data using Zod schema
async function validateFormData(formData: FormData) {
	const schema = z.object({
		description: z.string().min(1),
	});

	try {
		const result = await schema.safeParseAsync({
			description: formData.get('description')?.toString() || '',
		});
		return result;
	} catch (error) {
		logger.error('Error during form data validation:', error);
		return { success: false, error } as const;
	}
}

// Clean response content and ensure it is valid JSON
function cleanResponseContent(content: string): string {
	let cleanedContent = content
		.replace(/```json/g, '')
		.replace(/```/g, '')
		.trim();

	try {
		const parsedContent = JSON.parse(cleanedContent);
		logger.debug('Parsed JSON content:', parsedContent);
		if (!areQuestionsValid(parsedContent.questions)) {
			throw new ValidationError('Invalid questions format');
		}
		return cleanedContent;
	} catch (error) {
		logger.error('Invalid JSON content:', cleanedContent);
		throw new ValidationError('Invalid JSON content');
	}
}

// Merge partial responses into a single response object
function mergePartialResponses(
	existingObj: FormResponse | null,
	newObj: FormResponse
): FormResponse {
	logger.debug('Merging partial responses:', { existingObj, newObj });

	if (!existingObj) {
		return newObj;
	}

	if (!newObj.questions || !Array.isArray(newObj.questions)) {
		return existingObj;
	}

	const mergedQuestions = mergeQuestions(
		existingObj.questions,
		newObj.questions
	);

	return {
		...existingObj,
		...newObj,
		questions: mergedQuestions,
	};
}

// Helper function to merge questions and avoid duplicates
function mergeQuestions(
	existingQuestions: Question[],
	newQuestions: Question[]
): Question[] {
	const questionMap = new Map<string, Question>();

	// Add existing questions to the map
	existingQuestions.forEach((question) => {
		questionMap.set(question.text, question);
	});

	// Add new questions, merging or adding as necessary
	newQuestions.forEach((question) => {
		if (questionMap.has(question.text)) {
			const existingQuestion = questionMap.get(question.text)!;
			questionMap.set(question.text, mergeQuestion(existingQuestion, question));
		} else {
			questionMap.set(question.text, question);
		}
	});

	return Array.from(questionMap.values());
}

// Helper function to merge two questions
function mergeQuestion(
	existingQuestion: Question,
	newQuestion: Question
): Question {
	const mergedFieldOptions = mergeFieldOptions(
		existingQuestion.fieldOptions || [],
		newQuestion.fieldOptions || []
	);

	return {
		...existingQuestion,
		...newQuestion,
		fieldOptions: mergedFieldOptions,
	};
}

// Helper function to merge field options and avoid duplicates
function mergeFieldOptions(
	existingFieldOptions: FieldOption[],
	newFieldOptions: FieldOption[]
): FieldOption[] {
	const fieldOptionMap = new Map<string, FieldOption>();

	// Add existing field options to the map
	existingFieldOptions.forEach((option) => {
		fieldOptionMap.set(option.value, option);
	});

	// Add new field options, merging or adding as necessary
	newFieldOptions.forEach((option) => {
		if (!fieldOptionMap.has(option.value)) {
			fieldOptionMap.set(option.value, option);
		}
	});

	return Array.from(fieldOptionMap.values());
}

// Generate feedback based on the incomplete response
function generateFeedback(responseObj: FormResponse | null): string {
	let feedback = 'The following issues were found with the response: ';

	if (!responseObj) {
		feedback += 'Response object is null. ';
		return feedback;
	}

	if (!responseObj.name) feedback += 'Form name is missing. ';
	if (!responseObj.description) feedback += 'Form description is missing. ';
	if (!responseObj.questions) feedback += 'Questions array is missing. ';

	responseObj.questions.forEach((question, index) => {
		if (!question.text || question.text.length < 20)
			feedback += `Question ${index + 1} is incomplete or too short. `;
		if (!question.fieldType)
			feedback += `Question ${index + 1} is missing a field type. `;
		if (
			(question.fieldType === 'RadioGroup' ||
				question.fieldType === 'Select') &&
			(!Array.isArray(question.fieldOptions) ||
				question.fieldOptions.length < 4)
		) {
			feedback += `Question ${index + 1} needs more options. `;
		}
	});

	logger.debug('Generated feedback:', feedback);
	return feedback;
}

// Retrieve response from cache or API
async function getCachedResponse(
	key: string,
	requestBody: string
): Promise<FormResponse | null> {
	if (cache[key]) {
		return cache[key];
	}

	const result: GenerateContentResult = await model.generateContent(
		requestBody
	);
	const responseContent = await result.response.text();

	logger.info('Raw API response content:', responseContent);
	const responseObj = parseApiResponse(responseContent);

	if (responseObj) {
		cache[key] = responseObj;
	}

	return responseObj;
}

// Parse API response and clean content
function parseApiResponse(responseContent: string): FormResponse | null {
	const cleanedContent = cleanResponseContent(responseContent);
	logger.info('Cleaned API response content:', cleanedContent);

	try {
		const parsedContent = JSON.parse(cleanedContent);
		logger.debug('Parsed JSON content:', parsedContent);
		if (!areQuestionsValid(parsedContent.questions)) {
			throw new ValidationError('Invalid questions format');
		}
		return parsedContent;
	} catch (error) {
		logger.error('Invalid JSON content:', cleanedContent);
		throw new ValidationError('Invalid JSON content');
	}
}

// Function to check if questions are valid
function areQuestionsValid(questions: Question[]): boolean {
	return (
		Array.isArray(questions) &&
		questions.every((question) => {
			const { text, fieldType, fieldOptions } = question;
			if (!text || typeof text !== 'string' || text.length < 20) return false;
			if (
				!fieldType ||
				!['RadioGroup', 'Select', 'Input', 'Textarea', 'Switch'].includes(
					fieldType
				)
			)
				return false;
			if (
				(fieldType === 'RadioGroup' || fieldType === 'Select') &&
				(!Array.isArray(fieldOptions) ||
					fieldOptions.length < 4 ||
					!fieldOptions.every(
						(opt) =>
							typeof opt.text === 'string' && typeof opt.value === 'string'
					))
			) {
				return false;
			}
			return true;
		})
	);
}

// Function to check if the response is complete
function isResponseComplete(responseObj: FormResponse): boolean {
	if (
		!responseObj.name ||
		!responseObj.description ||
		!Array.isArray(responseObj.questions) ||
		responseObj.questions.length === 0
	) {
		return false;
	}
	return areQuestionsValid(responseObj.questions);
}

// Delay function to wait for a specified amount of time
function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Custom error classes
class ValidationError extends Error {}
class ApiError extends Error {}
class NetworkError extends Error {}

// Handle exceptions with detailed logging
function handleException(error: any) {
	if (error instanceof ValidationError) {
		logger.error('Validation error:', error.message);
	} else if (error instanceof ApiError) {
		logger.error('API error:', error.message);
	} else if (error instanceof SyntaxError) {
		logger.error('Syntax error:', error.message);
	} else if (error instanceof TypeError) {
		logger.error('Type error:', error.message);
	} else if (error instanceof NetworkError) {
		// Specific error handling
		logger.error('Network error:', error.message);
	} else {
		logger.error('Unhandled exception:', error);
	}
}
