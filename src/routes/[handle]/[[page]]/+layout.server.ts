import { loadData } from '$lib/website/load';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { UserCache } from '$lib/types';

export async function load({ params, platform }) {
	if (env.PUBLIC_IS_SELFHOSTED) error(404);

	const cache = platform?.env?.USER_DATA_CACHE as unknown;

	console.log(params.page);

	return await loadData(params.handle, cache as UserCache, false, params.page);
}
