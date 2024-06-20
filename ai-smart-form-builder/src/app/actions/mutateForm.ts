'use server';

import { db } from '@/db';
import { forms, questions as dbQuestions, fieldOptions } from '@/db/schema';
import { auth } from '@/auth';
import { InferInsertModel, eq } from 'drizzle-orm';

type Form = InferInsertModel<typeof forms>;
type Question = InferInsertModel<typeof dbQuestions>;
type FieldOption = InferInsertModel<typeof fieldOptions>;

interface SaveFormData extends Form {
	questions: Array<Question & { fieldOptions?: FieldOption[] }>;
}

/**
 * Save form data including questions and their respective field options.
 *
 * @param data - The form data to save, including questions and their field options.
 * @returns The ID of the newly created form.
 */
export async function saveForm(data: SaveFormData): Promise<number> {
	console.debug('Starting saveForm with data:', data);
	const { name, description, questions } = data;
	const session = await auth();
	console.debug('Session:', session);

	const userId = session?.user?.id;
	console.debug('User ID:', userId);

	if (!userId) {
		const errorMsg = 'User not authenticated';
		console.error(errorMsg);
		throw new Error(errorMsg);
	}

	try {
		console.debug('Inserting new form...');
		const [newForm] = await db
			.insert(forms)
			.values({
				name,
				description,
				userId,
				published: false, // The form is initially not published
			})
			.returning({ id: forms.id });

		console.debug('New form inserted:', newForm);

		const formId = newForm.id;
		console.debug('Form ID:', formId);

		const newQuestions = questions.map((question) => ({
			...question,
			formId,
		}));
		console.debug('New questions mapped:', newQuestions);

		// Execute database operations within a transaction to ensure data consistency
		await db.transaction(async (tx) => {
			for (const question of newQuestions) {
				console.debug('Inserting question:', question);
				const [insertedQuestion] = await tx
					.insert(dbQuestions)
					.values({
						text: question.text,
						fieldType: question.fieldType,
						formId,
					})
					.returning({ id: dbQuestions.id });
				console.debug('Question inserted with ID:', insertedQuestion.id);

				// If the question has field options, insert them into the fieldOptions table
				if (question.fieldOptions && question.fieldOptions.length > 0) {
					console.debug(
						'Inserting field options for question ID:',
						insertedQuestion.id
					);
					await tx.insert(fieldOptions).values(
						question.fieldOptions.map((option) => ({
							text: option.text,
							value: option.value,
							questionId: insertedQuestion.id,
						}))
					);
					console.debug(
						'Field options inserted for question ID:',
						insertedQuestion.id
					);
				}
			}
		});

		console.debug('Form saved successfully with ID:', formId);
		return formId; // Return the ID of the newly created form
	} catch (error) {
		console.error('Error saving form data:', error);
		throw new Error('Failed to save form data');
	}
}

/**
 * Publish a form by setting its published status to true.
 *
 * @param formId - The ID of the form to publish.
 */
export async function publishForm(formId: number) {
	console.debug('Publishing form with ID:', formId);
	try {
		await db.update(forms).set({ published: true }).where(eq(forms.id, formId));
		console.debug('Form published successfully with ID:', formId);
	} catch (error) {
		console.error('Error publishing form:', error);
		throw new Error('Failed to publish form');
	}
}
