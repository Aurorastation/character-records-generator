export const FLAGS_KEY = '__flags';

export interface FieldFlags {
	useSpeciesLabel?: boolean;
	hidden?: boolean;
}

const DEFAULTS: Required<FieldFlags> = {
	useSpeciesLabel: true,
	hidden: false
};

export function getFlag(
	data: Record<string, unknown>,
	fieldKey: string,
	flag: keyof FieldFlags
): boolean {
	const all = data[FLAGS_KEY] as Record<string, FieldFlags> | undefined;
	return all?.[fieldKey]?.[flag] ?? DEFAULTS[flag];
}

export function setFlag(
	data: Record<string, unknown>,
	fieldKey: string,
	flag: keyof FieldFlags,
	value: boolean
): void {
	if (!data[FLAGS_KEY]) data[FLAGS_KEY] = {};
	const all = data[FLAGS_KEY] as Record<string, FieldFlags>;
	if (!all[fieldKey]) all[fieldKey] = {};
	if (value === DEFAULTS[flag]) {
		delete all[fieldKey][flag];
		if (Object.keys(all[fieldKey]).length === 0) delete all[fieldKey];
		if (Object.keys(all).length === 0) delete data[FLAGS_KEY];
	} else {
		all[fieldKey][flag] = value;
	}
}

export function getAllFlags(
	data: Record<string, unknown>
): Record<string, FieldFlags> {
	return (data[FLAGS_KEY] as Record<string, FieldFlags>) ?? {};
}
