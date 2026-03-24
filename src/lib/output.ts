import type { FieldDef, Template } from './types';
import type { SpeciesData } from './data/types';
import { cmToFeetInches, kgToLb } from './utils/conversions';
import { formatICDate } from './utils/dates';
import { slugify } from './utils/slugify';

export function formatFieldOutput(
	field: FieldDef,
	value: unknown,
	speciesData?: SpeciesData[],
	currentSpecies?: string
): string | null {
	switch (field.type) {
		case 'name':
		case 'text':
		case 'date':
		case 'citizenship':
			return value ? `${field.label}: ${value}` : null;

		case 'textarea':
			return value ? `${field.label}:\n${value}` : null;

		case 'list': {
			const lines = splitLines(value as string);
			return lines.length ? `${field.label}:\n${formatBullets(lines)}` : null;
		}

		case 'number':
			return value != null && value !== 0 ? `${field.label}: ${value}` : null;

		case 'height':
			return value ? `${field.label}: ${value} cm (${cmToFeetInches(value as number)})` : null;

		case 'weight': {
			if (!value) return null;
			const lb = Math.round(kgToLb(value as number));
			return `${field.label}: ${value} kg (${lb} lb)`;
		}

		case 'species': {
			if (!value || !speciesData) return null;
			const sp = speciesData.find((s) => s.id === value);
			return sp ? `${field.label}: ${sp.name}` : `${field.label}: ${value}`;
		}

		case 'subspecies': {
			if (!value || !speciesData || !currentSpecies) return null;
			const sp = speciesData.find((s) => s.id === currentSpecies);
			if (!sp) return null;
			const sub = sp.subspecies.find((s) => s.id === value);
			return sub ? `${sp.subspeciesLabel}: ${sub.name}` : `${sp.subspeciesLabel}: ${value}`;
		}

		case 'languages': {
			const arr = value as string[] | undefined;
			return arr?.length ? `${field.label}: ${arr.join(', ')}` : null;
		}

		case 'checkbox': {
			const selected = value as string[] | undefined;
			if (!selected?.length) return null;
			const labels = selected
				.map((v) => field.options.find((o) => o.value === v)?.label ?? v)
			return `${field.label}:\n${formatBullets(labels)}`;
		}

		case 'select': {
			if (!value) return null;
			const opt = field.options.find((o) => o.value === value);
			return `${field.label}: ${opt?.label ?? value}`;
		}

		case 'multi-select': {
			const vals = value as string[] | undefined;
			if (!vals?.length) return null;
			const labels = vals.map((v) => field.options.find((o) => o.value === v)?.label ?? v);
			return `${field.label}: ${labels.join(', ')}`;
		}
	}
}

export function generateRecord(
	template: Template,
	data: Record<string, unknown>,
	recordType: string,
	speciesData?: SpeciesData[]
): string {
	const publicRecord = template.records.find((r) => r.type === 'public');
	const targetRecord = template.records.find((r) => r.type === recordType);
	const currentSpecies = data['species'] as string | undefined;

	const parts: string[] = [];

	// Public section
	if (publicRecord) {
		const publicLines = renderFields(publicRecord.fields, data, speciesData, currentSpecies);
		if (publicLines.length) {
			parts.push('/// PUBLIC RECORD ///');
			parts.push(publicLines.join('\n'));
		}
	}

	// Target record section
	if (targetRecord) {
		const bodyLines = renderFields(targetRecord.fields, data, speciesData, currentSpecies);
		const typeLabel = recordType.toUpperCase();

		if (!bodyLines.length) {
			parts.push(`/// NO ${typeLabel} RECORD FOUND ///`);
		} else {
			parts.push(`/// ${typeLabel} RECORD ///`);
			if (targetRecord.preamble) {
				parts.push(targetRecord.preamble);
			}
			parts.push(bodyLines.join('\n\n'));
		}
	}

	parts.push(`LAST UPDATED: ${formatICDate(new Date())}`);
	return parts.join('\n\n');
}

function renderFields(
	fields: FieldDef[],
	data: Record<string, unknown>,
	speciesData?: SpeciesData[],
	currentSpecies?: string
): string[] {
	// Split fields into groups by separator boundaries
	const groups: FieldDef[][] = [[]];
	for (const field of fields) {
		if (field.type === 'separator') {
			groups.push([]);
		} else {
			groups[groups.length - 1].push(field);
		}
	}

	const rendered = groups.map((group) => {
		const lines: string[] = [];
		for (const field of group) {
			const out = formatFieldOutput(field, data[slugify(field.label)], speciesData, currentSpecies);
			if (out) lines.push(out);
		}
		return lines;
	});

	const result: string[] = [];
	for (const lines of rendered) {
		if (!lines.length) continue;
		if (result.length) result.push('');
		result.push(...lines);
	}
	return result;
}

function splitLines(text: string | undefined): string[] {
	if (!text) return [];
	return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

function formatBullets(items: string[]): string {
	return items.map((item) => ` - ${item}`).join('\n');
}
