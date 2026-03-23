import { XMLParser } from 'fast-xml-parser';
import type { SpeciesData, CitizenshipData, LanguageData } from './types';
import type { Template, RecordDef, FieldDef, SelectOption } from '../types';
import { slugify } from '../utils/slugify';

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '@_',
	isArray: (name) => ['entry', 'ref', 'field', 'record', 'option', 'citizenship', 'language'].includes(name),
	trimValues: true
});

function extractRefs(container: any): string[] {
	if (!container?.ref) return [];
	return container.ref.map((r: any) => r['@_id']);
}

export function parseSpecies(xml: string): SpeciesData {
	const root = parser.parse(xml).species;
	const subspecies = root.subspecies?.entry ?? [];

	return {
		id: root['@_id'],
		name: root['@_name'],
		description: root.description.trim(),
		subspeciesLabel: root['@_subspeciesLabel'],
		languages: extractRefs(root.languages),
		citizenships: extractRefs(root.citizenships),
		subspecies: subspecies.map((e: any) => ({
			id: e['@_id'],
			name: e['@_name'],
			description: e.description.trim()
		}))
	};
}

export function parseCitizenships(xml: string): CitizenshipData[] {
	const root = parser.parse(xml).citizenships;
	return root.citizenship.map((c: any) => ({
		id: c['@_id'],
		name: c['@_name'],
		description: c.description?.trim()
	}));
}

export function parseLanguages(xml: string): LanguageData[] {
	const root = parser.parse(xml).languages;
	return root.language.map((l: any) => ({
		id: l['@_id'],
		name: l['@_name'],
		description: l.description.trim()
	}));
}

function parseOptions(field: any): SelectOption[] {
	if (!field.option) return [];
	return field.option.map((o: any) => ({
		value: o['@_value'],
		label: o['@_label']
	}));
}

function parseField(raw: any): FieldDef {
	const base = {
		label: raw['@_label'],
		...(raw['@_required'] === 'true' && { required: true })
	};
	const type = raw['@_type'];

	switch (type) {
		case 'text':
		case 'textarea':
		case 'date':
			return { ...base, type, placeholder: raw['@_placeholder'] };
		case 'list':
		case 'height':
		case 'weight':
		case 'species':
		case 'subspecies':
		case 'citizenship':
		case 'languages':
			return { ...base, type };
		case 'number':
			return {
				...base,
				type,
				min: raw['@_min'] != null ? Number(raw['@_min']) : undefined,
				max: raw['@_max'] != null ? Number(raw['@_max']) : undefined,
				unit: raw['@_unit']
			};
		case 'select':
		case 'multi-select':
		case 'checkbox':
			return { ...base, type, options: parseOptions(raw) };
		default:
			return { ...base, type: 'text' };
	}
}

export function parseTemplate(xml: string, id: string): Template {
	const root = parser.parse(xml).template;

	const records: RecordDef[] = root.record.map((r: any) => ({
		type: r['@_type'],
		preamble: r.preamble?.trim(),
		fields: r.field.map(parseField)
	}));

	return {
		id,
		name: root['@_name'],
		description: root.description ?? '',
		schemaVersion: Number(root['@_schemaVersion'] ?? 1),
		records
	};
}
