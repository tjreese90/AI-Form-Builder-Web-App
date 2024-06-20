import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

	if (!form) {
		return <div>Form not found</div>;
	}

	return <Form form={form} />;
};
export default page;
