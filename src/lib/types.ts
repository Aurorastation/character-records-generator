export interface SelectOption {
	value: string;
	label: string;
}

export interface BaseFieldDef {
	label: string;
	required?: boolean;
}

export interface TextField extends BaseFieldDef {
	type: 'text';
	placeholder?: string;
}

export interface TextareaField extends BaseFieldDef {
	type: 'textarea';
	placeholder?: string;
}

export interface ListField extends BaseFieldDef {
	type: 'list';
}

export interface NumberField extends BaseFieldDef {
	type: 'number';
	min?: number;
	max?: number;
	unit?: string;
}

export interface SelectField extends BaseFieldDef {
	type: 'select';
	options: SelectOption[];
}

export interface MultiSelectField extends BaseFieldDef {
	type: 'multi-select';
	options: SelectOption[];
}

export interface CheckboxField extends BaseFieldDef {
	type: 'checkbox';
	options: SelectOption[];
}

export interface DateField extends BaseFieldDef {
	type: 'date';
	placeholder?: string;
}

export interface HeightField extends BaseFieldDef {
	type: 'height';
}

export interface WeightField extends BaseFieldDef {
	type: 'weight';
}

export interface SpeciesField extends BaseFieldDef {
	type: 'species';
}

export interface SubspeciesField extends BaseFieldDef {
	type: 'subspecies';
}

export interface CitizenshipField extends BaseFieldDef {
	type: 'citizenship';
}

export interface LanguagesField extends BaseFieldDef {
	type: 'languages';
}

export type FieldDef =
	| TextField
	| TextareaField
	| ListField
	| NumberField
	| SelectField
	| MultiSelectField
	| CheckboxField
	| DateField
	| HeightField
	| WeightField
	| SpeciesField
	| SubspeciesField
	| CitizenshipField
	| LanguagesField;

export interface RecordDef {
	type: string;
	preamble?: string;
	expanded: boolean;
	fields: FieldDef[];
}

export interface Template {
	id: string;
	name: string;
	description: string;
	schemaVersion: number;
	records: RecordDef[];
}

export interface Character {
	id: string;
	template: Template;
	data: Record<string, unknown>;
}
