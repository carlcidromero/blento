<script lang="ts">
	import { Button } from '@foxui/core';

	let { onclick }: { onclick: () => void } = $props();
</script>

<Button {onclick} variant="ghost" class="w-full justify-start">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="text-accent-600 dark:text-accent-400"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		><path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" /><path
			d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"
		/><circle cx="13" cy="7" r="1" fill="currentColor" /><rect
			x="8"
			y="2"
			width="14"
			height="14"
			rx="2"
		/></svg
	>

	Bluesky media
</Button>
