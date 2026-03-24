<script lang="ts">
	import { Share2, Download, Check } from 'lucide-svelte';
	import { roster } from '$lib/state.svelte';
	import { encodeCharacterURL } from '$lib/sharing';
	import { exportCharacter, characterFileName } from '$lib/file';

	let { open, onToggle }: { open: boolean; onToggle: () => void } = $props();

	let copied = $state(false);

	async function share() {
		const char = roster.active;
		if (!char) return;
		const encoded = encodeCharacterURL(char);
		const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	function exportFile() {
		const char = roster.active;
		if (!char) return;
		const json = exportCharacter(char);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = characterFileName(char);
		a.click();
		URL.revokeObjectURL(url);
		onToggle();
	}
</script>

<span class="relative">
	<button
		onclick={(e) => { e.stopPropagation(); onToggle(); }}
		class="flex items-center justify-center w-[30px] h-[30px] rounded border hover:opacity-80"
		style="border-color: var(--border);"
		title="Share & export"
	>
		{#if copied}
			<Check size={14} />
		{:else}
			<Share2 size={14} />
		{/if}
	</button>

	{#if open}
		<nav class="absolute left-0 z-10 mt-1 w-48 rounded border shadow-lg" style="background: var(--bg-card); border-color: var(--border);">
			<button
				onclick={share}
				class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:opacity-80"
			>
				{#if copied}
					<Check size={14} /> Copied!
				{:else}
					<Share2 size={14} /> Copy share link
				{/if}
			</button>
			<button
				onclick={exportFile}
				class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:opacity-80"
			>
				<Download size={14} /> Export to file
			</button>
		</nav>
	{/if}
</span>
