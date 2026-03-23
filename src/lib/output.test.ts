import { describe, it, expect } from 'vitest';
import { formatFieldOutput, generateRecord } from './output';
import type { FieldDef, Template } from './types';
import type { SpeciesData } from './data/types';

const stubSpecies: SpeciesData[] = [
	{
		id: 'human',
		name: 'Human',
		description: '',
		subspeciesLabel: 'Variant',
		subspecies: [{ id: 'offworlder', name: 'Offworlder', description: '' }],
		languages: ['tau-ceti-basic'],
		citizenships: ['biesel']
	},
	{
		id: 'tajara',
		name: 'Tajara',
		description: '',
		subspeciesLabel: 'Ethnicity',
		subspecies: [
			{ id: 'hharar', name: 'Hharar', description: '' },
			{ id: 'zhan-khazan', name: 'Zhan-Khazan', description: '' }
		],
		languages: ['siik-maas'],
		citizenships: ['pra']
	}
];

describe('formatFieldOutput', () => {
	it('formats text fields', () => {
		const field: FieldDef = { label: 'Pronouns', type: 'text' };
		expect(formatFieldOutput(field, 'she/her')).toBe('Pronouns: she/her');
	});

	it('returns null for empty text', () => {
		const field: FieldDef = { label: 'Pronouns', type: 'text' };
		expect(formatFieldOutput(field, '')).toBeNull();
		expect(formatFieldOutput(field, undefined)).toBeNull();
	});

	it('formats textarea with header', () => {
		const field: FieldDef = { label: 'Distinguishing Features', type: 'textarea' };
		expect(formatFieldOutput(field, 'Scar across left eye')).toBe(
			'Distinguishing Features:\nScar across left eye'
		);
	});

	it('returns null for empty textarea', () => {
		const field: FieldDef = { label: 'Distinguishing Features', type: 'textarea' };
		expect(formatFieldOutput(field, '')).toBeNull();
	});

	it('formats list as bullet points', () => {
		const field: FieldDef = { label: 'Employment History', type: 'list' };
		expect(formatFieldOutput(field, 'Shaft Miner')).toBe(
			'Employment History:\n - Shaft Miner'
		);
	});

	it('returns null for empty list', () => {
		const field: FieldDef = { label: 'Employment History', type: 'list' };
		expect(formatFieldOutput(field, '')).toBeNull();
	});

	it('filters blank lines from list', () => {
		const field: FieldDef = { label: 'Employment History', type: 'list' };
		expect(formatFieldOutput(field, 'Line 1\n\nLine 2\n')).toBe(
			'Employment History:\n - Line 1\n - Line 2'
		);
	});

	it('formats height with conversion', () => {
		const field: FieldDef = { label: 'Height', type: 'height' };
		expect(formatFieldOutput(field, 180)).toBe('Height: 180 cm (5\'11")');
	});

	it('returns null for zero/undefined height', () => {
		const field: FieldDef = { label: 'Height', type: 'height' };
		expect(formatFieldOutput(field, 0)).toBeNull();
		expect(formatFieldOutput(field, undefined)).toBeNull();
	});

	it('formats weight with conversion', () => {
		const field: FieldDef = { label: 'Weight', type: 'weight' };
		expect(formatFieldOutput(field, 75)).toBe('Weight: 75 kg (165 lb)');
	});

	it('returns null for zero/undefined weight', () => {
		const field: FieldDef = { label: 'Weight', type: 'weight' };
		expect(formatFieldOutput(field, 0)).toBeNull();
	});

	it('formats species with display name', () => {
		const field: FieldDef = { label: 'Species', type: 'species' };
		expect(formatFieldOutput(field, 'tajara', stubSpecies)).toBe('Species: Tajara');
	});

	it('formats subspecies with dynamic label', () => {
		const field: FieldDef = { label: 'Subspecies', type: 'subspecies' };
		expect(formatFieldOutput(field, 'hharar', stubSpecies, 'tajara')).toBe('Ethnicity: Hharar');
	});

	it('returns null for empty subspecies', () => {
		const field: FieldDef = { label: 'Subspecies', type: 'subspecies' };
		expect(formatFieldOutput(field, '', stubSpecies, 'tajara')).toBeNull();
	});

	it('formats languages as comma list', () => {
		const field: FieldDef = { label: 'Spoken Languages', type: 'languages' };
		expect(formatFieldOutput(field, ['Tau Ceti Basic', 'Siik\'maas'])).toBe(
			'Spoken Languages: Tau Ceti Basic, Siik\'maas'
		);
	});

	it('returns null for empty languages', () => {
		const field: FieldDef = { label: 'Spoken Languages', type: 'languages' };
		expect(formatFieldOutput(field, [])).toBeNull();
	});

	it('formats checkbox as bullet list of selected', () => {
		const field: FieldDef = {
				label: 'Opt-Outs',
			type: 'checkbox',
			options: [
				{ value: 'no-borg', label: 'Do Not Borgify' },
				{ value: 'no-revive', label: 'Do Not Revive' },
				{ value: 'no-prosthetic', label: 'Do Not Prostheticize' }
			]
		};
		expect(formatFieldOutput(field, ['no-borg', 'no-revive'])).toBe(
			'Opt-Outs:\n - Do Not Borgify\n - Do Not Revive'
		);
	});

	it('returns null for empty checkbox', () => {
		const field: FieldDef = {
				label: 'Opt-Outs',
			type: 'checkbox',
			options: [{ value: 'no-borg', label: 'Do Not Borgify' }]
		};
		expect(formatFieldOutput(field, [])).toBeNull();
	});

	it('formats select fields', () => {
		const field: FieldDef = {
				label: 'Citizenship',
			type: 'select',
			options: [{ value: 'biesel', label: 'Republic of Biesel' }]
		};
		expect(formatFieldOutput(field, 'biesel')).toBe('Citizenship: Republic of Biesel');
	});

	it('formats date fields', () => {
		const field: FieldDef = { label: 'Date of Birth', type: 'date' };
		expect(formatFieldOutput(field, 'March 15th, 2438')).toBe('Date of Birth: March 15th, 2438');
	});

	it('formats number fields', () => {
		const field: FieldDef = { label: 'Age', type: 'number' };
		expect(formatFieldOutput(field, 30)).toBe('Age: 30');
	});

	it('formats citizenship type', () => {
		const field: FieldDef = { label: 'Citizenship', type: 'citizenship' };
		expect(formatFieldOutput(field, 'Republic of Biesel')).toBe('Citizenship: Republic of Biesel');
	});

	it('formats multi-select as comma list', () => {
		const field: FieldDef = {
				label: 'Other Skills',
			type: 'multi-select',
			options: [
				{ value: 'engineering', label: 'Engineering' },
				{ value: 'medical', label: 'Medical' }
			]
		};
		expect(formatFieldOutput(field, ['engineering', 'medical'])).toBe(
			'Other Skills: Engineering, Medical'
		);
	});
});

