'use server';

import { db } from '@/db';
import { formSubmissions, answers as dbAnswers } from '@/db/schema';
import { fieldOptions } from '../../db/schema';

interface SubmitAnswersData {
	formId: number;
	answers: {
		questionId: number;
		value?: string | null;
		fieldOptionsId?: number | null;
	}[];
}

export type Answer = {
	questionId: number;
	value?: string | null;
	fieldOptionsId?: number | null;
};

interface submitAnswerData {
	formId: number;
	answers: Answer[];
}

export async function submitAnswers(data: SubmitAnswersData) {
	const { formId, answers } = data;

	const newFormSubmission = await db
		.insert(formSubmissions)
		.values({
			formId,
		})
		.returning({
			insertedId: formSubmissions.id,
		});

	const [{ insertedId }] = newFormSubmission;

	await db.transaction(async (tx) => {
		for (const answer of answers) {
			await tx
				.insert(dbAnswers)
				.values({
					formSubmissionId: insertedId,
					...answer,
				})
				.returning({
					answerId: dbAnswers.id,
				});
		}
	});

	return insertedId;
}
