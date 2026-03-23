<script lang="ts">
	import type { CitizenshipField } from '$lib/types';
	import { citizenships } from '$lib/data';

	let { field, value = '', onChange }: { field: CitizenshipField; value: string; onChange: (v: string) => void } = $props();
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}</span>
	<select
		{value}
		onchange={(e) => onChange((e.target as HTMLSelectElement).value)}
		class="mt-1 block w-full rounded px-3 py-2 text-sm"
		style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
	>
		<option value="">—</option>
		{#each citizenships as c}
			<option value={c.name}>{c.name}</option>
		{/each}
	</select>
</label>
