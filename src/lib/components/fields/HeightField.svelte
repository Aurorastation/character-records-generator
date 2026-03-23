<script lang="ts">
	import type { HeightField } from '$lib/types';
	import { cmToFeetInches } from '$lib/utils/conversions';

	let { field, value, onChange }: { field: HeightField; value: number | undefined; onChange: (v: number) => void } = $props();

	let converted = $derived(value ? cmToFeetInches(value) : '');
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}</span>
	<div class="flex items-center gap-2 mt-1">
		<input
			type="number"
			value={value ?? ''}
			min={0}
			oninput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
			class="block w-full rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		/>
		<span class="text-sm whitespace-nowrap" style="color: var(--text-muted);">
			cm {converted ? `(${converted})` : ''}
		</span>
	</div>
</label>
