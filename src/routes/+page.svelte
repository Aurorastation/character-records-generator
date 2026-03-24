<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import HelpText from '$lib/components/HelpText.svelte';
	import SchemaForm from '$lib/components/SchemaForm.svelte';
	import OutputPanel from '$lib/components/OutputPanel.svelte';
	import ImportModal from '$lib/components/ImportModal.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { parseCharacterFile } from '$lib/file';
	import TemplatePicker from '$lib/components/TemplatePicker.svelte';

	let importData = $state<string | null>(null);
	let fileImportData = $state<{ template: any; data: Record<string, unknown> } | null>(null);
	let importError = $state<string | null>(null);
	let mobileView = $state<'edit' | 'preview' | 'split'>('split');
	let showPicker = $state(false);
	let emptyFileInput = $state<HTMLInputElement>();

	function checkHash() {
		const hash = window.location.hash.slice(1);
		if (hash && (hash.startsWith('c1.') || hash.startsWith('t1.'))) {
			importData = hash;
		}
	}

	onMount(() => {
		checkHash();
		window.addEventListener('hashchange', checkHash);
		return () => window.removeEventListener('hashchange', checkHash);
	});

	function closeImport() {
		importData = null;
		history.replaceState(null, '', window.location.pathname);
	}

	function handleFileImport(json: string) {
		try {
			fileImportData = parseCharacterFile(json);
			importError = null;
		} catch {
			importError = 'Could not read that file. Check that it\u2019s a valid character export.';
		}
	}

	function closeFileImport() {
		fileImportData = null;
	}

	async function handleEmptyFileImport(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await file.text();
		handleFileImport(text);
		input.value = '';
	}

	const modes = ['edit', 'preview', 'split'] as const;
</script>

<div class="h-dvh flex flex-col overflow-hidden">
	<Header onImport={handleFileImport} />

	{#if importError}
		<div class="px-4 py-2 text-sm flex items-center justify-center gap-2 border-b" style="background: color-mix(in srgb, var(--error) 8%, var(--bg)); color: var(--error); border-color: var(--border);">
			<span>{importError}</span>
			<button onclick={() => { importError = null; }} class="underline hover:opacity-80">Dismiss</button>
		</div>
	{/if}

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
		<main class="flex-1 flex items-center justify-center p-6">
			<div class="max-w-md w-full flex flex-col gap-6">
				<HelpText />

				<div class="flex gap-3">
					<button
						onclick={() => {
							if (presets.length === 1) roster.create(presets[0]);
							else showPicker = true;
						}}
						class="flex-1 px-4 py-2 rounded text-sm font-medium hover:opacity-90"
						style="background: var(--accent); color: white;"
					>
						New Character
					</button>
					<button
						onclick={() => emptyFileInput.click()}
						class="px-4 py-2 rounded text-sm border hover:opacity-80"
						style="border-color: var(--border); color: var(--text-muted);"
					>
						Import
					</button>
				</div>
			</div>
		</main>

		<input
			bind:this={emptyFileInput}
			type="file"
			accept=".json"
			class="hidden"
			onchange={handleEmptyFileImport}
		/>

		{#if showPicker}
			<TemplatePicker onClose={() => { showPicker = false; }} />
		{/if}
	{/if}
</div>
