<script lang="ts">
	import { decodeCharacterURL, decodeTemplateURL } from '$lib/sharing';
	import { generateRecord } from '$lib/output';
	import { species } from '$lib/data';
	import { roster } from '$lib/state.svelte';
	import { slugify } from '$lib/utils/slugify';
	import OutputTab from './OutputTab.svelte';

	let { encoded, onClose }: { encoded: string; onClose: () => void } = $props();

	let error = $state('');
	let type = $state<'character' | 'template' | null>(null);
	let charData = $state<{ template: any; data: Record<string, unknown> } | null>(null);
	let tmplData = $state<any>(null);

	let activeTab = $state('');

	$effect(() => {
		try {
			if (encoded.startsWith('c1.')) {
				type = 'character';
				charData = decodeCharacterURL(encoded);
			} else if (encoded.startsWith('t1.')) {
				type = 'template';
				tmplData = decodeTemplateURL(encoded);
			} else {
				error = 'Unrecognized share link format.';
			}
		} catch {
			error = 'Failed to decode share link.';
		}
	});

	let tabs = $derived(
		charData?.template.records.filter((r: any) => r.type !== 'public') ?? []
	);

	$effect(() => {
		if (tabs.length && !tabs.some((t: any) => t.type === activeTab)) {
			activeTab = tabs[0].type;
		}
	});

	let output = $derived(
		charData && activeTab
			? generateRecord(charData.template, charData.data, activeTab, species)
			: ''
	);

	function charName(): string {
		if (!charData) return 'Unknown';
		return (charData.data[slugify('Name')] as string) || 'Unnamed Character';
	}

	async function importCharacter() {
		if (!charData) return;
		await roster.create(charData.template, charData.data);
		onClose();
	}

	async function importTemplate() {
		if (!tmplData) return;
		await roster.create(tmplData);
		onClose();
	}
</script>

<div class="min-h-screen flex flex-col items-center p-4">
	<div class="w-full max-w-2xl">
		{#if error}
			<div class="rounded border p-6 text-center" style="border-color: var(--border); background: var(--bg-card);">
				<p class="mb-4">{error}</p>
				<button onclick={onClose} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
					Dismiss
				</button>
			</div>
		{:else if type === 'character' && charData}
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="font-semibold">{charName()}</h2>
					<p class="text-sm" style="color: var(--text-muted);">Shared character — {charData.template.name} template</p>
				</div>
				<div class="flex gap-2">
					<button onclick={onClose} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
						Cancel
					</button>
					<button onclick={importCharacter} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
						Import
					</button>
				</div>
			</div>

			<div class="rounded border" style="border-color: var(--border); background: var(--bg-card);">
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
		{:else if type === 'template' && tmplData}
			<div class="rounded border p-6 text-center" style="border-color: var(--border); background: var(--bg-card);">
				<h2 class="font-semibold mb-2">Shared Template: {tmplData.name}</h2>
				<p class="text-sm mb-4" style="color: var(--text-muted);">{tmplData.records.length} records, {tmplData.records.reduce((n: number, r: any) => n + r.fields.length, 0)} fields</p>
				<div class="flex gap-2 justify-center">
					<button onclick={onClose} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
						Cancel
					</button>
					<button onclick={importTemplate} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
						Create Character
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
