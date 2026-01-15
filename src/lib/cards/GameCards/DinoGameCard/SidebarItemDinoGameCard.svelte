<script lang="ts">
	import { Button } from '@foxui/core';

	let { onclick }: { onclick: () => void } = $props();
</script>

<Button {onclick} variant="ghost" class="w-full justify-start">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		class="text-accent-600 dark:text-accent-400"
	>
		<!-- Dino silhouette -->
		<path
			d="M18 4h-2v2h-2v2h-2V6h-2V4H8v2H6v2H4v2H2v8h2v2h2v-2h2v-2h2v2h2v-2h2v2h2v-2h2V8h-2V6h-2V4zm-8 8H8v-2h2v2zm4 0h-2v-2h2v2z"
		/>
	</svg>

	Dino Game</Button
>
