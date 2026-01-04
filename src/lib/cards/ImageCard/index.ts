import type { CardDefinition } from '../types';
import EditingImageCard from './EditingImageCard.svelte';
import ImageCard from './ImageCard.svelte';

export const ImageCardDefinition = {
	type: 'image',
	cardComponent: ImageCard,
	editingCardComponent: EditingImageCard,
	createNew: (card) => {
		card.cardType = 'image';
		card.cardData = {
			image: `https://picsum.photos/seed/${card.id}/800/800`,
			alt: '',
			href: 'https://example.com'
		};
		console.log('adding new card', card);
	}
} as CardDefinition & { type: 'image' };
