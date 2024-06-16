'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Removed this line as getFormsFromLocalStorage is no longer needed in server context
// import { getFormsFromLocalStorage } from '../actions/generateForm';

export async function generateForm(
	prevState: {
		message: string;
	},
	formData: FormData
) {
	const schema = z.object({
		description: z.string().min(1),
	});
	const parse = schema.safeParse({
		description: formData.get('description'),
	});

	if (!parse.success) {
		console.log(parse.error);
		return {
			message: 'Failed to parse data',
		};
	}

	if (!process.env.GEMINI_API_KEY) {
		return {
			message: 'No Gemini API key found',
		};
	}

	const data = parse.data;
	const promptExplanation =
		"Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.GEMINI_API_KEY ?? ''}`,
				},
				method: 'POST',
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: `${data.description} ${promptExplanation}`,
								},
							],
						},
					],
				}),
			}
		);

		const json = await response.json();
		const responseObj = JSON.parse(json.choices[0].message.content);

		saveFormToLocalStorage(responseObj);

		revalidatePath('/');
		return {
			message: 'success',
			data: { form: responseObj },
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'Failed to create form',
		};
	}
}

// Helper function to save form data to local storage
function saveFormToLocalStorage(form: any) {
	if (typeof window !== 'undefined') {
		const forms = JSON.parse(localStorage.getItem('forms') || '[]');
		forms.push(form);
		localStorage.setItem('forms', JSON.stringify(forms));
	}
}
