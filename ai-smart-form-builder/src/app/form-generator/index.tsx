// index.tsx
'use client';
import React, { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateForm } from '../actions/generateForm';
import { useFormState, useFormStatus } from 'react-dom';
import { useSession, signIn } from 'next-auth/react';
import { Plus } from 'lucide-react';
import { usePlausible } from 'next-plausible';

const initialState: {
	message: string;
	data?: any;
} = {
	message: '',
};

function navigate(formId: string) {
	window.location.href = `/forms/edit/${formId}`;
}

export function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type='submit' disabled={pending}>
			{pending ? 'Generating...' : 'Generate'}
		</Button>
	);
}

const FormGenerator = () => {
	const [state, formAction] = useFormState(generateForm, initialState);
	const [open, setOpen] = useState(false);
	const session = useSession();
	const plausible = usePlausible();

	useEffect(() => {
		if (state.message === 'success' && state.data?.form?.formId) {
			setOpen(false);
			navigate(state.data.form.formId);
		}
	}, [state.message]);

	const onFormCreate = () => {
		plausible('create-form');
		if (session.data?.user) {
			setOpen(true);
		} else {
			signIn();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Button onClick={onFormCreate}>
				<Plus className='w-4 h-4 mr-2' />
				Create Form
			</Button>
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
							placeholder='Share what your form is about, who is it for, and what information you would like to collect. And AI will do the magic ✨'
						/>
					</div>
					<DialogFooter>
						<SubmitButton />
						<Button variant='link'>Create Manually</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default FormGenerator;
