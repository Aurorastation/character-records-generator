<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/theme.svelte';
	import { roster } from '$lib/state.svelte';

	let { children } = $props();
	let ready = $state(false);

	onMount(async () => {
		theme.init();
		await roster.load();
		ready = true;
	});
</script>

{#if ready}
	{@render children()}
{/if}
