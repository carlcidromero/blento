<script lang="ts">
	import Website from '$lib/website/Website.svelte';
	import { Button } from '@foxui/core';

	let { data } = $props();
</script>

<svelte:body
	onkeydown={(e) => {
		if (e.key === 'ArrowRight' || e.key === 'r') {
			window.location.reload();
		}
	}}
/>

<Website {data} />

<Button
	onclick={() => {
		window.location.reload();
	}}
	size="lg"
	class="bg-accent-100 hover:bg-accent-200 dark:bg-accent-950/50 dark:hover:bg-accent-900/50 fixed right-4 bottom-4"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-dices-icon lucide-dices"
		><rect width="12" height="12" x="2" y="10" rx="2" ry="2" /><path
			d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"
		/><path d="M6 18h.01" /><path d="M10 14h.01" /><path d="M15 6h.01" /><path d="M18 9h.01" /></svg
	>Next
	<span class="sr-only">Next random profile</span></Button
>
