import { describe, it, expect } from 'vitest';
import {
	encodeCharacterURL,
	decodeCharacterURL,
	encodeTemplateURL,
	decodeTemplateURL
} from './sharing';
import { presets } from './presets';
import type { Character, Template } from './types';

const standardPreset = presets.find((p) => p.id === 'preset:standard')!;

const testCharacter: Character = {
	id: 'abc-123',
	template: standardPreset,
	data: {
		name: 'Yury Zakharov',
		species: 'human',
		'employment-history': 'Shaft Miner'
	}
};

const customTemplate: Template = {
	id: 'custom:test',
	name: 'Custom',
	description: 'A custom template.',
	schemaVersion: 1,
	records: [
		{
			type: 'public',
			fields: [
				{ label: 'Name', type: 'text' },
				{ label: 'Species', type: 'species' }
			]
		}
	]
};

describe('character URL encoding', () => {
	it('round-trips preset character data', () => {
		const encoded = encodeCharacterURL(testCharacter);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded.data).toEqual(testCharacter.data);
		expect(decoded.template.name).toBe('General');
	});

	it('uses short encoding for preset templates', () => {
		const encoded = encodeCharacterURL(testCharacter);
		const customChar = { ...testCharacter, template: customTemplate };
		const customEncoded = encodeCharacterURL(customChar);
		expect(encoded.length).toBeLessThan(customEncoded.length);
	});

	it('round-trips custom template character', () => {
		const char: Character = { ...testCharacter, template: customTemplate };
		const encoded = encodeCharacterURL(char);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded.data).toEqual(testCharacter.data);
		expect(decoded.template.name).toBe('Custom');
	});

	it('starts with c1. prefix', () => {
		const encoded = encodeCharacterURL(testCharacter);
		expect(encoded.startsWith('c1.')).toBe(true);
	});

	it('prunes empty values from data', () => {
		const char: Character = {
			...testCharacter,
			data: { name: 'Yury Zakharov', species: '', 'hair-color': '' }
		};
		const encoded = encodeCharacterURL(char);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded.data).toEqual({ name: 'Yury Zakharov' });
	});
});

describe('template URL encoding', () => {
	it('round-trips template structure', () => {
		const encoded = encodeTemplateURL(customTemplate);
		const decoded = decodeTemplateURL(encoded);
		expect(decoded.name).toBe('Custom');
		expect(decoded.records).toEqual(customTemplate.records);
	});

	it('starts with t1. prefix', () => {
		const encoded = encodeTemplateURL(customTemplate);
		expect(encoded.startsWith('t1.')).toBe(true);
	});

	it('strips id', () => {
		const encoded = encodeTemplateURL(customTemplate);
		const decoded = decodeTemplateURL(encoded);
		expect(decoded).not.toHaveProperty('id');
	});
});

describe('unicode support', () => {
	it('round-trips unicode content', () => {
		const char: Character = {
			...testCharacter,
			data: { name: "Ka'Akaix'Lak Zo'ra", species: 'vaurca' }
		};
		const encoded = encodeCharacterURL(char);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded.data.name).toBe("Ka'Akaix'Lak Zo'ra");
	});
});

describe('error handling', () => {
	it('throws on invalid character input', () => {
		expect(() => decodeCharacterURL('c1.invaliddata!!!')).toThrow();
	});

	it('throws on wrong prefix', () => {
		const encoded = encodeCharacterURL(testCharacter);
		expect(() => decodeTemplateURL(encoded)).toThrow();
	});
});
