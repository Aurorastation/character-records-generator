<script lang="ts">
	import type { ListField } from '$lib/types';

	let { field, value = '', onChange }: { field: ListField; value: string; onChange: (v: string) => void } = $props();
</script>

<label class="block">
	<span class="text-sm font-medium">{field.label}</span>
	<textarea
		{value}
		placeholder="One entry per line"
		oninput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
		rows={3}
		class="mt-1 block w-full rounded px-3 py-2 text-sm resize-y"
		style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
	></textarea>
</label>
