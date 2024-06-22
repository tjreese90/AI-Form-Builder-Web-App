import React from 'react';
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import Form from '../../Form';
import { FormModel } from '@/types/form-types';

const Page = async ({ params }: { params: any }) => {
	console.debug('params:', params); // Debugging params

	const formId = params.formId;
	console.debug('formId:', formId); // Debugging formId

	if (!formId || isNaN(Number(formId))) {
		console.error('Form ID is missing or invalid');
		return <div>Form not found</div>;
	}

	const parsedFormId = parseInt(formId, 10);
	if (isNaN(parsedFormId)) {
		console.error('Parsed Form ID is not a valid integer');
		return <div>Form not found</div>;
	}

	const session = await auth();
	console.debug('session:', session); // Debugging session

	const userId = session?.user?.id;
	console.debug('userId:', userId); // Debugging userId

	if (userId === null || userId === undefined) {
		console.error('User ID is null or undefined');
		return <div>User not authenticated</div>;
	}

	const parsedUserId = parseInt(userId, 10);
	if (isNaN(parsedUserId)) {
		console.error('Parsed User ID is not a valid integer');
		return <div>User not authenticated</div>;
	}

	const form = (await db.query.forms.findFirst({
		where: eq(forms.id, parsedFormId),
		with: {
			questions: {
				with: {
					fieldOptions: true,
				},
			},
		},
	})) as unknown as FormModel;
	console.debug('form:', form); // Debugging form

	if (!form) {
		console.error('Form not found in database');
		return <div>Form not found</div>;
	}

	const formUserId = form.userId ? parseInt(form?.userId, 10) : 0;
	if (isNaN(formUserId)) {
		console.error('Form User ID is not a valid integer');
		return <div>Form not found</div>;
	}

	if (parsedUserId !== formUserId) {
		console.warn('User is not authorized to view this page');
		return <div>You are not authorized to view this page</div>;
	}

	return <Form form={form} editMode={true} />;
};

export default Page;
