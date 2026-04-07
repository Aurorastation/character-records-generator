import { describe, it, expect } from 'vitest';
import { resolveFieldLabel } from './resolve-label';
import type { FieldDef } from '$lib/types';
import type { SpeciesData } from '$lib/data/types';

const stubSpecies: SpeciesData[] = [
	{
		id: 'tajara',
		name: 'Tajara',
		labels: { subspecies: 'Ethnicity', 'skin-color': 'Fur Colour' },
		subspecies: [{ id: 'hharar', name: 'Hharar' }],
		languages: [],
		citizenships: []
	}
];

describe('resolveFieldLabel', () => {
	it('returns species override when available', () => {
		const field: FieldDef = { label: 'Skin Color', type: 'text' };
		expect(resolveFieldLabel(field, stubSpecies, 'tajara')).toBe('Fur Colour');
	});

	it('returns null when no species is selected', () => {
		const field: FieldDef = { label: 'Skin Color', type: 'text' };
		expect(resolveFieldLabel(field, stubSpecies, undefined)).toBeNull();
	});

	it('returns null when species has no label for the field', () => {
		const field: FieldDef = { label: 'Height', type: 'height' };
		expect(resolveFieldLabel(field, stubSpecies, 'tajara')).toBeNull();
	});

	it('returns null for separator fields', () => {
		const field: FieldDef = { label: 'Appearance', type: 'separator' };
		expect(resolveFieldLabel(field, stubSpecies, 'tajara')).toBeNull();
	});
});
