import { openDB, type DBSchema } from 'idb';
import type { Character, Template } from './types';

interface RecordsDB extends DBSchema {
	characters: { key: string; value: Character };
	templates: { key: string; value: Template };
}

const dbPromise = openDB<RecordsDB>('aurora-records', 1, {
	upgrade(db) {
		db.createObjectStore('characters', { keyPath: 'id' });
		db.createObjectStore('templates', { keyPath: 'id' });
	}
});

export async function getAllCharacters() {
	return (await dbPromise).getAll('characters');
}

export async function getCharacter(id: string) {
	return (await dbPromise).get('characters', id);
}

export async function saveCharacter(char: Character) {
	await (await dbPromise).put('characters', char);
}

export async function deleteCharacter(id: string) {
	await (await dbPromise).delete('characters', id);
}

export async function getAllTemplates() {
	return (await dbPromise).getAll('templates');
}

export async function getTemplate(id: string) {
	return (await dbPromise).get('templates', id);
}

export async function saveTemplate(tmpl: Template) {
	await (await dbPromise).put('templates', tmpl);
}

export async function deleteTemplate(id: string) {
	await (await dbPromise).delete('templates', id);
}
