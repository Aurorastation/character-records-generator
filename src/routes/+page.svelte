<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import DynamicField from '$lib/components/fields/DynamicField.svelte';
	import { roster } from '$lib/state.svelte';
	import { presets } from '$lib/presets';
	import { slugify } from '$lib/utils/slugify';
</script>

<div class="min-h-screen flex flex-col">
	<Header />

	<main class="flex-1 p-4">
		{#if roster.active}
			{@const char = roster.active}
			<div class="max-w-xl mx-auto flex flex-col gap-6">
				{#each char.template.records as record}
					<section>
						<h2 class="text-sm font-semibold uppercase tracking-wide mb-3" style="color: var(--text-muted);">
							{record.type}
						</h2>
						<div class="flex flex-col gap-4">
							{#each record.fields as field}
								<DynamicField
									{field}
									value={char.data[slugify(field.label)]}
									data={char.data}
									onChange={(v) => {
										char.data[slugify(field.label)] = v;
										roster.scheduleSave(char);
									}}
								/>
							{/each}
						</div>
					</section>
				{/each}
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
