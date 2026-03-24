<script lang="ts">
	import type { LanguagesField } from '$lib/types';
	import { languages, species } from '$lib/data';
	import { slugify } from '$lib/utils/slugify';
	import MultiSelectField from './MultiSelectField.svelte';

	let { field, value = [], onChange, data }: {
		field: LanguagesField;
		value: string[];
		onChange: (v: string[]) => void;
		data: Record<string, unknown>;
	} = $props();

	let currentSpecies = $derived(species.find((s) => s.id === data[slugify('Species')]));
	let filtered = $derived(
		currentSpecies
			? languages.filter((l) => currentSpecies!.languages.includes(l.id))
			: languages
	);
	let options = $derived(filtered.map((l) => ({ value: l.name, label: l.name })));
	let multiField = $derived({ ...field, type: 'multi-select' as const, options });
</script>

<MultiSelectField field={multiField} {value} {onChange} />
