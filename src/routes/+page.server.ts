import { loadData } from '$lib/website/load';
import { env } from '$env/dynamic/public';
import type { UserCache } from '$lib/types';

export async function load({ platform, url }) {
	const hostname = url.hostname;

	let handle = env.PUBLIC_HANDLE;
	if (hostname === 'flo-bit.blento.app') {
		handle = 'flo-bit.dev';
	}
	const cache = platform?.env?.USER_DATA_CACHE as unknown;

	return await loadData(handle, cache as UserCache);
}
