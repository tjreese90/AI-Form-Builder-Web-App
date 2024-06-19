import React from 'react';
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Form from '../Form';
import { FormModel } from '@/types/form-types';

const Page = async ({ params }: { params: { formId: string } }) => {
	const formId = params.formId;

	console.log('Form ID:', formId);

	if (!formId) {
		return <div>Form not found</div>;
	}

	const form = (await db.query.forms.findFirst({
		where: eq(forms.id, parseInt(formId)),
		with: {
			questions: {
				with: {
					fieldOptions: true,
				},
			},
		},
	})) as FormModel;

	console.log('Form Data:', form);

	if (!form) {
		return <div>Form not found</div>;
	}

	return <Form form={form} />;
};
export default Page;
