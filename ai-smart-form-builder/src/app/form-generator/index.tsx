'use client';

import { useState, useEffect } from 'react';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';

import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateForm } from '../actions/generateForm';

type TypeFormGeneratorProps = {};

type Form = {
	name: string;
	description: string;
	questions: {
		text: string;
		fieldType: string;
		fieldOptions: { text: string; value: string }[];
	}[];
};

const initialState: {
	message: string;
	data?: { form: Form };
} = {
	message: '',
};

export function SubmitButton() {
	const { pending } = useFormStatus();
	return <Button>{pending ? 'Generating...' : 'Generate Form'}</Button>;
}

const FormGenerator = (props: TypeFormGeneratorProps) => {
	const [state, formAction] = useFormState(generateForm, initialState);
	const [open, setOpen] = useState(false);
	const [forms, setForms] = useState<Form[]>([]);

	useEffect(() => {
		// Load saved forms from local storage on component mount
		const savedForms = getFormsFromLocalStorage();
		setForms(savedForms);

		if (state.message === 'success' && state.data?.form) {
			setOpen(false);
			// Update the local state with the new form
			setForms((prevForms) => [...prevForms, state.data.form]);
		}
		console.log(state.data);
	}, [state.message, state.data]);

	const onFormCreate = () => {
		setOpen(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<Button onClick={onFormCreate}>Create Form</Button>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Create New Form</DialogTitle>
					</DialogHeader>
					<form action={formAction}>
						<div className='grid gap-4 py-4'>
							<Textarea
								id='description'
								name='description'
								required
								placeholder='Share what your form is about, who is it for, what is it form, and what information would you like to collect. AI will do the magic ✨'
							></Textarea>
						</div>
						<DialogFooter>
							<SubmitButton />
							<Button variant='link'>Create Manually</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<div className='saved-forms'>
				<h2>Saved Forms</h2>
				<ul>
					{forms.map((form, index) => (
						<li key={index}>
							<h3>{form.name}</h3>
							<p>{form.description}</p>
							{/* Additional rendering logic for questions can be added here */}
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default FormGenerator;

// Function to retrieve all forms from local storage
function getFormsFromLocalStorage(): Form[] {
	if (typeof window !== 'undefined') {
		return JSON.parse(localStorage.getItem('forms') || '[]');
	}
	return [];
}
