import { loadData } from '$lib/website/load';
import { env } from '$env/dynamic/public';

export async function load({ platform, url }) {
	const hostname = url.hostname;

	let handle = env.PUBLIC_HANDLE;
	if (hostname === 'flo-bit.blento.app') {
		handle = 'flo-bit.dev';
	}

	const data = await loadData(handle, platform);
	return { ...data, handle };
}
