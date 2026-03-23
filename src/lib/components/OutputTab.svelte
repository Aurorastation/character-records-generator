<script lang="ts">
	import { Copy, Check, Share2 } from 'lucide-svelte';

	let { output, onShare }: { output: string; onShare?: () => void } = $props();

	let copied = $state(false);
	let shared = $state(false);

	let wordCount = $derived(
		output.trim() ? output.trim().split(/\s+/).length : 0
	);

	async function copy() {
		await navigator.clipboard.writeText(output);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	async function share() {
		if (!onShare) return;
		await onShare();
		shared = true;
		setTimeout(() => { shared = false; }, 2000);
	}
</script>

<div class="flex flex-col h-full min-h-0">
	<div class="flex items-center justify-between px-3 py-2 text-sm shrink-0" style="color: var(--text-muted);">
		<span>{wordCount} words</span>
		<div class="flex items-center gap-2">
			<button onclick={copy} class="flex items-center gap-1 px-2 py-1 rounded border hover:opacity-80" style="border-color: var(--border);">
				{#if copied}
					<Check size={14} /> Copied
				{:else}
					<Copy size={14} /> Copy
				{/if}
			</button>
			{#if onShare}
				<button onclick={share} class="flex items-center gap-1 px-2 py-1 rounded border hover:opacity-80" style="border-color: var(--border);">
					{#if shared}
						<Check size={14} /> Link Copied
					{:else}
						<Share2 size={14} /> Share
					{/if}
				</button>
			{/if}
		</div>
	</div>
	<pre class="flex-1 overflow-auto px-4 py-3 text-sm whitespace-pre-wrap font-mono" style="background: var(--bg); color: var(--text);">{output}</pre>
</div>
