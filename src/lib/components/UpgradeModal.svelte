<script lang="ts">
	import { roster } from '$lib/state.svelte';
	import Modal from './Modal.svelte';

	let upgrades = $derived(roster.pendingUpgrades);

	function dismiss() {
		roster.clearUpgrades();
	}
</script>

{#if upgrades.length > 0}
	<Modal onClose={dismiss}>
		<h2 class="font-semibold mb-3">Templates Updated</h2>
		<div class="flex flex-col gap-4">
			{#each upgrades as upgrade}
				<div class="rounded border px-3 py-2" style="border-color: var(--border);">
					<p class="text-sm font-medium">{upgrade.characterName}</p>
					<p class="text-xs mb-2" style="color: var(--text-muted);">{upgrade.templateName} template</p>
					<ul class="text-xs flex flex-col gap-0.5 mb-2" style="color: var(--text-muted);">
						{#each upgrade.diff.renamedFields as r}
							<li>{r.from} → {r.to}</li>
						{/each}
						{#each upgrade.diff.addedRecords as r}
							<li>+ New record: {r}</li>
						{/each}
						{#each upgrade.diff.removedRecords as r}
							<li>- Removed record: {r}</li>
						{/each}
						{#each upgrade.diff.addedFields as f}
							<li>+ New field: {f}</li>
						{/each}
						{#each upgrade.diff.removedFields as f}
							<li>- Removed field: {f}</li>
						{/each}
					</ul>
					<div class="flex gap-2">
						<button
							onclick={() => roster.applyUpgrade(upgrade.characterId)}
							class="px-2 py-1 rounded text-xs border hover:opacity-80"
							style="border-color: var(--accent); color: var(--accent);"
						>
							Update
						</button>
						<button
							onclick={() => roster.skipUpgrade(upgrade.characterId)}
							class="px-2 py-1 rounded text-xs hover:opacity-80"
							style="color: var(--text-muted);"
						>
							Skip
						</button>
					</div>
				</div>
			{/each}
		</div>
		<p class="text-xs mt-3" style="color: var(--text-muted);">Your existing data will be preserved. Skipped updates will be offered again next time.</p>
	</Modal>
{/if}
