<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDown } from 'lucide-svelte';
	import type { FieldDef, RecordDef } from '$lib/types';
	import DynamicField from './fields/DynamicField.svelte';
	import { slugify } from '$lib/utils/slugify';

	let { record, data, onFieldChange }: {
		record: RecordDef;
		data: Record<string, unknown>;
		onFieldChange: (key: string, value: any) => void;
	} = $props();

	let expanded = $state(false);
	let touched: Record<string, boolean> = $state({});

	function isFieldEmpty(v: unknown): boolean {
		if (v === undefined || v === null || v === '' || v === 0) return true;
		if (Array.isArray(v) && v.length === 0) return true;
		return false;
	}

	function isRequired(field: FieldDef): boolean {
		if (field.type === 'separator') return false;
		return !!field.required;
	}

	let dataFields = $derived(record.fields.filter((f) => f.type !== 'separator'));
	let filled = $derived(
		dataFields.filter((f) => !isFieldEmpty(data[slugify(f.label)])).length
	);
</script>

<section class="rounded border" style="border-color: var(--border); background: var(--bg-card);">
	<button
		onclick={() => { expanded = !expanded; }}
		class="flex items-center w-full px-4 py-3 text-left gap-3 min-h-[44px]"
	>
		<ChevronDown
			size={16}
			class="shrink-0 transition-transform duration-200"
			style="transform: rotate({expanded ? '0' : '-90'}deg); color: var(--text-muted);"
		/>
		<div class="flex-1 min-w-0">
			<span class="font-medium capitalize">{record.type}</span>
			{#if record.note || record.preamble}
				<div class="flex flex-col{record.note && record.preamble ? ' gap-1' : ''}">
					{#if record.note}
						<span class="block text-xs" style="color: var(--text-muted);">{record.note}</span>
					{/if}
					{#if record.preamble}
						<span class="block text-xs" style="color: var(--text-muted);">{record.preamble}</span>
					{/if}
				</div>
			{/if}
		</div>
		<span class="text-sm tabular-nums" style="color: var(--text-muted);">
			{filled}/{dataFields.length}
		</span>
	</button>

	{#if expanded}
		<div transition:slide={{ duration: 150 }} class="px-4 pb-4 flex flex-col gap-4">
			{#each record.fields as field}
				{@const key = slugify(field.label)}
				{@const hasError = isRequired(field) && touched[key] && isFieldEmpty(data[key])}
				<div
					class={hasError ? 'field-error' : ''}
					onfocusout={(e) => {
						if (isRequired(field) && !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
							touched[key] = true;
						}
					}}
				>
					<DynamicField
						{field}
						value={data[key]}
						{data}
						onChange={(v) => onFieldChange(key, v)}
					/>
					{#if hasError}
						<p class="text-xs mt-1" style="color: var(--error);">This field is required</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
