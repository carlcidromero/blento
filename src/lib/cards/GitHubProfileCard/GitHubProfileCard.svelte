<script lang="ts">
	import { onMount } from 'svelte';
	import { siGithub } from 'simple-icons';
	import { getAdditionalUserData, getIsMobile } from '$lib/website/context';
	import type { ContentComponentProps } from '../types';
	import type { GithubProfileLoadedData } from '.';
	import GithubContributionsGraph from './GithubContributionsGraph.svelte';
	import { Button } from '@foxui/core';

	let { item }: ContentComponentProps = $props();

	const data = getAdditionalUserData();

	let isLoaded = $state(false);
	// svelte-ignore state_referenced_locally
	let contributionsData = $state(
		(data[item.cardType] as GithubProfileLoadedData)?.[item.cardData.user]
	);

	onMount(async () => {
		console.log(contributionsData);
		if (!contributionsData && item.cardData?.user) {
			try {
				const response = await fetch(`/api/github?user=${encodeURIComponent(item.cardData.user)}`);
				if (response.ok) {
					contributionsData = await response.json();
					data[item.cardType] ??= {};
					data[item.cardType][item.cardData.user] = contributionsData;
				}
			} catch (error) {
				console.error('Failed to fetch GitHub contributions:', error);
			}
		}
		isLoaded = true;
	});

	let isMobile = getIsMobile();
</script>

<div class="h-full overflow-hidden p-4">
	{#if contributionsData}
		<div class="flex h-full flex-col justify-between">
			<!-- Header -->
			<div class="flex justify-between">
				<div class="flex items-center gap-3">
					<div class="fill-base-950 size-6 shrink-0 dark:fill-white [&_svg]:size-full">
						{@html siGithub.svg}
					</div>
					<a
						href="https://github.com/{item.cardData.user}"
						target="_blank"
						rel="noopener noreferrer"
						class=" flex truncate text-2xl font-bold transition-colors"
					>
						{item.cardData.user}
					</a>
				</div>

				{#if isMobile() ? item.mobileW > 4 : item.w > 2}
					<Button
						href="https://github.com/{item.cardData.user}"
						target="_blank"
						rel="noopener noreferrer"
						class="z-50">Follow</Button
					>
				{/if}
			</div>

			<div class="flex">
				<GithubContributionsGraph
					data={contributionsData}
					isBig={isMobile() ? item.mobileH > 5 : item.h > 2}
				/>
			</div>
		</div>
	{:else if isLoaded}
		<div
			class="text-base-600 dark:text-base-400 accent:text-base-800 flex h-full w-full items-center justify-center text-sm"
		>
			Could not load GitHub contributions
		</div>
	{:else}
		<div
			class="text-base-600 dark:text-base-400 accent:text-base-800 flex h-full w-full items-center justify-center text-sm"
		>
			Loading contributions...
		</div>
	{/if}
</div>

{#if item.cardData.href}
	<a
		href={item.cardData.href}
		class="absolute inset-0 h-full w-full"
		target="_blank"
		rel="noopener noreferrer"
	>
		<span class="sr-only"> Show on github </span>
	</a>
{/if}