const testTemplate: Template = {
	id: 'test',
	name: 'Test Template',
	description: '',
	schemaVersion: 1,
	records: [
		{
			type: 'public',
			expanded: true,
			fields: [
				{ label: 'Name', type: 'text' },
				{ label: 'Species', type: 'species' },
				{ label: 'Pronouns', type: 'text' }
			]
		},
		{
			type: 'employment',
			expanded: false,
			preamble: 'This information has been verified by employment agents.',
			fields: [
				{ label: 'Employment History', type: 'list' },
				{ label: 'Formal Education', type: 'list' }
			]
		},
		{
			type: 'medical',
			expanded: false,
			preamble: 'Protected by doctor-patient confidentiality.',
			fields: [
				{
								label: 'Opt-Outs',
					type: 'checkbox',
					options: [{ value: 'no-borg', label: 'Do Not Borgify' }]
				},
				{ label: 'Allergies', type: 'list' }
			]
		},
		{
			type: 'security',
			expanded: false,
			preamble: 'This information has been verified by employment agents.',
			fields: [
				{ label: 'Attitude Towards SCC', type: 'textarea' },
				{ label: 'Arrest History', type: 'list' }
			]
		}
	]
};

describe('generateRecord', () => {
	it('includes public header and employment body', () => {
		const data = {
			name: 'Yury Zakharov',
			species: 'tajara',
			'employment-history': 'Janitor'
		};
		const out = generateRecord(testTemplate, data, 'employment', stubSpecies);
		expect(out).toContain('/// PUBLIC RECORD ///');
		expect(out).toContain('Name: Yury Zakharov');
		expect(out).toContain('Species: Tajara');
		expect(out).toContain('/// EMPLOYMENT RECORD ///');
		expect(out).toContain('This information has been verified by employment agents.');
		expect(out).toContain(' - Janitor');
		expect(out).toContain('LAST UPDATED:');
	});

	it('shows NO RECORD FOUND when body is empty', () => {
		const data = { name: 'Yury Zakharov' };
		const out = generateRecord(testTemplate, data, 'medical', stubSpecies);
		expect(out).toContain('/// NO MEDICAL RECORD FOUND ///');
	});

	it('includes preamble in medical record', () => {
		const data = {
			name: 'Yury Zakharov',
			allergies: 'Peanuts'
		};
		const out = generateRecord(testTemplate, data, 'medical', stubSpecies);
		expect(out).toContain('Protected by doctor-patient confidentiality.');
		expect(out).toContain(' - Peanuts');
	});

	it('includes preamble in security record', () => {
		const data = {
			name: 'Yury Zakharov',
			'attitude-towards-scc': 'Loyal employee'
		};
		const out = generateRecord(testTemplate, data, 'security', stubSpecies);
		expect(out).toContain('/// SECURITY RECORD ///');
		expect(out).toContain('This information has been verified by employment agents.');
		expect(out).toContain('Loyal employee');
	});
});
