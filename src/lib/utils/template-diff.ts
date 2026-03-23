import type { Template } from '../types';

export interface TemplateDiff {
	addedFields: string[];
	removedFields: string[];
	renamedFields: { from: string; to: string }[];
	addedRecords: string[];
	removedRecords: string[];
}

export function diffTemplates(old: Template, current: Template): TemplateDiff {
	const oldRecordTypes = new Set(old.records.map((r) => r.type));
	const newRecordTypes = new Set(current.records.map((r) => r.type));

	const oldFields = new Set(old.records.flatMap((r) => r.fields.map((f) => f.label)));
	const newFields = new Set(current.records.flatMap((r) => r.fields.map((f) => f.label)));

	// Detect renames via `from` attribute
	const renamedFields: { from: string; to: string }[] = [];
	const renamedOld = new Set<string>();
	const renamedNew = new Set<string>();

	for (const record of current.records) {
		for (const field of record.fields) {
			if (!field.from) continue;
			const fromNames = field.from.split(',').map((s) => s.trim());
			const match = fromNames.find((f) => oldFields.has(f));
			if (match && !newFields.has(match)) {
				renamedFields.push({ from: match, to: field.label });
				renamedOld.add(match);
				renamedNew.add(field.label);
			}
		}
	}

	return {
		addedFields: [...newFields].filter((f) => !oldFields.has(f) && !renamedNew.has(f)),
		removedFields: [...oldFields].filter((f) => !newFields.has(f) && !renamedOld.has(f)),
		renamedFields,
		addedRecords: [...newRecordTypes].filter((r) => !oldRecordTypes.has(r)),
		removedRecords: [...oldRecordTypes].filter((r) => !newRecordTypes.has(r))
	};
}

export function hasChanges(diff: TemplateDiff): boolean {
	return diff.addedFields.length > 0
		|| diff.removedFields.length > 0
		|| diff.renamedFields.length > 0
		|| diff.addedRecords.length > 0
		|| diff.removedRecords.length > 0;
}
