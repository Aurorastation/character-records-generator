import type { FieldDef, Template } from './types';
import type { SpeciesData } from './data/types';
import { cmToFeetInches, kgToLb } from './utils/conversions';
import { formatICDate } from './utils/dates';
import { slugify } from './utils/slugify';
import { resolveFieldLabel } from './utils/resolve-label';
import { getAllFlags, type FieldFlags } from './utils/field-flags';

export function formatFieldOutput(
	field: FieldDef,
	value: unknown,
	speciesData?: SpeciesData[],
	currentSpecies?: string,
	flags?: Record<string, FieldFlags>
): string | null {
	const override = speciesData ? resolveFieldLabel(field, speciesData, currentSpecies) : null;
	const useDynamic = override !== null && (flags?.[slugify(field.label)]?.useSpeciesLabel ?? true);
	const label = useDynamic ? override : field.label;

	switch (field.type) {
		case 'name':
		case 'text':
		case 'date':
		case 'citizenship':
			return value ? `${label}: ${value}` : null;

		case 'textarea':
			return value ? `${label}:\n${value}` : null;

		case 'list': {
			const lines = splitLines(value as string);
			return lines.length ? `${label}:\n${formatBullets(lines)}` : null;
		}

		case 'number':
			return value != null && value !== 0 ? `${label}: ${value}` : null;

		case 'height':
			return value ? `${label}: ${value} cm (${cmToFeetInches(value as number)})` : null;

		case 'weight': {
			if (!value) return null;
			const lb = Math.round(kgToLb(value as number));
			return `${label}: ${value} kg (${lb} lb)`;
		}

		case 'species': {
			if (!value || !speciesData) return null;
			const sp = speciesData.find((s) => s.id === value);
			return sp ? `${label}: ${sp.name}` : `${label}: ${value}`;
		}

		case 'subspecies': {
			if (!value || !speciesData || !currentSpecies) return null;
			const sp = speciesData.find((s) => s.id === currentSpecies);
			if (!sp) return null;
			const sub = sp.subspecies.find((s) => s.id === value);
			return sub ? `${label}: ${sub.name}` : `${label}: ${value}`;
		}

		case 'languages': {
			const arr = value as string[] | undefined;
			return arr?.length ? `${label}: ${arr.join(', ')}` : null;
		}

		case 'checkbox': {
			const selected = value as string[] | undefined;
			if (!selected?.length) return null;
			const optLabels = selected
				.map((v) => field.options.find((o) => o.value === v)?.label ?? v)
			return `${label}:\n${formatBullets(optLabels)}`;
		}

		case 'select': {
			if (!value) return null;
			const opt = field.options.find((o) => o.value === value);
			return `${label}: ${opt?.label ?? value}`;
		}

		case 'multi-select': {
			const vals = value as string[] | undefined;
			if (!vals?.length) return null;
			const optLabels = vals.map((v) => field.options.find((o) => o.value === v)?.label ?? v);
			return `${label}: ${optLabels.join(', ')}`;
		}

		case 'separator':
			return null;
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
	const flags = getAllFlags(data);

	const parts: string[] = [];

	// Public section
	if (publicRecord) {
		const publicLines = renderFields(publicRecord.fields, data, speciesData, currentSpecies, flags);
		if (publicLines.length) {
			parts.push('/// PUBLIC RECORD ///');
			parts.push(publicLines.join('\n'));
		}
	}

	// Target record section
	if (targetRecord) {
		const bodyLines = renderFields(targetRecord.fields, data, speciesData, currentSpecies, flags);
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
	currentSpecies?: string,
	flags?: Record<string, FieldFlags>
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
			const out = formatFieldOutput(field, data[slugify(field.label)], speciesData, currentSpecies, flags);
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
