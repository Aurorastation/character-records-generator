<script lang="ts">
	import type { Character } from '$lib/types';
	import { generateRecord } from '$lib/output';
	import { species } from '$lib/data';
	import OutputTab from './OutputTab.svelte';

	let { character }: { character: Character } = $props();

	let tabs = $derived(
		character.template.records.filter((r) => r.type !== 'public')
	);

	let activeTab = $state('');

	$effect(() => {
		if (tabs.length && !tabs.some((t) => t.type === activeTab)) {
			activeTab = tabs[0].type;
		}
	});

	let output = $derived(
		activeTab ? generateRecord(character.template, character.data, activeTab, species) : ''
	);
</script>

<div class="flex flex-col h-full min-h-0 rounded border" style="border-color: var(--border); background: var(--bg-card);">
	<div class="flex border-b" style="border-color: var(--border);">
		{#each tabs as tab}
			<button
				onclick={() => { activeTab = tab.type; }}
				class="px-4 py-2 text-sm capitalize"
				style={activeTab === tab.type
					? `color: var(--accent); border-bottom: 2px solid var(--accent);`
					: `color: var(--text-muted); border-bottom: 2px solid transparent;`}
			>
				{tab.type}
			</button>
		{/each}
	</div>

	<OutputTab {output} />
</div>
