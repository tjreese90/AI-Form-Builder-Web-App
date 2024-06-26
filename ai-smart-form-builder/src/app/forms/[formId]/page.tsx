import React from 'react';
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import Form from '../Form';
import { FormModel } from '@/types/form-types';

const page = async ({
	params,
}: {
	params: {
		formId: string;
	};
}) => {
	const formId = params.formId;

	if (!formId) {
		return <div>Form not found</div>;
	}

	const session = await auth();
	const userId = session?.user?.id;
	const form = await db.query.forms.findFirst({
		where: eq(forms.id, parseInt(formId)),
		with: {
			questions: {
				with: {
					fieldOptions: true,
				},
			},
		},
	});
	console.log('Form', form);
	console.log('user', userId);
	console.log('form.user', form?.userId);
	if (!form || userId !== form.userId) {
		return <div>You are not authorized to view this page</div>;
	}
	// Ensure non-null values for required properties
	const formData = {
		...form,
		name: form.name || 'Unnamed Form',
		description: form.description || 'No description available',
	} as unknown as FormModel;

	return <Form form={formData} editMode={true} />;
};
export default page;
