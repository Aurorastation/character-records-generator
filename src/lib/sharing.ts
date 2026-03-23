import pako from 'pako';
import type { Character, Template } from './types';

function toBase64url(bytes: Uint8Array): string {
	let binary = '';
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(str: string): Uint8Array {
	const padded = str.replace(/-/g, '+').replace(/_/g, '/');
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

function pruneEmpty(data: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(data)) {
		if (v === '' || v === undefined || v === null) continue;
		if (Array.isArray(v) && v.length === 0) continue;
		out[k] = v;
	}
	return out;
}

export function encodeCharacterURL(char: Character): string {
	const payload = {
		template: stripId(char.template),
		data: pruneEmpty(char.data)
	};
	const json = JSON.stringify(payload);
	const compressed = pako.deflate(new TextEncoder().encode(json));
	return 'c1.' + toBase64url(compressed);
}

export function decodeCharacterURL(encoded: string): { template: Omit<Template, 'id'>; data: Record<string, unknown> } {
	if (!encoded.startsWith('c1.')) throw new Error('Invalid character URL prefix');
	const bytes = fromBase64url(encoded.slice(3));
	const json = new TextDecoder().decode(pako.inflate(bytes));
	return JSON.parse(json);
}

export function encodeTemplateURL(template: Template): string {
	const payload = stripId(template);
	const json = JSON.stringify(payload);
	const compressed = pako.deflate(new TextEncoder().encode(json));
	return 't1.' + toBase64url(compressed);
}

export function decodeTemplateURL(encoded: string): Omit<Template, 'id'> {
	if (!encoded.startsWith('t1.')) throw new Error('Invalid template URL prefix');
	const bytes = fromBase64url(encoded.slice(3));
	const json = new TextDecoder().decode(pako.inflate(bytes));
	return JSON.parse(json);
}

function stripId(obj: Record<string, any>): Record<string, any> {
	const { id, ...rest } = obj;
	return rest;
}
