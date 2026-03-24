<script lang="ts">
	import type { SeparatorField } from '$lib/types';

	let { field }: { field: SeparatorField } = $props();
</script>

{#if field.label}
	<div class="flex items-center gap-3 pt-2">
		<hr class="flex-1" style="border-color: var(--border);" />
		<span class="text-xs font-medium uppercase tracking-wide" style="color: var(--text-muted);">{field.label}</span>
		<hr class="flex-1" style="border-color: var(--border);" />
	</div>
{:else}
	<hr class="mt-2" style="border-color: var(--border);" />
{/if}
