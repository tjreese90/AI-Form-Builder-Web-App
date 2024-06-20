'use server';

import dotenv from 'dotenv';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createLogger, transports, format } from 'winston';

dotenv.config();

// Initialize logger
const logger = createLogger({
	level: 'info',
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

const MAX_RETRIES = Number(getEnvVar('MAX_RETRIES', '5'));
const RETRY_DELAY_MS = Number(getEnvVar('RETRY_DELAY_MS', '2000')); // 2 seconds delay between retries

const PROMPT_EXPLANATION = `
Based on the description, generate a comprehensive and detailed survey object with 3 fields:
name (string) for the form, description (string) of the form, and a questions array where each element has 3 fields:
text (string) for the question, fieldType (one of RadioGroup, Select, Input, Textarea, Switch), and fieldOptions (an array of objects with text and value fields).
Ensure each question is detailed and meaningful. For RadioGroup and Select types, provide at least 4 unique options.
If the output is too long to be completed in one response, indicate this at the end of the response and include the text 'CONTINUE'.
Return the response in JSON format. Verify that the JSON is correctly formatted and all questions are fully complete.
`;

type FieldType = 'RadioGroup' | 'Select' | 'Input' | 'Textarea' | 'Switch';

interface FieldOption {
	text: string;
	value: string;
}

interface Question {
	text: string;
	fieldType: FieldType;
	fieldOptions: FieldOption[];
}

interface FormResponse {
	name: string;
	description: string;
	questions: Question[];
}

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

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			logger.info(
				`Attempt ${attempt}: Sending request to API with body:`,
				requestBody
			);

			const result = await model.generateContent(requestBody);
			const responseContent = await result.response.text();

			logger.info('Raw API response content:', responseContent);

			const cleanedContent = cleanResponseContent(responseContent);
			logger.info('Cleaned API response content:', cleanedContent);

			fullResponseContent += cleanedContent.replace('CONTINUE', '');

			if (responseContent.includes('CONTINUE')) {
				requestBody = 'CONTINUE';
				continue;
			}

			responseObj = mergePartialResponses(
				responseObj,
				JSON.parse(fullResponseContent)
			);
			fullResponseContent = ''; // Reset for next parts if needed

			if (isResponseComplete(responseObj)) {
				saveFormToLocalStorage(responseObj);
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
		} catch (error) {
			handleException(error);
		}

		await delay(RETRY_DELAY_MS);
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
		if (!areQuestionsValid(parsedContent.questions)) {
			throw new ValidationError('Invalid questions format');
		}
	} catch (error) {
		logger.error('Invalid JSON content:', cleanedContent);
		throw new ValidationError('Invalid JSON content');
	}

	return cleanedContent;
}

// Merge partial responses into a single response object
function mergePartialResponses(
	existingObj: FormResponse | null,
	newObj: FormResponse
): FormResponse {
	if (!existingObj) {
		return newObj;
	}
	if (newObj.questions && Array.isArray(newObj.questions)) {
		existingObj.questions = [...existingObj.questions, ...newObj.questions];
	}
	return existingObj;
}

// Check if the response is complete
function isResponseComplete(responseObj: FormResponse | null): boolean {
	return !!(
		responseObj?.name &&
		responseObj?.description &&
		responseObj?.questions?.length &&
		areQuestionsValid(responseObj.questions)
	);
}

// Validate questions to ensure they have complete text, fieldType, and fieldOptions
function areQuestionsValid(questions: Question[]): boolean {
	for (const question of questions) {
		if (
			!question.text ||
			!question.fieldType ||
			!Array.isArray(question.fieldOptions)
		) {
			return false;
		}

		if (
			(question.fieldType === 'RadioGroup' ||
				question.fieldType === 'Select') &&
			question.fieldOptions.length < 4
		) {
			return false;
		}

		if (question.text.length < 20) {
			return false;
		}

		if (
			(question.fieldType === 'Input' || question.fieldType === 'Textarea') &&
			question.text.length < 40
		) {
			return false;
		}
	}
	return true;
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
			!Array.isArray(question.fieldOptions) ||
			question.fieldOptions.length < 4
		)
			feedback += `Question ${index + 1} needs more options. `;
	});

	return feedback;
}

// Save form to local storage if in a browser environment
function saveFormToLocalStorage(form: FormResponse) {
	if (typeof window !== 'undefined') {
		const forms = JSON.parse(localStorage.getItem('forms') || '[]');
		forms.push(form);
		localStorage.setItem('forms', JSON.stringify(forms));
		logger.info('Form saved to local storage:', JSON.stringify(form, null, 2));
	} else {
		logger.info('Skipping save to local storage because window is undefined');
	}
}

// Delay function to wait for a specified amount of time
function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Custom error classes
class ValidationError extends Error {}
class ApiError extends Error {}

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
	} else {
		logger.error('Unhandled exception:', error);
	}
}
