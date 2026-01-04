import type { CardDefinition } from '../types';
import EditingLinkCard from './EditingLinkCard.svelte';
import LinkCard from './LinkCard.svelte';

export const LinkCardDefinition = {
	type: 'link',
	cardComponent: LinkCard,
	editingCardComponent: EditingLinkCard,
	createNew: (card) => {
		card.cardType = 'link';
		card.cardData = {
			href: 'https://flo-bit.dev'
		};
	}
} as CardDefinition & { type: 'link' };
