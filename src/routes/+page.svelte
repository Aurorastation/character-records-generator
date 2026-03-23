<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import SchemaForm from '$lib/components/SchemaForm.svelte';
	import OutputPanel from '$lib/components/OutputPanel.svelte';
	import ImportModal from '$lib/components/ImportModal.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { parseCharacterFile } from '$lib/file';
	import TemplatePicker from '$lib/components/TemplatePicker.svelte';

	let importData = $state<string | null>(null);
	let fileImportData = $state<{ template: any; data: Record<string, unknown> } | null>(null);
	let mobileView = $state<'edit' | 'preview' | 'split'>('split');
	let showPicker = $state(false);

	onMount(() => {
		const hash = window.location.hash.slice(1);
		if (hash && (hash.startsWith('c1.') || hash.startsWith('t1.'))) {
			importData = hash;
		}
	});

	function closeImport() {
		importData = null;
		history.replaceState(null, '', window.location.pathname);
	}

	function handleFileImport(json: string) {
		try {
			fileImportData = parseCharacterFile(json);
		} catch {
			// TODO: show error to user
		}
	}

	function closeFileImport() {
		fileImportData = null;
	}

	const modes = ['edit', 'preview', 'split'] as const;
</script>

<div class="h-dvh flex flex-col overflow-hidden">
	<Header onImport={handleFileImport} />

	{#if fileImportData}
		<div class="flex-1 overflow-y-auto">
			<ImportModal fileData={fileImportData} onClose={closeFileImport} />
		</div>
	{:else if importData}
		<div class="flex-1 overflow-y-auto">
			<ImportModal encoded={importData} onClose={closeImport} />
		</div>
	{:else if roster.active}
		{@const char = roster.active}

		<div class="flex items-center justify-center gap-0 py-1 shrink-0 border-b md:hidden" style="border-color: var(--border); background: var(--bg-card);">
			{#each modes as mode}
				<button
					onclick={() => { mobileView = mode; }}
					class="px-3 py-0.5 text-sm capitalize"
					style={mobileView === mode
						? 'color: var(--text); font-weight: 500;'
						: 'color: var(--text-muted);'}
				>
					{mode}
				</button>
			{/each}
		</div>

		<!-- Desktop: always side-by-side -->
		<main class="flex-1 hidden md:grid md:grid-cols-[1fr_1fr] overflow-hidden max-w-7xl mx-auto w-full">
			<div class="overflow-y-auto p-4">
				<SchemaForm character={char} />
			</div>
			<div class="p-4 min-h-0 flex flex-col">
				<OutputPanel character={char} />
			</div>
		</main>

		<!-- Mobile: view mode toggle -->
		<main class="flex-1 flex flex-col overflow-hidden md:hidden">
			{#if mobileView === 'edit'}
				<div class="flex-1 overflow-y-auto p-4">
					<div class="md:max-w-xl md:mx-auto">
						<SchemaForm character={char} />
					</div>
				</div>
			{:else if mobileView === 'preview'}
				<div class="flex-1 p-4 min-h-0 flex flex-col">
					<OutputPanel character={char} />
				</div>
			{:else}
				<div class="flex-1 overflow-y-auto p-4">
					<div class="md:max-w-xl md:mx-auto">
						<SchemaForm character={char} />
					</div>
				</div>
				<div class="h-[50%] shrink-0 p-4 min-h-0 flex flex-col border-t" style="border-color: var(--border);">
					<OutputPanel character={char} />
				</div>
			{/if}
		</main>
	{:else}
		<main class="flex-1 flex flex-col items-center justify-center gap-4">
			<p style="color: var(--text-muted);">No characters yet.</p>
			<button
				onclick={() => {
					if (presets.length === 1) roster.create(presets[0]);
					else showPicker = true;
				}}
				class="px-3 py-1 rounded text-sm border hover:opacity-80"
				style="border-color: var(--border);"
			>
				Get Started
			</button>
		</main>
		{#if showPicker}
			<TemplatePicker onClose={() => { showPicker = false; }} />
		{/if}
	{/if}
</div>
