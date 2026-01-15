import type { CardDefinition } from '../types';
import DinoGameCard from './DinoGameCard.svelte';
import SidebarItemDinoGameCard from './SidebarItemDinoGameCard.svelte';

export const DinoGameCardDefinition = {
	type: 'dino-game',
	contentComponent: DinoGameCard,
	sidebarComponent: SidebarItemDinoGameCard,
	allowSetColor: true,
	createNew: (card) => {
		card.w = 4;
		card.h = 4;
		card.mobileW = 8;
		card.mobileH = 6;
		card.cardData = {};
	}
} as CardDefinition & { type: 'dino-game' };
