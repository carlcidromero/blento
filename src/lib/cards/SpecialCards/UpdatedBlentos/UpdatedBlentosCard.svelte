<script lang="ts">
	import { marked } from 'marked';
	import BaseCard, { type BaseCardProps } from '../../BaseCard/BaseCard.svelte';
	import MainUpdatedBlentosCards from './MainUpdatedBlentosCards.svelte';

	let { item, ...rest }: BaseCardProps = $props();

	const renderer = new marked.Renderer();
	renderer.link = ({ href, title, text }) =>
		`<a target="_blank" href="${href}" title="${title}">${text}</a>`;
</script>

<BaseCard {item} {...rest}>
	<MainUpdatedBlentosCards />
</BaseCard>
