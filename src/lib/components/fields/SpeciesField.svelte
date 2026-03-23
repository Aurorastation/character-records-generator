<script lang="ts">
	import type { SpeciesField } from '$lib/types';
	import { species } from '$lib/data';

	let { field, value = '', onChange }: { field: SpeciesField; value: string; onChange: (v: string) => void } = $props();

	let selected = $derived(species.find((s) => s.id === value));
</script>

<div class="block">
	<label class="block">
		<span class="text-sm font-medium">{field.label}</span>
		<select
			{value}
			onchange={(e) => onChange((e.target as HTMLSelectElement).value)}
			class="mt-1 block w-full rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		>
			<option value="">—</option>
			{#each species as sp}
				<option value={sp.id}>{sp.name}</option>
			{/each}
		</select>
	</label>
	{#if selected?.description}
		<p class="mt-1 text-sm italic" style="color: var(--text-muted);">{selected.description}</p>
	{/if}
</div>
