export interface SpeciesData {
	id: string;
	name: string;
	description?: string;
	labels: Record<string, string>;
	subspecies: { id: string; name: string; description?: string }[];
	languages: string[];
	citizenships: string[];
}

export interface CitizenshipData {
	id: string;
	name: string;
	description?: string;
}

export interface LanguageData {
	id: string;
	name: string;
	description?: string;
}
