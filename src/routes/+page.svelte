<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import SchemaForm from '$lib/components/SchemaForm.svelte';
	import OutputPanel from '$lib/components/OutputPanel.svelte';
	import ImportModal from '$lib/components/ImportModal.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';

	let importData = $state<string | null>(null);

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
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	{#if importData}
		<ImportModal encoded={importData} onClose={closeImport} />
	{:else if roster.active}
		{@const char = roster.active}
		<main class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
			<div class="p-4">
				<div class="max-w-xl mx-auto">
					<SchemaForm character={char} />
				</div>
			</div>
			<div class="lg:sticky lg:top-[49px] lg:max-h-[calc(100vh-49px)] overflow-y-auto p-4">
				<OutputPanel character={char} />
			</div>
		</main>
	{:else}
		<main class="flex-1 flex flex-col items-center justify-center gap-4">
			<p style="color: var(--text-muted);">No characters yet.</p>
			<button
				onclick={() => roster.create(presets[0])}
				class="px-3 py-1 rounded text-sm border hover:opacity-80"
				style="border-color: var(--border);"
			>
				Get Started
			</button>
		</main>
	{/if}
</div>
