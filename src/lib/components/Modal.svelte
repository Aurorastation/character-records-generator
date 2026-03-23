<script lang="ts">
	import type { Snippet } from 'svelte';

	let { onClose, children }: { onClose: () => void; children: Snippet } = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center"
	onmousedown={onClose}
>
	<div class="absolute inset-0 bg-black/50"></div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
		style="background: var(--bg-card); color: var(--text);"
		onmousedown={(e) => e.stopPropagation()}
	>
		{@render children()}
	</div>
</div>
