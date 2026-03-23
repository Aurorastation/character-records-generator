import { describe, it, expect } from 'vitest';
import { isBlankCharacter } from './blank';
import type { Character } from '../types';

const template = {
	id: 'preset:standard',
	name: 'Standard',
	description: '',
	schemaVersion: 1,
	records: [
		{
			type: 'public',
			fields: [
				{ label: 'Name', type: 'text' as const },
				{ label: 'Species', type: 'species' as const },
				{ label: 'Spoken Languages', type: 'languages' as const }
			]
		}
	]
};

function makeChar(data: Record<string, unknown>): Character {
	return { id: 'test', template, data };
}

describe('isBlankCharacter', () => {
	it('returns true for empty data', () => {
		expect(isBlankCharacter(makeChar({}))).toBe(true);
	});

	it('returns true when all values are empty strings', () => {
		expect(isBlankCharacter(makeChar({ name: '', species: '' }))).toBe(true);
	});

	it('returns false when any string has a value', () => {
		expect(isBlankCharacter(makeChar({ name: 'Yury Zakharov' }))).toBe(false);
	});

	it('returns true for empty arrays', () => {
		expect(isBlankCharacter(makeChar({ 'spoken-languages': [] }))).toBe(true);
	});

	it('returns true when languages is just the default', () => {
		expect(isBlankCharacter(makeChar({ 'spoken-languages': ['Tau Ceti Basic'] }))).toBe(true);
	});

	it('returns false when languages has custom values', () => {
		expect(isBlankCharacter(makeChar({ 'spoken-languages': ['Tau Ceti Basic', "Siik'maas"] }))).toBe(false);
	});

	it('returns true for zero numbers', () => {
		expect(isBlankCharacter(makeChar({ height: 0, weight: 0 }))).toBe(true);
	});

	it('returns false for non-zero numbers', () => {
		expect(isBlankCharacter(makeChar({ height: 180 }))).toBe(false);
	});
});
