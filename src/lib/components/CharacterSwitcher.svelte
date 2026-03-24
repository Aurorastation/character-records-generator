<script lang="ts">
	import { roster } from '$lib/state.svelte';
	import { slugify } from '$lib/utils/slugify';

	function displayName(char: { template: { records: { fields: { type: string; label: string }[] }[] }; data: Record<string, unknown> }): string {
		const nameField = char.template.records.flatMap((r) => r.fields).find((f) => f.type === 'name');
		const key = nameField ? slugify(nameField.label) : slugify('Name');
		const name = char.data[key];
		return (name as string) || 'Unnamed Character';
	}
</script>

<div class="relative inline-block">
	<select
		value={roster.active?.id ?? ''}
		onchange={(e) => roster.setActive((e.target as HTMLSelectElement).value)}
		class="rounded pl-3 pr-7 h-[30px] text-sm appearance-none cursor-pointer hover:opacity-80"
		style="background: var(--bg-card); border: 1px solid var(--border); color: var(--text);"
	>
		{#each roster.characters as char}
			<option value={char.id}>{displayName(char)}</option>
		{/each}
	</select>
	<svg class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" style="color: var(--text-muted);">
		<path d="M3 5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
</div>
