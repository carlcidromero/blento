<script lang="ts">
	import type { Item } from '$lib/types';
	import { Checkbox, Label } from '@foxui/core';

	let { item }: { item: Item; onclose: () => void } = $props();
</script>

<div class="flex items-center space-x-2">
	<Checkbox
		bind:checked={
			() => Boolean(item.cardData.showInline), (val) => (item.cardData.showInline = val)
		}
		id="show-inline"
		aria-labelledby="show-inline-label"
		variant="secondary"
	/>
	<Label
		id="show-inline-label"
		for="show-inline"
		class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Show video in card
	</Label>
</div>
