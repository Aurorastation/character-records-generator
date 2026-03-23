<script lang="ts">
	import type { CheckboxField } from '$lib/types';

	let { field, value = [], onChange }: { field: CheckboxField; value: string[]; onChange: (v: string[]) => void } = $props();

	function toggle(optValue: string) {
		if (value.includes(optValue)) {
			onChange(value.filter((v) => v !== optValue));
		} else {
			onChange([...value, optValue]);
		}
	}
</script>

<fieldset>
	<legend class="text-sm font-medium">{field.label}</legend>
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
	</div>
</fieldset>
