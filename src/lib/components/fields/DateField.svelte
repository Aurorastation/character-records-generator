<script lang="ts">
	import type { DateField } from '$lib/types';

	let { field, value = '', onChange }: { field: DateField; value: string; onChange: (v: string) => void } = $props();
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</span>
	<input
		type="text"
		{value}
		placeholder={field.placeholder}
		oninput={(e) => onChange((e.target as HTMLInputElement).value)}
		class="mt-1 block w-full rounded px-3 py-2 text-sm"
		style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
	/>
</label>
