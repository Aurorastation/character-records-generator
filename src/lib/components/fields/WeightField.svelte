<script lang="ts">
	import type { WeightField } from '$lib/types';
	import { kgToLb } from '$lib/utils/conversions';

	let { field, value, onChange }: { field: WeightField; value: number | undefined; onChange: (v: number) => void } = $props();

	let converted = $derived(value ? Math.round(kgToLb(value)) : 0);
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</span>
	<div class="flex items-center gap-2 mt-1">
		<input
			type="number"
			value={value ?? ''}
			min={0}
			oninput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
			class="w-24 rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		/>
		<span class="text-sm" style="color: var(--text-muted);">
			kg{#if converted} ({converted} lb){/if}
		</span>
	</div>
</label>
