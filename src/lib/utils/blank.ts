import type { Character } from '../types';

const DEFAULT_LANGUAGES = ['Tau Ceti Basic'];

export function isBlankCharacter(char: Character): boolean {
	for (const value of Object.values(char.data)) {
		if (value === '' || value === undefined || value === null || value === 0) continue;
		if (Array.isArray(value)) {
			if (value.length === 0) continue;
			if (value.length === 1 && DEFAULT_LANGUAGES.includes(value[0])) continue;
			return false;
		}
		return false;
	}
	return true;
}
