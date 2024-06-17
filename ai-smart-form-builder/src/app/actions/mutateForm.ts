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
export async function saveForm(data: SaveFormData) {
	const { name, description, questions } = data;
	const session = await auth();
	const userId = session?.user?.id;

	// Insert the new form into the forms table and get the inserted form ID
	const newForm = await db
		.insert(forms)
		.values({
			name,
			description,
			userId,
			published: false, // The form is initially not published
		})
		.returning({ insertedId: forms.id });
	const formId = newForm[0].insertedId;

	// Map questions to include formId and prepare for insertion
	const newQuestions = questions.map((question) => ({
		text: question.text,
		fieldType: question.fieldType,
		formId, // Associate each question with the newly created form
		fieldOptions: question.fieldOptions, // Include field options if any
	}));

	// Execute database operations within a transaction to ensure data consistency
	await db.transaction(async (tx) => {
		for (const question of newQuestions) {
			// Insert each question into the dbQuestions table and get the inserted question ID
			const [{ insertedId: questionId }] = await tx
				.insert(dbQuestions)
				.values({
					text: question.text,
					fieldType: question.fieldType,
					formId,
				})
				.returning({ insertedId: dbQuestions.id });

			// If the question has field options, insert them into the fieldOptions table
			if (question.fieldOptions && question.fieldOptions.length > 0) {
				await tx.insert(fieldOptions).values(
					question.fieldOptions.map((option) => ({
						text: option.text,
						value: option.value,
						questionId, // Associate each field option with the respective question
					}))
				);
			}
		}
	});

	return formId; // Return the ID of the newly created form
}

/**
 * Publish a form by setting its published status to true.
 *
 * @param formId - The ID of the form to publish.
 */
export async function publishForm(formId: number) {
	await db.update(forms).set({ published: true }).where(eq(forms.id, formId));
}
