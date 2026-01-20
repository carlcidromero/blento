import { getRecord, listRecords } from '$lib/oauth/atproto';
import { parseUri } from '$lib/oauth/utils';
import type { CardDefinition } from '../types';
import StandardSiteDocumentListCard from './StandardSiteDocumentListCard.svelte';

export const StandardSiteDocumentListCardDefinition = {
	type: 'publicationList',
	contentComponent: StandardSiteDocumentListCard,
	createNew: (card) => {
		card.w = 4;
		card.mobileW = 8;
		card.mobileH = 6;
	},

	loadData: async (items, { did }) => {
		const records = await listRecords({ did, collection: 'site.standard.document' });

		const publications: Record<string, string> = {};
		for (const record of records) {
			const site = record.value.site as string;

			if (site.startsWith('at://')) {
				if (!publications[site]) {
					const siteParts = parseUri(site);

					const publicationRecord = await getRecord(siteParts);

					publications[site] = publicationRecord.value.url as string;
				}

				record.value.href = publications[site] + record.value.path;
			} else {
				record.value.href = site + record.value.path;
			}
		}

		return records;
	},

	sidebarButtonText: 'site.standard.document list'
} as CardDefinition & { type: 'site.standard.document list' };
