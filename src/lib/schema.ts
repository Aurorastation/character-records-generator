import { z } from 'zod';
import type { FieldDef, Template } from './types';

function zodForField(field: FieldDef): z.ZodTypeAny {
	switch (field.type) {
		case 'text':
		case 'textarea':
		case 'list':
		case 'date':
		case 'select':
		case 'species':
		case 'subspecies':
		case 'citizenship':
			return z.string().optional();

		case 'number':
		case 'height':
		case 'weight':
			return z.number().optional();

		case 'multi-select':
		case 'checkbox':
		case 'languages':
			return z.array(z.string()).optional();
	}
}

export function buildCharacterSchema(template: Template): z.ZodObject<Record<string, z.ZodTypeAny>> {
	const shape: Record<string, z.ZodTypeAny> = {};
	for (const record of template.records) {
		for (const field of record.fields) {
			shape[field.key] = zodForField(field);
		}
	}
	return z.object(shape).partial();
}
