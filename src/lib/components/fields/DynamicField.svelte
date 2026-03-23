<script lang="ts">
	import type { FieldDef } from '$lib/types';
	import TextField from './TextField.svelte';
	import TextareaField from './TextareaField.svelte';
	import ListField from './ListField.svelte';
	import NumberField from './NumberField.svelte';
	import SelectField from './SelectField.svelte';
	import CheckboxField from './CheckboxField.svelte';
	import DateField from './DateField.svelte';
	import HeightField from './HeightField.svelte';
	import WeightField from './WeightField.svelte';
	import SpeciesField from './SpeciesField.svelte';
	import SubspeciesField from './SubspeciesField.svelte';
	import CitizenshipField from './CitizenshipField.svelte';
	import LanguagesField from './LanguagesField.svelte';

	let { field, value, onChange, data }: {
		field: FieldDef;
		value: any;
		onChange: (v: any) => void;
		data: Record<string, unknown>;
	} = $props();
</script>

{#if field.type === 'text'}
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
	<CheckboxField field={{ ...field, type: 'checkbox' }} {value} {onChange} />
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
	<CitizenshipField {field} {value} {onChange} />
{:else if field.type === 'languages'}
	<LanguagesField {field} {value} {onChange} />
{/if}
