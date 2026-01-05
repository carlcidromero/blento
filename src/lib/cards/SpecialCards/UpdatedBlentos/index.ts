import type { CardDefinition } from '../../types';
import EditingUpdatedBlentosCard from './EditingUpdatedBlentosCard.svelte';
import UpdatedBlentosCard from './UpdatedBlentosCard.svelte';

export const UpdatedBlentosCardDefitition = {
	type: 'updatedBlentos',
	cardComponent: UpdatedBlentosCard,
	editingCardComponent: EditingUpdatedBlentosCard
} as CardDefinition & { type: 'updatedBlentos' };
