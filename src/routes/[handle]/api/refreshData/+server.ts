import type { UserCache } from '$lib/types';
import { loadData } from '$lib/website/load.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, platform }) {
	if (!platform?.env?.USER_DATA_CACHE) return json('no cache');
	const handle = params.handle;

	const cache = platform?.env?.USER_DATA_CACHE as unknown;
	await loadData(handle, cache as UserCache, true);

	return json('ok');
}
