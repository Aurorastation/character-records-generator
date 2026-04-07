<script lang="ts">
	import type { FieldDef } from '$lib/types';
	import { species } from '$lib/data';
	import { slugify } from '$lib/utils/slugify';
	import { resolveFieldLabel } from '$lib/utils/resolve-label';
	import { getFlag, setFlag } from '$lib/utils/field-flags';
	import TextField from './TextField.svelte';
	import TextareaField from './TextareaField.svelte';
	import ListField from './ListField.svelte';
	import NumberField from './NumberField.svelte';
	import SelectField from './SelectField.svelte';
	import CheckboxField from './CheckboxField.svelte';
	import MultiSelectField from './MultiSelectField.svelte';
	import DateField from './DateField.svelte';
	import HeightField from './HeightField.svelte';
	import WeightField from './WeightField.svelte';
	import SpeciesField from './SpeciesField.svelte';
	import SubspeciesField from './SubspeciesField.svelte';
	import CitizenshipField from './CitizenshipField.svelte';
	import LanguagesField from './LanguagesField.svelte';
	import SeparatorField from './SeparatorField.svelte';

	let { field, value, onChange, data, onSave }: {
		field: FieldDef;
		value: any;
		onChange: (v: any) => void;
		data: Record<string, unknown>;
		onSave: () => void;
	} = $props();

	let currentSpeciesId = $derived(data[slugify('Species')] as string | undefined);
	let override = $derived(resolveFieldLabel(field, species, currentSpeciesId));
	let key = $derived(slugify(field.label));
	let useDynamic = $derived(getFlag(data, key, 'useSpeciesLabel'));

	function toggleUseSpeciesLabel() {
		setFlag(data, key, 'useSpeciesLabel', !useDynamic);
		onSave();
	}
</script>

<div class={override !== null ? 'relative' : ''}>
	{#if override !== null}
		<label class="absolute top-0 right-0 flex items-center gap-1 cursor-pointer z-10">
			<input
				type="checkbox"
				checked={useDynamic}
				onchange={toggleUseSpeciesLabel}
				class="accent-[var(--accent)]"
			/>
			<span class="text-xs" style="color: var(--text-muted);">{override}</span>
		</label>
	{/if}

	{#if field.type === 'name'}
		<TextField field={{ ...field, type: 'text' }} {value} {onChange} />
	{:else if field.type === 'text'}
		<TextField {field} {value} {onChange} />
	{:else if field.type === 'textarea'}
		<TextareaField {field} {value} {onChange} />
	{:else if field.type === 'list'}
		<ListField {field} {value} {onChange} />
	{:else if field.type === 'number'}
		<NumberField {field} {value} {onChange} />
	{:else if field.type === 'select'}
		<SelectField {field} {value} {onChange} />
	{:else if field.type === 'multi-select'}
		<MultiSelectField {field} {value} {onChange} />
	{:else if field.type === 'checkbox'}
		<CheckboxField {field} {value} {onChange} />
	{:else if field.type === 'date'}
		<DateField {field} {value} {onChange} />
	{:else if field.type === 'height'}
		<HeightField {field} {value} {onChange} />
	{:else if field.type === 'weight'}
		<WeightField {field} {value} {onChange} />
	{:else if field.type === 'species'}
		<SpeciesField {field} {value} {onChange} />
	{:else if field.type === 'subspecies'}
		<SubspeciesField {field} {value} {onChange} {data} />
	{:else if field.type === 'citizenship'}
		<CitizenshipField {field} {value} {onChange} {data} />
	{:else if field.type === 'languages'}
		<LanguagesField {field} {value} {onChange} {data} />
	{:else if field.type === 'separator'}
		<SeparatorField {field} />
	{/if}
</div>
