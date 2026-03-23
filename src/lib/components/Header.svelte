<script lang="ts">
	import { Sun, Moon, Share2, Check } from 'lucide-svelte';
	import { theme } from '$lib/theme.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { encodeCharacterURL } from '$lib/sharing';
	import CharacterSwitcher from './CharacterSwitcher.svelte';

	let copied = $state(false);

	async function createCharacter() {
		await roster.create(presets[0]);
	}

	async function share() {
		const char = roster.active;
		if (!char) return;
		const encoded = encodeCharacterURL(char);
		const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}
</script>

<header class="flex items-center gap-3 px-4 py-3 border-b shrink-0" style="border-color: var(--border); background: var(--bg-card);">
	<h1 class="font-bold whitespace-nowrap">Aurora Records</h1>

	{#if roster.characters.length > 0}
		<CharacterSwitcher />
	{/if}

	<div class="ml-auto flex items-center gap-3">
		<span class="text-sm" style="color: var(--text-muted);">
			{#if roster.saveStatus === 'saving'}Saving...{:else if roster.saveStatus === 'saved'}Saved{/if}
		</span>

		{#if roster.active}
			<button onclick={share} class="p-1 rounded hover:opacity-80" title="Copy share link">
				{#if copied}
					<Check size={18} />
				{:else}
					<Share2 size={18} />
				{/if}
			</button>
		{/if}

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
