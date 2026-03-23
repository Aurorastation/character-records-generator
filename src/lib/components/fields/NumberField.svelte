<script lang="ts">
	import type { NumberField } from '$lib/types';

	let { field, value, onChange }: { field: NumberField; value: number | undefined; onChange: (v: number) => void } = $props();
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}</span>
	<div class="flex items-center gap-2 mt-1">
		<input
			type="number"
			value={value ?? ''}
			min={field.min}
			max={field.max}
			oninput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
			class="block w-full rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		/>
		{#if field.unit}
			<span class="text-sm" style="color: var(--text-muted);">{field.unit}</span>
		{/if}
	</div>
</label>
