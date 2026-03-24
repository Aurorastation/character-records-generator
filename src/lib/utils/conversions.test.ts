import { describe, it, expect } from 'vitest';
import { cmToFeetInches, feetInchesToCm, kgToLb, lbToKg } from './conversions';

describe('cmToFeetInches', () => {
	it('converts 180 cm', () => {
		expect(cmToFeetInches(180)).toBe('5\'11"');
	});

	it('converts 152 cm', () => {
		expect(cmToFeetInches(152)).toBe('5\'0"');
	});

	it('converts 0 cm', () => {
		expect(cmToFeetInches(0)).toBe('0\'0"');
	});

	it('converts 30 cm (just inches)', () => {
		expect(cmToFeetInches(30)).toBe('1\'0"');
	});
});

describe('feetInchesToCm', () => {
	it('converts 5\'11" back', () => {
		expect(feetInchesToCm(5, 11)).toBeCloseTo(180.34, 0);
	});

	it('converts 0\'0"', () => {
		expect(feetInchesToCm(0, 0)).toBe(0);
	});
});

describe('kgToLb', () => {
	it('converts 75 kg', () => {
		expect(kgToLb(75)).toBeCloseTo(165.35, 0);
	});

	it('converts 0 kg', () => {
		expect(kgToLb(0)).toBe(0);
	});
});

describe('lbToKg', () => {
	it('converts 165 lb', () => {
		expect(lbToKg(165)).toBeCloseTo(74.84, 0);
	});

	it('converts 0 lb', () => {
		expect(lbToKg(0)).toBe(0);
	});
});
