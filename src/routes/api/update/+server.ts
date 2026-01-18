import type { UserCache } from '$lib/types';
import { getCache, loadData } from '$lib/website/load';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { json } from '@sveltejs/kit';

export async function GET({ platform }) {
	if (!platform?.env?.USER_DATA_CACHE) return json('no cache');
	const existingUsers = await platform?.env?.USER_DATA_CACHE?.get('updatedBlentos');

	const existingUsersArray: ProfileViewDetailed[] = existingUsers ? JSON.parse(existingUsers) : [];

	const existingUsersHandle = existingUsersArray.map((v) => v.handle);

	const cache = platform?.env?.USER_DATA_CACHE as unknown;

	for (const handle of existingUsersHandle) {
		if (!handle) continue;

		console.log('updating', handle);
		try {
			const cached = await getCache(handle, 'self', cache as UserCache);
			if (!cached) await loadData(handle, cache as UserCache, true);
		} catch (error) {
			console.error(error);
			return json('error');
		}
		console.log('updated', handle);
	}

	return json('ok');
}
