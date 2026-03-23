<script lang="ts">
	import type { Character, Template } from '$lib/types';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { slugify } from '$lib/utils/slugify';
	import RecordCard from './RecordCard.svelte';

	let { character }: { character: Character } = $props();

	let dismissed = $state<string | null>(null);

	let speciesKey = slugify('Species');

	let suggestion = $derived.by((): { template: Template; reason: string } | null => {
		const currentSpecies = character.data[speciesKey] as string | undefined;
		if (!currentSpecies) return null;

		const current = character.template;

		// Current template is species-specific but doesn't match selected species
		if (current.species?.length && !current.species.includes(currentSpecies)) {
			// Find a template that matches, or fall back to a general one
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

		// Current template is general, but a species-specific one exists
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
	}
</script>

<div class="flex flex-col gap-4">
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
