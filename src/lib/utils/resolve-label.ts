import type { FieldDef } from '$lib/types';
import type { SpeciesData } from '$lib/data/types';
import { slugify } from './slugify';

export function resolveFieldLabel(
	field: FieldDef,
	speciesData: SpeciesData[],
	currentSpeciesId: string | undefined
): string | null {
	if (field.type === 'separator') return null;
	if (!currentSpeciesId) return null;

	const sp = speciesData.find((s) => s.id === currentSpeciesId);
	if (!sp) return null;

	return sp.labels[slugify(field.label)] ?? null;
}
