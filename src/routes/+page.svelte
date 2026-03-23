<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import SchemaForm from '$lib/components/SchemaForm.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1 p-4">
		{#if roster.active}
			<div class="max-w-xl mx-auto">
				<SchemaForm character={roster.active} />
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center gap-4 h-full min-h-[60vh]">
				<p style="color: var(--text-muted);">No characters yet.</p>
				<button
					onclick={() => roster.create(presets[0])}
					class="px-3 py-1 rounded text-sm border hover:opacity-80"
					style="border-color: var(--border);"
				>
					Get Started
				</button>
			</div>
		{/if}
	</main>
</div>
