<script lang="ts">
	import '../app.css';

	import { ThemeToggle } from '@foxui/core';
	import { onMount } from 'svelte';
	import { initClient } from '$lib/oauth';
	import YoutubeVideoPlayer, { videoPlayer } from '$lib/cards/utils/YoutubeVideoPlayer.svelte';

	let { children } = $props();

	onMount(() => {
		initClient();
	});
</script>

{@render children()}

<ThemeToggle class="fixed top-2 left-2 z-10" />

{#if videoPlayer.id}
	<YoutubeVideoPlayer />
{/if}
