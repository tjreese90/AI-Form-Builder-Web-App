import React, { ChangeEvent, useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { QuestionSelectModel } from '@/types/form-types';
import { FieldOptionSelectModel } from '@/types/form-types';
import { Label } from '@/components/ui/label';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

type Props = {
	element: QuestionSelectModel & {
		fieldOptions: Array<FieldOptionSelectModel>;
	};
	value: string;
	onChange: (value?: string | ChangeEvent<HTMLInputElement>) => void;
};

const FormField = ({ element, value, onChange }: Props) => {
	if (!element) return null;

	const [currentValue, setCurrentValue] = useState(value);

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	const handleValueChange = (newValue: string) => {
		setCurrentValue(newValue);
		onChange(newValue);
	};

	const components = {
		Input: () => (
			<div>
				<Input
					type='text'
					value={currentValue}
					onChange={(e) => handleValueChange(e.target.value)}
					placeholder='Enter your answer here'
					className='border border-gray-300 p-2 rounded-lg'
				/>
				<p className='text-xs text-gray-500 mt-1'>
					Please provide a detailed answer.
				</p>
			</div>
		),
		Switch: () => (
			<div className='relative inline-flex items-center'>
				<Switch
					checked={Boolean(currentValue)}
					onChange={(e) =>
						handleValueChange((e.target as HTMLInputElement).checked.toString())
					}
					className='transition-colors duration-300 ease-in-out'
				/>
			</div>
		),
		Textarea: () => (
			<Textarea
				value={currentValue}
				onChange={(e) => handleValueChange(e.target.value)}
				placeholder='Type your text here'
				className='border border-gray-300 p-2 rounded-lg'
			/>
		),
		Select: () => (
			<Select onValueChange={handleValueChange} value={currentValue}>
				<SelectTrigger className='border border-gray-300 p-2 rounded-lg'>
					<SelectValue>{currentValue || 'Select an option'}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{element.fieldOptions.map((option) => (
						<SelectItem key={option.id} value={option.text}>
							{option.text}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		),
		RadioGroup: () => (
			<RadioGroup onValueChange={handleValueChange} value={currentValue}>
				{element?.fieldOptions?.length > 0 ? (
					element.fieldOptions.map((option) => (
						<div key={option.id} className='flex items-center space-x-2'>
							<FormControl>
								<RadioGroupItem
									value={option.text}
									id={option.text}
									className='custom-radio'
								>
									{option.text}
								</RadioGroupItem>
							</FormControl>
							<Tippy content='Select this option'>
								<Label className='text-base cursor-pointer'>
									{option.text}
								</Label>
							</Tippy>
						</div>
					))
				) : (
					<p>No options available</p>
				)}
			</RadioGroup>
		),
	};

	const fieldType = element.fieldType ?? 'Input';

	const Component = components[fieldType];

	return Component ? <Component /> : null;
};

export default FormField;
