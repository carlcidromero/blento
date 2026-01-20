<script lang="ts">
	import { getAdditionalUserData, getDidContext, getHandleContext } from '$lib/website/context';
	import { onMount } from 'svelte';
	import { CardDefinitionsByType } from '..';
	import type { ContentComponentProps } from '../types';
	import BlogEntry from './BlogEntry.svelte';

	let { item }: ContentComponentProps = $props();

	const data = getAdditionalUserData();
	// svelte-ignore state_referenced_locally
	let feed = $state(data[item.cardType] as any);

	let did = getDidContext();
	let handle = getHandleContext();

	onMount(async () => {
		console.log(feed);
		if (!feed) {
			feed = (await CardDefinitionsByType[item.cardType]?.loadData?.([item], {
				did,
				handle
			})) as any;

			console.log(feed);

			data[item.cardType] = feed;
		}
	});
</script>

<div class="flex h-full flex-col gap-10 overflow-y-scroll p-8">
	{#each feed ?? [] as document}
		<BlogEntry
			title={document.value.title}
			description={document.value.description}
			date={document.value.publishedAt}
			href={document.value.href}
		/>
	{/each}
</div>
