<script lang="ts">
	import { Sun, Moon, Share2, Check, Trash2, Plus } from 'lucide-svelte';
	import { theme } from '$lib/theme.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { encodeCharacterURL } from '$lib/sharing';
	import { slugify } from '$lib/utils/slugify';
	import CharacterSwitcher from './CharacterSwitcher.svelte';
	import Modal from './Modal.svelte';

	let shared = $state(false);
	let confirmDelete = $state(false);

	async function createCharacter() {
		await roster.create(presets[0]);
	}

	async function share() {
		const char = roster.active;
		if (!char) return;
		const encoded = encodeCharacterURL(char);
		const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
		await navigator.clipboard.writeText(url);
		shared = true;
		setTimeout(() => { shared = false; }, 2000);
	}

	function displayName(): string {
		const char = roster.active;
		if (!char) return '';
		const name = char.data[slugify('Name')];
		return (name as string) || 'Unnamed Character';
	}

	async function doDelete() {
		if (roster.active) {
			await roster.remove(roster.active.id);
		}
		confirmDelete = false;
	}
</script>

<header class="border-b shrink-0" style="border-color: var(--border); background: var(--bg-card);">
<div class="flex items-center gap-2 px-4 py-3 max-w-7xl mx-auto w-full">
	<h1 class="font-bold whitespace-nowrap">Aurora Records</h1>

	{#if roster.characters.length > 0}
		<CharacterSwitcher />
	{/if}

	<button onclick={createCharacter} class="flex items-center justify-center w-[30px] h-[30px] rounded border hover:opacity-80" style="border-color: var(--border);" title="New character">
		<Plus size={14} />
	</button>

	{#if roster.characters.length > 0}
		<button onclick={() => { confirmDelete = true; }} class="flex items-center justify-center w-[30px] h-[30px] rounded border hover:opacity-80" style="border-color: var(--border);" title="Delete character">
			<Trash2 size={14} />
		</button>

		<button onclick={share} class="flex items-center justify-center h-[30px] rounded border hover:opacity-80 {shared ? 'gap-1 px-2' : 'w-[30px]'}" style="border-color: var(--border);" title="Share character">
			{#if shared}
				<Check size={14} /> <span class="text-sm hidden sm:inline">Copied share link</span>
			{:else}
				<Share2 size={14} />
			{/if}
		</button>
	{/if}

	<div class="ml-auto flex items-center gap-2">
		<span class="text-sm" style="color: var(--text-muted);">
			{#if roster.saveStatus === 'saving'}Saving...{:else if roster.saveStatus === 'saved'}Saved{/if}
		</span>

		<button onclick={() => theme.toggle()} class="flex items-center justify-center w-[30px] h-[30px] rounded hover:opacity-80" title="Toggle theme">
			{#if theme.dark}
				<Sun size={18} />
			{:else}
				<Moon size={18} />
			{/if}
		</button>
	</div>
</div>
</header>

{#if confirmDelete && roster.active}
	<Modal onClose={() => { confirmDelete = false; }}>
		<h2 class="font-semibold mb-2">Delete Character</h2>
		<p class="text-sm mb-4">Delete <strong>{displayName()}</strong>? This can't be undone.</p>
		<div class="flex gap-2 justify-end">
			<button onclick={() => { confirmDelete = false; }} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border);">
				Cancel
			</button>
			<button onclick={doDelete} class="px-3 py-1 rounded text-sm border hover:opacity-80" style="border-color: var(--border); color: #dc2626;">
				Delete
			</button>
		</div>
	</Modal>
{/if}
