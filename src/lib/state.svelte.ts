import { getAllCharacters, saveCharacter, deleteCharacter } from './storage';
import { isBlankCharacter } from './utils/blank';
import { presets } from './presets';
import { diffTemplates, hasChanges, type TemplateDiff } from './utils/template-diff';
import { slugify } from './utils/slugify';
import type { Character, Template } from './types';

export interface PendingUpgrade {
	characterId: string;
	characterName: string;
	templateName: string;
	preset: Template;
	diff: TemplateDiff;
}

let characters = $state<Character[]>([]);
let activeId = $state<string | null>(null);
let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');
let pendingUpgrades = $state<PendingUpgrade[]>([]);
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let statusTimer: ReturnType<typeof setTimeout> | null = null;

function getSkippedUpgrades(): Record<string, string> {
	try {
		return JSON.parse(localStorage.getItem('skippedUpgrades') || '{}');
	} catch {
		return {};
	}
}

function upgradeFingerprint(preset: Template): string {
	const fields = preset.records.flatMap((r) => r.fields.map((f) => f.label)).sort();
	return `${preset.id}:${fields.join(',')}`;
}

function migrateData(char: Character, preset: Template) {
	for (const record of preset.records) {
		for (const field of record.fields) {
			if (!field.from) continue;
			const newKey = slugify(field.label);
			if (char.data[newKey] !== undefined) continue;
			const oldNames = field.from.split(',').map((s) => s.trim());
			for (const oldName of oldNames) {
				const oldKey = slugify(oldName);
				if (char.data[oldKey] !== undefined) {
					char.data[newKey] = char.data[oldKey];
					delete char.data[oldKey];
					break;
				}
			}
		}
	}
}

function charDisplayName(char: Character): string {
	return (char.data['name'] as string)
		|| (char.data['designation'] as string)
		|| 'Unnamed Character';
}

export const roster = {
	get characters() { return characters; },
	get active() { return characters.find((c) => c.id === activeId) ?? null; },
	get saveStatus() { return saveStatus; },
	get pendingUpgrades() { return pendingUpgrades; },

	clearUpgrades() {
		pendingUpgrades = [];
	},

	async applyUpgrade(characterId: string) {
		const upgrade = pendingUpgrades.find((u) => u.characterId === characterId);
		const char = characters.find((c) => c.id === characterId);
		if (!upgrade || !char) return;

		migrateData(char, upgrade.preset);
		char.template = upgrade.preset;
		await saveCharacter($state.snapshot(char));
		const skipped = getSkippedUpgrades();
		delete skipped[characterId];
		localStorage.setItem('skippedUpgrades', JSON.stringify(skipped));
		pendingUpgrades = pendingUpgrades.filter((u) => u.characterId !== characterId);
	},

	skipUpgrade(characterId: string) {
		const upgrade = pendingUpgrades.find((u) => u.characterId === characterId);
		if (upgrade) {
			const skipped = getSkippedUpgrades();
			skipped[characterId] = upgradeFingerprint(upgrade.preset);
			localStorage.setItem('skippedUpgrades', JSON.stringify(skipped));
		}
		pendingUpgrades = pendingUpgrades.filter((u) => u.characterId !== characterId);
	},

	async load() {
		const all = await getAllCharacters();
		const kept: Character[] = [];
		const upgrades: PendingUpgrade[] = [];
		const skipped = getSkippedUpgrades();

		for (const char of all) {
			if (isBlankCharacter(char)) {
				await deleteCharacter(char.id);
				continue;
			}

			if (char.template.id.startsWith('preset:')) {
				const preset = presets.find((p) => p.id === char.template.id);
				if (preset) {
					const diff = diffTemplates(char.template, preset);
					if (hasChanges(diff)) {
						const fp = upgradeFingerprint(preset);
						if (skipped[char.id] === fp) {
							kept.push(char);
							continue;
						}
						upgrades.push({
							characterId: char.id,
							characterName: charDisplayName(char),
							templateName: preset.name,
							preset,
							diff
						});
					}
				}
			}

			kept.push(char);
		}

		characters = kept;
		pendingUpgrades = upgrades;

		const stored = localStorage.getItem('activeCharacterId');
		if (stored && characters.some((c) => c.id === stored)) {
			activeId = stored;
		} else if (characters.length) {
			activeId = characters[0].id;
		}
	},

	async create(template: Template, data: Record<string, unknown> = {}) {
		const char: Character = {
			id: crypto.randomUUID(),
			template: $state.snapshot(template),
			data: { ...data }
		};
		characters.push(char);
		activeId = char.id;
		localStorage.setItem('activeCharacterId', char.id);
		await saveCharacter($state.snapshot(char));
		return char;
	},

	async remove(id: string) {
		characters = characters.filter((c) => c.id !== id);
		await deleteCharacter(id);
		pendingUpgrades = pendingUpgrades.filter((u) => u.characterId !== id);
		if (activeId === id) {
			activeId = characters[0]?.id ?? null;
			if (activeId) localStorage.setItem('activeCharacterId', activeId);
			else localStorage.removeItem('activeCharacterId');
		}
	},

	async duplicate(id: string) {
		const source = characters.find((c) => c.id === id);
		if (!source) return;
		const copy: Character = {
			id: crypto.randomUUID(),
			template: $state.snapshot(source.template),
			data: $state.snapshot(source.data)
		};
		characters.push(copy);
		activeId = copy.id;
		localStorage.setItem('activeCharacterId', copy.id);
		await saveCharacter($state.snapshot(copy));
	},

	setActive(id: string) {
		activeId = id;
		localStorage.setItem('activeCharacterId', id);
	},

	scheduleSave(char: Character) {
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(async () => {
			saveStatus = 'saving';
			await saveCharacter($state.snapshot(char));
			saveStatus = 'saved';
			if (statusTimer) clearTimeout(statusTimer);
			statusTimer = setTimeout(() => { saveStatus = 'idle'; }, 1500);
		}, 300);
	}
};
