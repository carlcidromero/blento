<script lang="ts">
	import { getDidContext } from '$lib/website/context';
	import { getImageBlobUrl } from '$lib/website/utils';
	import BaseEditingCard, { type BaseEditingCardProps } from '../BaseCard/BaseEditingCard.svelte';

	let { item = $bindable(), ...rest }: BaseEditingCardProps = $props();

	const did = getDidContext();

	function getSrc() {
		if (item.cardData.objectUrl) return item.cardData.objectUrl;

		if (item.cardData.image && typeof item.cardData.image === 'object') {
			return getImageBlobUrl({ did, link: item.cardData.image?.ref?.$link });
		}
		return item.cardData.image;
	}
</script>

<BaseEditingCard {item} {...rest}>
	{#key item.cardData.image || item.cardData.objectUrl}
		<img
			class={[
				'absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-300 ease-in-out',
				item.cardData.href ? 'group-hover:scale-105' : ''
			]}
			src={getSrc()}
			alt=""
		/>
	{/key}
	{#if item.cardData.href}
		<a
			href={item.cardData.href}
			class="absolute inset-0 h-full w-full"
			target="_blank"
			rel="noopener noreferrer"
		>
			<span class="sr-only">
				{item.cardData.hrefText ?? 'Learn more'}
			</span>
		</a>
	{/if}
</BaseEditingCard>
