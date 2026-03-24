import type { Character } from '../types';

export function isBlankCharacter(char: Character): boolean {
	if (!char.data) return true;
	for (const value of Object.values(char.data)) {
		if (value === '' || value === undefined || value === null || value === 0) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			return false;
		}
		return false;
	}
	return true;
}
