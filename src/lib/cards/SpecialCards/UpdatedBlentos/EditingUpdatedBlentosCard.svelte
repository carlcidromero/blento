<script lang="ts">
	import type { Item } from '$lib/types';
	import BaseEditingCard, {
		type BaseEditingCardProps
	} from '../../BaseCard/BaseEditingCard.svelte';
	import MainUpdatedBlentosCards from './MainUpdatedBlentosCards.svelte';

	let { item = $bindable<Item>(), ...rest }: BaseEditingCardProps = $props();
</script>

<BaseEditingCard {item} {...rest}>
	<MainUpdatedBlentosCards />
</BaseEditingCard>
