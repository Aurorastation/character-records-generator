<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import { roster } from '$lib/state.svelte';
	import { slugify } from '$lib/utils/slugify';

	function displayName(char: { data: Record<string, unknown> }): string {
		const name = char.data[slugify('Name')];
		return (name as string) || 'Unnamed Character';
	}
</script>

<div class="flex items-center gap-1">
	<select
		value={roster.active?.id ?? ''}
		onchange={(e) => roster.setActive((e.target as HTMLSelectElement).value)}
		class="rounded px-2 py-1 text-sm"
		style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
	>
		{#each roster.characters as char}
			<option value={char.id}>{displayName(char)}</option>
		{/each}
	</select>

	{#if roster.active}
		<button
			onclick={async () => {
				if (roster.active && confirm('Delete this character?')) {
					await roster.remove(roster.active.id);
				}
			}}
			class="p-1 rounded hover:opacity-80"
			style="color: var(--text-muted);"
			title="Delete character"
		>
			<Trash2 size={14} />
		</button>
	{/if}
</div>
