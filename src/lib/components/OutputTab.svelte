<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';

	let { output }: { output: string } = $props();

	let copied = $state(false);

	let wordCount = $derived(
		output.trim() ? output.trim().split(/\s+/).length : 0
	);

	async function copy() {
		await navigator.clipboard.writeText(output);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}
</script>

<div class="flex flex-col h-full">
	<div class="flex items-center justify-between px-3 py-2 text-sm" style="color: var(--text-muted);">
		<span>{wordCount} words</span>
		<button onclick={copy} class="flex items-center gap-1 px-2 py-1 rounded border hover:opacity-80" style="border-color: var(--border);">
			{#if copied}
				<Check size={14} /> Copied
			{:else}
				<Copy size={14} /> Copy
			{/if}
		</button>
	</div>
	<pre class="flex-1 overflow-auto px-4 py-3 text-sm whitespace-pre-wrap font-mono" style="background: var(--bg); color: var(--text);">{output}</pre>
</div>
