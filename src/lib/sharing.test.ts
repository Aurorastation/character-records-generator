import { describe, it, expect } from 'vitest';
import {
	encodeCharacterURL,
	decodeCharacterURL,
	encodeTemplateURL,
	decodeTemplateURL
} from './sharing';
import type { Character, Template } from './types';

const testTemplate: Template = {
	id: 'preset:standard',
	name: 'Standard',
	description: 'The standard record format.',
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

const testCharacter: Character = {
	id: 'abc-123',
	template: testTemplate,
	data: {
		name: 'Yury Zakharov',
		species: 'human',
		'employment-history': 'Shaft Miner'
	}
};

describe('character URL encoding', () => {
	it('round-trips character data', () => {
		const encoded = encodeCharacterURL(testCharacter);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded.data).toEqual(testCharacter.data);
		expect(decoded.template.name).toBe('Standard');
	});

	it('starts with c1. prefix', () => {
		const encoded = encodeCharacterURL(testCharacter);
		expect(encoded.startsWith('c1.')).toBe(true);
	});

	it('strips id', () => {
		const encoded = encodeCharacterURL(testCharacter);
		const decoded = decodeCharacterURL(encoded);
		expect(decoded).not.toHaveProperty('id');
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
		const encoded = encodeTemplateURL(testTemplate);
		const decoded = decodeTemplateURL(encoded);
		expect(decoded.name).toBe('Standard');
		expect(decoded.records).toEqual(testTemplate.records);
	});

	it('starts with t1. prefix', () => {
		const encoded = encodeTemplateURL(testTemplate);
		expect(encoded.startsWith('t1.')).toBe(true);
	});

	it('strips id', () => {
		const encoded = encodeTemplateURL(testTemplate);
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
