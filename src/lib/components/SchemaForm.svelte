<script lang="ts">
	import type { Character } from '$lib/types';
	import { roster } from '$lib/state.svelte';
	import RecordCard from './RecordCard.svelte';

	let { character }: { character: Character } = $props();
</script>

<div class="flex flex-col gap-4">
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
