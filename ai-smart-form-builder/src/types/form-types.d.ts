export interface FormSelectModel {
	id: number;
	name: string | null;
	description: string | null;
	userId: string | null;
	published: boolean | null;
}

export interface QuestionSelectModel {
	id: number;
	text: string | null;
	fieldType: 'RadioGroup' | 'Select' | 'Input' | 'Textarea' | 'Switch' | null;
	formId: number | null;
	fieldOptions: FieldOptionSelectModel[];
}

export interface FieldOptionSelectModel {
	id: number;
	text: string;
	value: string;
	questionId: number;
}

export interface FormModel extends FormSelectModel {
	questions: Array<
		QuestionSelectModel & {
			fieldOptions: FieldOptionSelectModel[];
		}
	>;
}
