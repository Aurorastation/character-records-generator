<script lang="ts">
	import { Sun, Moon, Trash2, Plus, Upload } from 'lucide-svelte';
	import { theme } from '$lib/theme.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { slugify } from '$lib/utils/slugify';
	import CharacterSwitcher from './CharacterSwitcher.svelte';
	import TemplatePicker from './TemplatePicker.svelte';
	import ShareMenu from './ShareMenu.svelte';
	import Modal from './Modal.svelte';

	let { onImport }: { onImport?: (json: string) => void } = $props();

	let confirmDelete = $state(false);
	let showPicker = $state(false);
	let openDropdown = $state<'add' | 'share' | null>(null);
	let fileInput: HTMLInputElement;

	function toggleDropdown(which: 'add' | 'share') {
		openDropdown = openDropdown === which ? null : which;
	}

	function createCharacter() {
		if (presets.length === 1) {
			roster.create(presets[0]);
		} else {
			showPicker = true;
		}
		openDropdown = null;
	}

	function triggerImport() {
		fileInput.click();
		openDropdown = null;
	}

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await file.text();
		onImport?.(text);
		input.value = '';
	}

	function displayName(): string {
		const char = roster.active;
		if (!char) return '';
		const nameField = char.template.records.flatMap((r) => r.fields).find((f) => f.type === 'name');
		const key = nameField ? slugify(nameField.label) : slugify('Name');
		const name = char.data[key];
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

	<span class="relative">
		<button
			onclick={(e) => { e.stopPropagation(); toggleDropdown('add'); }}
			class="flex items-center justify-center w-[30px] h-[30px] rounded border hover:opacity-80"
			style="border-color: var(--border);"
			title="Add character"
		>
			<Plus size={14} />
		</button>

		{#if openDropdown === 'add'}
			<nav class="absolute left-0 z-10 mt-1 w-48 rounded border shadow-lg" style="background: var(--bg-card); border-color: var(--border);">
				<button
					onclick={createCharacter}
					class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:opacity-80"
				>
					<Plus size={14} /> New character
				</button>
				<button
					onclick={triggerImport}
					class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:opacity-80"
				>
					<Upload size={14} /> Import from file
				</button>
			</nav>
		{/if}
	</span>

	{#if roster.active}
		<button onclick={() => { confirmDelete = true; }} class="flex items-center justify-center w-[30px] h-[30px] rounded border hover:opacity-80" style="border-color: var(--border);" title="Delete character">
			<Trash2 size={14} />
		</button>

		<ShareMenu open={openDropdown === 'share'} onToggle={() => toggleDropdown('share')} />
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

<input
	bind:this={fileInput}
	type="file"
	accept=".json"
	class="hidden"
	onchange={handleFile}
/>

{#if showPicker}
	<TemplatePicker onClose={() => { showPicker = false; }} />
{/if}

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

<svelte:window onclick={() => { openDropdown = null; }} />
