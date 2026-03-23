export interface SpeciesData {
	id: string;
	name: string;
	description?: string;
	subspeciesLabel: string;
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
