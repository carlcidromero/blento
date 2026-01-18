import { getProfile } from '$lib/oauth/atproto';
import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { json } from '@sveltejs/kit';

export async function GET({ platform }) {
	if (!platform?.env?.USER_DATA_CACHE) return json('no cache');
	const existingUsers = await platform?.env?.USER_DATA_CACHE?.get('updatedBlentos');

	const existingUsersArray: ProfileViewDetailed[] = existingUsers ? JSON.parse(existingUsers) : [];

	const existingUsersSet = new Set(existingUsersArray.map((v) => v.did));

	const newProfilesPromises: Promise<ProfileViewDetailed>[] = [];
	for (const did of Array.from(existingUsersSet)) {
		const profile = getProfile({ did });
		newProfilesPromises.push(profile);
		if (newProfilesPromises.length > 20) break;
	}

	const newProfiles = await Promise.all(newProfilesPromises);

	await platform?.env?.USER_DATA_CACHE.put('updatedBlentos', JSON.stringify(newProfiles));

	return json('ok');
}
