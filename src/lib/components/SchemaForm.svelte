<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import type { Character, Template } from '$lib/types';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { slugify } from '$lib/utils/slugify';
	import { diffTemplates, hasChanges } from '$lib/utils/template-diff';
	import RecordCard from './RecordCard.svelte';
	import Modal from './Modal.svelte';

	let { character }: { character: Character } = $props();

	let dismissed = $state<string | null>(null);
	let showTemplateSwitcher = $state(false);
	let showMigrationModal = $state(false);

	let speciesKey = slugify('Species');

	let pendingMigration = $derived.by(() => {
		if (!character.template.id.startsWith('preset:')) return null;
		const preset = presets.find((p) => p.id === character.template.id);
		if (!preset) return null;
		const diff = diffTemplates(character.template, preset);
		if (!hasChanges(diff)) return null;
		return { preset, diff };
	});

	let suggestion = $derived.by((): { template: Template; reason: string } | null => {
		const currentSpecies = character.data[speciesKey] as string | undefined;
		if (!currentSpecies) return null;
		const current = character.template;
		if (current.species?.length && !current.species.includes(currentSpecies)) {
			const specific = presets.find((p) =>
				p.species?.includes(currentSpecies) && p.id !== current.id
			);
			const general = presets.find((p) => !p.species && p.id !== current.id);
			const better = specific ?? general;
			if (better && better.id !== dismissed) {
				return {
					template: better,
					reason: `The ${current.name} template isn't designed for this species.`
				};
			}
			return null;
		}

		if (!current.species) {
			const specific = presets.find((p) =>
				p.species?.includes(currentSpecies) && p.id !== current.id
			);
			if (specific && specific.id !== dismissed) {
				return {
					template: specific,
					reason: `A ${specific.name} template is available for this species.`
				};
			}
		}

		return null;
	});

	function switchTemplate(template: Template) {
		character.template = $state.snapshot(template);
		roster.scheduleSave(character);
		dismissed = null;
		showTemplateSwitcher = false;
	}

	async function applyMigration() {
		if (!pendingMigration) return;
		await roster.migrateToPreset(character, pendingMigration.preset);
	}
</script>

<div class="flex flex-col gap-4">
	<!-- Template bar -->
	<div class="flex items-center gap-2 text-xs">
		<span class="relative">
			<button
				onclick={(e) => { e.stopPropagation(); showTemplateSwitcher = !showTemplateSwitcher; }}
				class="hover:underline"
				style="color: var(--text-muted);"
			>
				{character.template.name} template
			</button>
			{#if showTemplateSwitcher}
				<nav class="absolute z-10 mt-1 left-0 w-56 rounded border shadow-lg" style="background: var(--bg-card); border-color: var(--border);">
					{#each presets as preset}
						<button
							onclick={(e) => { e.stopPropagation(); switchTemplate(preset); }}
							class="block w-full text-left px-3 py-2 text-sm hover:opacity-80"
							style={preset.id === character.template.id ? 'color: var(--accent);' : 'color: var(--text);'}
						>
							<span class="font-medium">{preset.name}</span>
							{#if preset.description}
								<span class="block text-xs" style="color: var(--text-muted);">{preset.description}</span>
							{/if}
						</button>
					{/each}
				</nav>
			{/if}
		</span>
		{#if pendingMigration}
			<button
				onclick={() => { showMigrationModal = true; }}
				class="hover:underline"
				style="color: var(--accent);"
			>
				update available
			</button>
		{/if}
	</div>

	<!-- Species suggestion -->
	{#if suggestion}
		<div class="rounded border px-4 py-3" style="border-color: var(--accent); background: var(--bg-card);">
			<p class="text-sm mb-2">
				{suggestion.reason}
				Switching will keep your existing data.
			</p>
			<div class="flex gap-2">
				<button
					onclick={() => switchTemplate(suggestion!.template)}
					class="px-3 py-1 rounded text-sm border hover:opacity-80"
					style="border-color: var(--accent); color: var(--accent);"
				>
					Switch to {suggestion.template.name}
				</button>
				<button
					onclick={() => { dismissed = suggestion!.template.id; }}
					class="px-3 py-1 rounded text-sm hover:opacity-80"
					style="color: var(--text-muted);"
				>
					Dismiss
				</button>
			</div>
		</div>
	{/if}

	{#each character.template.records as record}
		<RecordCard
			{record}
			data={character.data}
			onFieldChange={(key, value) => {
				character.data[key] = value;
				roster.scheduleSave(character);
			}}
		/>
	{/each}
</div>

{#if showMigrationModal && pendingMigration}
	<Modal onClose={() => { showMigrationModal = false; }}>
		<h2 class="font-semibold mb-3">Template Update</h2>
		<p class="text-sm mb-2">The <strong>{pendingMigration.preset.name}</strong> template has been updated:</p>
		<ul class="text-sm flex flex-col gap-0.5 mb-3" style="color: var(--text-muted);">
			{#each pendingMigration.diff.renamedFields as r}
				<li>{r.from} → {r.to}</li>
			{/each}
			{#each pendingMigration.diff.addedRecords as r}
				<li>+ New record: {r}</li>
			{/each}
			{#each pendingMigration.diff.removedRecords as r}
				<li>- Removed record: {r}</li>
			{/each}
			{#each pendingMigration.diff.addedFields as f}
				<li>+ New field: {f}</li>
			{/each}
			{#each pendingMigration.diff.removedFields as f}
				<li>- Removed field: {f}</li>
			{/each}
		</ul>
		<p class="text-xs mb-3" style="color: var(--text-muted);">Your existing data will be preserved.</p>
		<div class="flex gap-2 justify-end">
			<button
				onclick={() => { showMigrationModal = false; }}
				class="px-3 py-1 rounded text-sm hover:opacity-80"
				style="color: var(--text-muted);"
			>
				Skip
			</button>
			<button
				onclick={async () => { await applyMigration(); showMigrationModal = false; }}
				class="px-3 py-1 rounded text-sm border hover:opacity-80"
				style="border-color: var(--accent); color: var(--accent);"
			>
				Update
			</button>
		</div>
	</Modal>
{/if}

<svelte:window onclick={() => {
	if (showTemplateSwitcher) {
		showTemplateSwitcher = false;
	}
}} />
