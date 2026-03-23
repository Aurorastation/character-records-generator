<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { CheckboxField } from '$lib/types';

	let { field, value = [], onChange }: { field: CheckboxField; value: string[]; onChange: (v: string[]) => void } = $props();

	let customInput = $state('');

	let knownValues = $derived(new Set(field.options.map((o) => o.value)));
	let customValues = $derived(value.filter((v) => !knownValues.has(v)));

	function toggle(optValue: string) {
		if (value.includes(optValue)) {
			onChange(value.filter((v) => v !== optValue));
		} else {
			onChange([...value, optValue]);
		}
	}

	function addCustom() {
		const trimmed = customInput.trim();
		if (trimmed && !value.includes(trimmed)) {
			onChange([...value, trimmed]);
		}
		customInput = '';
	}

	function removeCustom(val: string) {
		onChange(value.filter((v) => v !== val));
	}
</script>

<fieldset>
	<legend class="text-sm font-medium">{field.label}{#if field.required}<span style="color: var(--accent);"> *</span>{/if}</legend>
	<div class="mt-1 flex flex-col gap-1">
		{#each field.options as opt}
			<label class="flex items-center gap-2 text-sm cursor-pointer">
				<input
					type="checkbox"
					checked={value.includes(opt.value)}
					onchange={() => toggle(opt.value)}
				/>
				{opt.label}
			</label>
		{/each}
		{#each customValues as cv}
			<span class="flex items-center gap-2 text-sm">
				<input type="checkbox" checked={true} onchange={() => removeCustom(cv)} />
				{cv}
				<button onclick={() => removeCustom(cv)} class="hover:opacity-60">
					<X size={12} />
				</button>
			</span>
		{/each}
	</div>
	<div class="flex items-center gap-2 mt-2">
		<input
			type="text"
			bind:value={customInput}
			placeholder="Other..."
			onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
			class="rounded px-3 py-1.5 text-sm"
			style="background: var(--bg-input); border: 1px solid var(--border); color: var(--text);"
		/>
		<button
			onclick={addCustom}
			class="text-sm hover:opacity-80"
			style="color: var(--text-muted);"
		>
			Add
		</button>
	</div>
</fieldset>
