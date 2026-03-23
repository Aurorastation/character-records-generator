import { describe, it, expect } from 'vitest';
import { icYear, formatICDate } from './dates';

describe('icYear', () => {
	it('adds 442 to the real year', () => {
		expect(icYear(2026)).toBe(2468);
	});

	it('works for other years', () => {
		expect(icYear(2000)).toBe(2442);
	});
});

describe('formatICDate', () => {
	it('formats with ordinal suffixes', () => {
		expect(formatICDate(new Date(2026, 2, 1))).toBe('March 1st, 2468');
		expect(formatICDate(new Date(2026, 2, 2))).toBe('March 2nd, 2468');
		expect(formatICDate(new Date(2026, 2, 3))).toBe('March 3rd, 2468');
		expect(formatICDate(new Date(2026, 2, 4))).toBe('March 4th, 2468');
	});

	it('handles 11th, 12th, 13th', () => {
		expect(formatICDate(new Date(2026, 0, 11))).toBe('January 11th, 2468');
		expect(formatICDate(new Date(2026, 0, 12))).toBe('January 12th, 2468');
		expect(formatICDate(new Date(2026, 0, 13))).toBe('January 13th, 2468');
	});

	it('handles 21st, 22nd, 23rd', () => {
		expect(formatICDate(new Date(2026, 5, 21))).toBe('June 21st, 2468');
		expect(formatICDate(new Date(2026, 5, 22))).toBe('June 22nd, 2468');
		expect(formatICDate(new Date(2026, 5, 23))).toBe('June 23rd, 2468');
	});
});
