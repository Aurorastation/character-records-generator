<script lang="ts">
	import { onMount } from 'svelte';
	import { Eye, PenLine } from 'lucide-svelte';
	import Header from '$lib/components/Header.svelte';
	import SchemaForm from '$lib/components/SchemaForm.svelte';
	import OutputPanel from '$lib/components/OutputPanel.svelte';
	import ImportModal from '$lib/components/ImportModal.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';

	let importData = $state<string | null>(null);
	let mobileView = $state<'form' | 'preview'>('form');

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

<div class="h-dvh flex flex-col overflow-hidden">
	<Header />

	{#if importData}
		<div class="flex-1 overflow-y-auto">
			<ImportModal encoded={importData} onClose={closeImport} />
		</div>
	{:else if roster.active}
		{@const char = roster.active}
		<main class="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] overflow-hidden relative">
			<div class="overflow-y-auto p-4 {mobileView === 'preview' ? 'hidden lg:block' : ''}">
				<div class="max-w-xl mx-auto">
					<SchemaForm character={char} />
				</div>
			</div>
			<div class="p-4 min-h-0 flex flex-col {mobileView === 'form' ? 'hidden lg:flex' : ''}">
				<OutputPanel character={char} />
			</div>

			<div class="fixed bottom-4 right-4 lg:hidden z-10">
				<button
					onclick={() => { mobileView = mobileView === 'form' ? 'preview' : 'form'; }}
					class="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-sm"
					style="background: var(--bg-card); border: 1px solid var(--border); color: var(--text);"
				>
					{#if mobileView === 'form'}
						<Eye size={16} /> Preview
					{:else}
						<PenLine size={16} /> Edit
					{/if}
				</button>
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
