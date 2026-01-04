import { ImageCardDefinition } from './ImageCard';
import { LinkCardDefinition } from './LinkCard';
import { TextCardDefinition } from './TextCard';
import type { CardDefinition } from './types';

export const AllCardDefinitions = [
	ImageCardDefinition,
	TextCardDefinition,
	LinkCardDefinition
] as const;

export const CardDefinitionsByType = AllCardDefinitions.reduce(
	(acc, item) => {
		acc[item.type] = item;
		return acc;
	},
	{} as Record<string, CardDefinition>
);
