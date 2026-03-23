<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { theme } from '$lib/theme.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import CharacterSwitcher from './CharacterSwitcher.svelte';

	async function createCharacter() {
		await roster.create(presets[0]);
	}
</script>

<header class="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b" style="border-color: var(--border); background: var(--bg-card);">
	<h1 class="font-bold whitespace-nowrap">Aurora Records</h1>

	{#if roster.characters.length > 0}
		<CharacterSwitcher />
	{/if}

	<div class="ml-auto flex items-center gap-3">
		<span class="text-sm" style="color: var(--text-muted);">
			{#if roster.saveStatus === 'saving'}Saving...{:else if roster.saveStatus === 'saved'}Saved{/if}
		</span>

		<button
			onclick={createCharacter}
			class="px-3 py-1 rounded text-sm border hover:opacity-80"
			style="border-color: var(--border);"
		>
			New Character
		</button>

		<button onclick={() => theme.toggle()} class="p-1 rounded hover:opacity-80" title="Toggle theme">
			{#if theme.dark}
				<Sun size={18} />
			{:else}
				<Moon size={18} />
			{/if}
		</button>
	</div>
</header>
