<script lang="ts">
	import type { SubspeciesField } from '$lib/types';
	import { species } from '$lib/data';
	import { slugify } from '$lib/utils/slugify';

	let { field, value = '', onChange, data }: {
		field: SubspeciesField;
		value: string;
		onChange: (v: string) => void;
		data: Record<string, unknown>;
	} = $props();

	let currentSpecies = $derived(species.find((s) => s.id === data[slugify('Species')]));
	let subs = $derived(currentSpecies?.subspecies ?? []);
	let label = $derived(currentSpecies?.subspeciesLabel ?? field.label);
	let selected = $derived(subs.find((s) => s.id === value));

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

	let isCustom = $derived(custom || (value !== '' && !subs.some((s) => s.id === value)));
</script>

{#if subs.length > 0 || isCustom}
	<div class="block">
		<label class="block">
			<span class="text-sm font-medium">{label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</span>
			{#if isCustom}
				<div class="flex items-center gap-2 mt-1">
					<input
						type="text"
						{value}
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
					{#each subs as sub}
						<option value={sub.id}>{sub.name}</option>
					{/each}
					<option value="__custom">Other...</option>
				</select>
			{/if}
		</label>
		{#if selected?.description}
			<p class="mt-1 text-sm italic" style="color: var(--text-muted);">{selected.description}</p>
		{/if}
	</div>
{/if}
