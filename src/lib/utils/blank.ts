import type { Character } from '../types';
import { FLAGS_KEY } from './field-flags';

export function isBlankCharacter(char: Character): boolean {
	if (!char.data) return true;
	for (const [key, value] of Object.entries(char.data)) {
		if (key === FLAGS_KEY) continue;
		if (value === '' || value === undefined || value === null || value === 0) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			return false;
		}
		return false;
	}
	return true;
}
