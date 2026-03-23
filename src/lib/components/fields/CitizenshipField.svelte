<script lang="ts">
	import type { CitizenshipField } from '$lib/types';
	import { citizenships } from '$lib/data';

	let { field, value = '', onChange }: { field: CitizenshipField; value: string; onChange: (v: string) => void } = $props();

	let custom = $state(false);

	function handleSelect(v: string) {
		if (v === '__custom') {
			custom = true;
			onChange('');
		} else {
			custom = false;
			onChange(v);
		}
	}

	let isCustom = $derived(custom || (value !== '' && !citizenships.some((c) => c.name === value)));
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</span>
	{#if isCustom}
		<div class="flex items-center gap-2 mt-1">
			<input
				type="text"
				{value}
				placeholder="Enter citizenship"
				oninput={(e) => onChange((e.target as HTMLInputElement).value)}
				class="block w-full rounded px-3 py-2 text-sm"
				style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
			/>
			<button
				onclick={() => { custom = false; onChange(''); }}
				class="text-sm whitespace-nowrap hover:opacity-80"
				style="color: var(--text-muted);"
			>
				Cancel
			</button>
		</div>
	{:else}
		<select
			{value}
			onchange={(e) => handleSelect((e.target as HTMLSelectElement).value)}
			class="mt-1 block w-full rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		>
			<option value="">—</option>
			{#each citizenships as c}
				<option value={c.name}>{c.name}</option>
			{/each}
			<option value="__custom">Other...</option>
		</select>
	{/if}
</label>
