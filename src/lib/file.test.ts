import { describe, it, expect } from 'vitest';
import { exportCharacter, parseCharacterFile } from './file';
import { presets } from './presets';
import type { Character } from './types';

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

describe('exportCharacter', () => {
	it('returns valid JSON with version, templateId, template, and data', () => {
		const json = exportCharacter(testCharacter);
		const parsed = JSON.parse(json);
		expect(parsed.version).toBe(1);
		expect(parsed.templateId).toBe('preset:standard');
		expect(parsed.template).toBeDefined();
		expect(parsed.template.name).toBe('Standard');
		expect(parsed.data).toEqual({
			name: 'Yury Zakharov',
			species: 'human',
			'employment-history': 'Shaft Miner'
		});
	});

	it('strips template id from embedded template', () => {
		const json = exportCharacter(testCharacter);
		const parsed = JSON.parse(json);
		expect(parsed.template).not.toHaveProperty('id');
	});

	it('prunes empty values from data', () => {
		const char: Character = {
			...testCharacter,
			data: { name: 'Yury Zakharov', species: '', 'hair-color': '' }
		};
		const json = exportCharacter(char);
		const parsed = JSON.parse(json);
		expect(parsed.data).toEqual({ name: 'Yury Zakharov' });
	});

	it('omits templateId for non-preset templates', () => {
		const char: Character = {
			...testCharacter,
			template: {
				id: 'custom:test',
				name: 'Custom',
				description: 'Test',
				schemaVersion: 1,
				records: []
			}
		};
		const json = exportCharacter(char);
		const parsed = JSON.parse(json);
		expect(parsed.templateId).toBeUndefined();
		expect(parsed.template.name).toBe('Custom');
	});
});

describe('parseCharacterFile', () => {
	it('resolves preset template by templateId', () => {
		const json = exportCharacter(testCharacter);
		const result = parseCharacterFile(json);
		expect(result.template).toHaveProperty('id', 'preset:standard');
		expect(result.data.name).toBe('Yury Zakharov');
	});

	it('falls back to embedded template for unknown preset', () => {
		const payload = {
			version: 1,
			templateId: 'preset:nonexistent',
			template: { name: 'Fallback', description: '', schemaVersion: 1, records: [] },
			data: { name: 'Test' }
		};
		const result = parseCharacterFile(JSON.stringify(payload));
		expect(result.template.name).toBe('Fallback');
		expect(result.template).not.toHaveProperty('id');
	});

	it('uses embedded template when no templateId', () => {
		const payload = {
			version: 1,
			template: { name: 'Custom', description: '', schemaVersion: 1, records: [] },
			data: { name: 'Test' }
		};
		const result = parseCharacterFile(JSON.stringify(payload));
		expect(result.template.name).toBe('Custom');
	});

	it('throws on invalid JSON', () => {
		expect(() => parseCharacterFile('not json')).toThrow();
	});

	it('throws on missing data field', () => {
		const payload = { version: 1, template: { name: 'X', description: '', schemaVersion: 1, records: [] } };
		expect(() => parseCharacterFile(JSON.stringify(payload))).toThrow();
	});

	it('throws on missing template and templateId', () => {
		const payload = { version: 1, data: { name: 'Test' } };
		expect(() => parseCharacterFile(JSON.stringify(payload))).toThrow();
	});
});
