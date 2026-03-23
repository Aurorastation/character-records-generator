<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { MultiSelectField } from '$lib/types';

	let { field, value = [], onChange }: {
		field: MultiSelectField;
		value: string[];
		onChange: (v: string[]) => void;
	} = $props();

	let input = $state('');
	let open = $state(false);

	let available = $derived(
		field.options
			.filter((o) => !value.includes(o.value))
			.filter((o) => !input || o.label.toLowerCase().includes(input.toLowerCase()))
	);

	function add(val: string) {
		onChange([...value, val]);
		input = '';
	}

	function addCustom() {
		const trimmed = input.trim();
		if (trimmed && !value.includes(trimmed)) {
			onChange([...value, trimmed]);
		}
		input = '';
	}

	function remove(val: string) {
		onChange(value.filter((v) => v !== val));
	}

	function displayLabel(val: string): string {
		return field.options.find((o) => o.value === val)?.label ?? val;
	}
</script>

<div class="block">
	<span class="text-sm font-medium">{field.label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</span>

	<div class="flex flex-wrap gap-1 mt-1">
		{#each value as val}
			<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm" style="background: var(--border); color: var(--text);">
				{displayLabel(val)}
				<button onclick={() => remove(val)} class="hover:opacity-60">
					<X size={12} />
				</button>
			</span>
		{/each}
	</div>

	<div class="relative mt-1">
		<input
			type="text"
			bind:value={input}
			placeholder="Add..."
			onfocus={() => { open = true; }}
			onblur={() => { setTimeout(() => { open = false; }, 150); }}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					if (available.length) add(available[0].value);
					else addCustom();
				}
			}}
			class="block w-full rounded px-3 py-2 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		/>
		{#if open && (available.length || input.trim())}
			<ul class="absolute z-10 w-full mt-1 rounded shadow-lg max-h-48 overflow-y-auto" style="background: var(--bg-card); border: 1px solid var(--border);">
				{#each available as opt}
					<li>
						<button
							onmousedown={(e) => { e.preventDefault(); add(opt.value); }}
							class="block w-full text-left px-3 py-1.5 text-sm hover:opacity-80"
							style="color: var(--text);"
						>
							{opt.label}
						</button>
					</li>
				{/each}
				{#if input.trim() && !field.options.some((o) => o.label.toLowerCase() === input.trim().toLowerCase())}
					<li>
						<button
							onmousedown={(e) => { e.preventDefault(); addCustom(); }}
							class="block w-full text-left px-3 py-1.5 text-sm"
							style="color: var(--text-muted);"
						>
							Add "{input.trim()}"
						</button>
					</li>
				{/if}
			</ul>
		{/if}
	</div>
</div>
