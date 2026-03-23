<script lang="ts">
	import type { SelectField } from '$lib/types';

	let { field, value = '', onChange }: { field: SelectField; value: string; onChange: (v: string) => void } = $props();
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
		{#each field.options as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</label>
