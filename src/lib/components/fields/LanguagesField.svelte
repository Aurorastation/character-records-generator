<script lang="ts">
	import type { LanguagesField } from '$lib/types';
	import { languages } from '$lib/data';

	let { field, value = ['Tau Ceti Basic'], onChange }: {
		field: LanguagesField;
		value: string[];
		onChange: (v: string[]) => void;
	} = $props();

	function toggle(name: string) {
		if (value.includes(name)) {
			onChange(value.filter((v) => v !== name));
		} else {
			onChange([...value, name]);
		}
	}
</script>

<fieldset>
	<legend class="text-sm font-medium">{field.label}</legend>
	<div class="mt-1 flex flex-col gap-1">
		{#each languages as lang}
			<label class="flex items-center gap-2 text-sm cursor-pointer">
				<input
					type="checkbox"
					checked={value.includes(lang.name)}
					onchange={() => toggle(lang.name)}
				/>
				{lang.name}
			</label>
		{/each}
	</div>
</fieldset>
