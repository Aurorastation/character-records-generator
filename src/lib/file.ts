import type { Character, Template } from './types';
import { pruneEmpty } from './sharing';
import { presets } from './presets';

interface CharacterFilePayload {
	version: number;
	templateId?: string;
	template: Omit<Template, 'id'>;
	data: Record<string, unknown>;
}

export function exportCharacter(char: Character): string {
	const isPreset = char.template.id.startsWith('preset:');
	const { id, ...templateWithoutId } = char.template;
	const payload: CharacterFilePayload = {
		version: 1,
		template: templateWithoutId,
		data: pruneEmpty(char.data)
	};
	if (isPreset) {
		payload.templateId = char.template.id;
	}
	return JSON.stringify(payload, null, 2);
}

export function parseCharacterFile(json: string): { template: Template | Omit<Template, 'id'>; data: Record<string, unknown> } {
	const payload = JSON.parse(json);
	if (!payload.data || typeof payload.data !== 'object') {
		throw new Error('Invalid character file: missing data');
	}
	if (!payload.template && !payload.templateId) {
		throw new Error('Invalid character file: missing template');
	}
	if (payload.templateId) {
		const preset = presets.find((p) => p.id === payload.templateId);
		if (preset) {
			return { template: preset, data: payload.data };
		}
	}
	if (payload.template) {
		return { template: payload.template, data: payload.data };
	}
	throw new Error('Invalid character file: could not resolve template');
}

export function characterFileName(char: Character): string {
	const name = char.data.name as string | undefined;
	if (!name || !name.trim()) return 'character.json';
	return name.trim().replace(/[^a-zA-Z0-9'-]/g, '-').replace(/-+/g, '-') + '.json';
}
