//Music by DJARTMUSIC - The Return Of The 8-bit Era
//https://pixabay.com/de/music/videospiele-the-return-of-the-8-bit-era-301292/


import type { CardDefinition } from '../types';
import TetrisCard from './TetrisCard.svelte';
import SidebarItemTetrisCard from './SidebarItemTetrisCard.svelte';

export const TetrisCardDefinition = {
	type: 'tetris',
	contentComponent: TetrisCard,
	sidebarComponent: SidebarItemTetrisCard,
	allowSetColor: true,
	defaultColor: 'accent',
	createNew: (card) => {
		card.w = 4;
		card.h = 6;
		card.mobileW = 6;
		card.mobileH = 8;
		card.cardData = {};
	},
	maxH: 10
} as CardDefinition & { type: 'tetris' };
