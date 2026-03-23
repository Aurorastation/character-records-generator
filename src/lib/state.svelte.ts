import { getAllCharacters, saveCharacter, deleteCharacter } from './storage';
import { isBlankCharacter } from './utils/blank';
import type { Character, Template } from './types';

let characters = $state<Character[]>([]);
let activeId = $state<string | null>(null);
let saveStatus = $state<'idle' | 'saving' | 'saved'>('idle');
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let statusTimer: ReturnType<typeof setTimeout> | null = null;

export const roster = {
	get characters() { return characters; },
	get active() { return characters.find((c) => c.id === activeId) ?? null; },
	get saveStatus() { return saveStatus; },

	async load() {
		const all = await getAllCharacters();
		const kept: Character[] = [];
		for (const char of all) {
			if (isBlankCharacter(char)) {
				await deleteCharacter(char.id);
			} else {
				kept.push(char);
			}
		}
		characters = kept;

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
