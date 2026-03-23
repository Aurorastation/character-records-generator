<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import type { RecordDef } from '$lib/types';
	import DynamicField from './fields/DynamicField.svelte';
	import { slugify } from '$lib/utils/slugify';

	let { record, data, onFieldChange }: {
		record: RecordDef;
		data: Record<string, unknown>;
		onFieldChange: (key: string, value: any) => void;
	} = $props();

	let expanded = $state(false);

	let filled = $derived(
		record.fields.filter((f) => {
			const v = data[slugify(f.label)];
			if (v === undefined || v === null || v === '' || v === 0) return false;
			if (Array.isArray(v) && v.length === 0) return false;
			return true;
		}).length
	);
</script>

<section class="rounded border" style="border-color: var(--border); background: var(--bg-card);">
	<button
		onclick={() => { expanded = !expanded; }}
		class="flex items-center w-full px-4 py-3 text-left gap-3"
	>
		<ChevronDown
			size={16}
			class="transition-transform shrink-0"
			style="transform: rotate({expanded ? '0' : '-90'}deg); color: var(--text-muted);"
		/>
		<div class="flex-1 min-w-0">
			<span class="font-medium capitalize">{record.type}</span>
			{#if record.preamble}
				<span class="block text-xs truncate" style="color: var(--text-muted);">{record.preamble}</span>
			{/if}
		</div>
		<span class="text-sm tabular-nums" style="color: var(--text-muted);">
			{filled}/{record.fields.length}
		</span>
	</button>

	{#if expanded}
		<div class="px-4 pb-4 flex flex-col gap-4">
			{#each record.fields as field}
				<DynamicField
					{field}
					value={data[slugify(field.label)]}
					{data}
					onChange={(v) => onFieldChange(slugify(field.label), v)}
				/>
			{/each}
		</div>
	{/if}
</section>
