import { describe, it, expect } from 'vitest';
import { buildCharacterSchema } from './schema';
import type { Template } from './types';

function makeTemplate(fields: any[]): Template {
	return {
		id: 'test',
		name: 'Test',
		description: '',
		schemaVersion: 1,
		records: [{ type: 'public', expanded: true, fields }]
	};
}

describe('buildCharacterSchema', () => {
	it('validates text fields as optional strings', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'pronouns', label: 'Pronouns', type: 'text' }])
		);
		expect(schema.parse({})).toEqual({});
		expect(schema.parse({ pronouns: 'She/her' })).toEqual({ pronouns: 'She/her' });
	});

	it('validates textarea fields as optional strings', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{ key: 'distinguishing-features', label: 'Distinguishing Features', type: 'textarea' }
			])
		);
		expect(schema.parse({ 'distinguishing-features': 'Scar across left eye' })).toEqual({
			'distinguishing-features': 'Scar across left eye'
		});
		expect(schema.parse({})).toEqual({});
	});

	it('validates list fields as optional strings', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{ key: 'employment-history', label: 'Employment History', type: 'list' }
			])
		);
		expect(schema.parse({ 'employment-history': 'NanoTrasen Intern\nShaft Miner' })).toEqual({
			'employment-history': 'NanoTrasen Intern\nShaft Miner'
		});
		expect(schema.parse({})).toEqual({});
	});

	it('validates date fields as optional strings', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{ key: 'date-of-birth', label: 'Date of Birth', type: 'date', placeholder: 'March 15th, 2438' }
			])
		);
		expect(schema.parse({ 'date-of-birth': 'March 15th, 2438' })).toEqual({
			'date-of-birth': 'March 15th, 2438'
		});
	});

	it('validates select fields as optional strings', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{
					key: 'citizenship',
					label: 'Citizenship',
					type: 'select',
					options: [{ value: 'biesel', label: 'Republic of Biesel' }]
				}
			])
		);
		expect(schema.parse({ citizenship: 'biesel' })).toEqual({ citizenship: 'biesel' });
	});

	it('validates number fields as optional numbers', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'age', label: 'Age', type: 'number', min: 0, max: 999 }])
		);
		expect(schema.parse({ age: 30 })).toEqual({ age: 30 });
		expect(schema.parse({})).toEqual({});
	});

	it('validates height as optional number', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'height', label: 'Height', type: 'height' }])
		);
		expect(schema.parse({ height: 180 })).toEqual({ height: 180 });
	});

	it('validates weight as optional number', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'weight', label: 'Weight', type: 'weight' }])
		);
		expect(schema.parse({ weight: 75 })).toEqual({ weight: 75 });
	});

	it('validates name as optional string', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'name', label: 'Name', type: 'text' }])
		);
		expect(schema.parse({ name: 'Ka\'Akaix\'Lak Zo\'ra' })).toEqual({
			name: 'Ka\'Akaix\'Lak Zo\'ra'
		});
		expect(schema.parse({})).toEqual({});
	});

	it('validates multi-select as optional string array', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{
					key: 'spoken-languages',
					label: 'Spoken Languages',
					type: 'multi-select',
					options: [
						{ value: 'tau-ceti-basic', label: 'Tau Ceti Basic' },
						{ value: 'sol-common', label: 'Sol Common' }
					]
				}
			])
		);
		expect(schema.parse({ 'spoken-languages': ['tau-ceti-basic', 'sol-common'] })).toEqual({
			'spoken-languages': ['tau-ceti-basic', 'sol-common']
		});
		expect(schema.parse({})).toEqual({});
	});

	it('validates checkbox as optional string array', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{
					key: 'opt-outs',
					label: 'Opt-Outs',
					type: 'checkbox',
					options: [
						{ value: 'no-borg', label: 'Do Not Borgify' },
						{ value: 'no-revive', label: 'Do Not Revive' },
						{ value: 'no-prosthetic', label: 'Do Not Prostheticize' }
					]
				}
			])
		);
		expect(schema.parse({ 'opt-outs': ['no-borg', 'no-revive'] })).toEqual({
			'opt-outs': ['no-borg', 'no-revive']
		});
	});

	it('validates languages as optional string array', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{ key: 'spoken-languages', label: 'Spoken Languages', type: 'languages' }
			])
		);
		expect(
			schema.parse({ 'spoken-languages': ['Tau Ceti Basic', 'Siik\'maas'] })
		).toEqual({
			'spoken-languages': ['Tau Ceti Basic', 'Siik\'maas']
		});
	});

	it('validates species as optional string', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'species', label: 'Species', type: 'species' }])
		);
		expect(schema.parse({ species: 'tajara' })).toEqual({ species: 'tajara' });
	});

	it('validates subspecies as optional string', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'subspecies', label: 'Subspecies', type: 'subspecies' }])
		);
		expect(schema.parse({ subspecies: 'zhan-khazan' })).toEqual({
			subspecies: 'zhan-khazan'
		});
	});

	it('validates citizenship type as optional string', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'citizenship', label: 'Citizenship', type: 'citizenship' }])
		);
		expect(schema.parse({ citizenship: 'sol-alliance' })).toEqual({
			citizenship: 'sol-alliance'
		});
	});

	it('allows all fields to be missing', () => {
		const schema = buildCharacterSchema(
			makeTemplate([
				{ key: 'name', label: 'Name', type: 'text' },
				{ key: 'height', label: 'Height', type: 'height' },
				{ key: 'spoken-languages', label: 'Spoken Languages', type: 'languages' },
				{ key: 'skin-color', label: 'Skin Color', type: 'text' }
			])
		);
		expect(schema.parse({})).toEqual({});
	});

	it('rejects wrong types', () => {
		const schema = buildCharacterSchema(
			makeTemplate([{ key: 'height', label: 'Height', type: 'height' }])
		);
		expect(() => schema.parse({ height: 'tall' })).toThrow();
	});
});
