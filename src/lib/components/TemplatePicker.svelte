<script lang="ts">
	import type { Template } from '$lib/types';
	import { presets } from '$lib/presets';
	import { roster } from '$lib/state.svelte';
	import Modal from './Modal.svelte';

	let { onClose }: { onClose: () => void } = $props();

	async function pick(template: Template) {
		await roster.create(template);
		onClose();
	}
</script>

<Modal {onClose}>
	<h2 class="font-semibold mb-3">New Character</h2>
	<div class="flex flex-col gap-2">
		{#each presets as preset}
			<button
				onclick={() => pick(preset)}
				class="text-left px-3 py-2 rounded border hover:opacity-80"
				style="border-color: var(--border);"
			>
				<span class="font-medium text-sm">{preset.name}</span>
				{#if preset.description}
					<span class="block text-xs" style="color: var(--text-muted);">{preset.description}</span>
				{/if}
			</button>
		{/each}
	</div>
</Modal>
