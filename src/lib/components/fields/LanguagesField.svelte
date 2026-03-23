<script lang="ts">
	import type { LanguagesField } from '$lib/types';
	import { languages } from '$lib/data';
	import MultiSelectField from './MultiSelectField.svelte';

	let { field, value = ['Tau Ceti Basic'], onChange }: {
		field: LanguagesField;
		value: string[];
		onChange: (v: string[]) => void;
	} = $props();

	const options = languages.map((l) => ({ value: l.name, label: l.name }));
	const multiField = $derived({ ...field, type: 'multi-select' as const, options });
</script>

<MultiSelectField field={multiField} {value} {onChange} />
