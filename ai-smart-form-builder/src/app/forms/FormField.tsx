import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FormControl, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { QuestionSelectModel } from '@/types/form-types';
import { FieldOptionSelectModel } from '@/types/form-types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Props = {
	element: QuestionSelectModel & {
		fieldOptions: Array<FieldOptionSelectModel>;
	};
	value: string;
	onChange: (value?: string | ChangeEvent<HTMLInputElement>) => void;
};

const FormField = ({ element, value, onChange }: Props) => {
	const [currentValue, setCurrentValue] = useState(value);

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	const handleValueChange = (newValue: string) => {
		setCurrentValue(newValue);
		onChange(newValue);
	};

	const handleSwitchChange = () => {
		const newValue = currentValue === 'Yes' ? 'No' : 'Yes';
		handleValueChange(newValue);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		handleValueChange(e.target.value);
	};

	const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		handleValueChange(e.target.value);
	};

	const components = useMemo(
		() => ({
			Input: () => (
				<Input type='text' value={currentValue} onChange={handleInputChange} />
			),
			Switch: () => (
				<div className='flex items-center space-x-4'>
					<Switch
						checked={currentValue === 'Yes'}
						onCheckedChange={handleSwitchChange}
						className='p-0 rounded-lg'
					/>
					<span>{currentValue === 'Yes' ? 'Yes' : 'No'}</span>
				</div>
			),
			Textarea: () => (
				<Textarea value={currentValue} onChange={handleTextareaChange} />
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
				<RadioGroup onValueChange={handleValueChange}>
					{element.fieldOptions.map((option) => (
						<div
							key={`${option.text} ${option.value}`}
							className='flex items-center space-x-2'
						>
							<FormControl>
								<RadioGroupItem
									value={`answerId_${option.id}`}
									id={option?.value?.toString() || `answerId_${option.id}`}
								>
									{option.text}
								</RadioGroupItem>
							</FormControl>
							<Label className='text-base'>{option.text}</Label>
						</div>
					))}
				</RadioGroup>
			),
		}),
		[currentValue, element.fieldOptions]
	);

	if (!element) return <div>Error: Element is missing</div>;

	return (
		<>
			{element.fieldType && components[element.fieldType] ? (
				components[element.fieldType]()
			) : (
				<div>Invalid field type</div>
			)}
		</>
	);
};

export default FormField;
