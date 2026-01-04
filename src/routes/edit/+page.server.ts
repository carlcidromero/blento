import { loadData } from '$lib/website/utils';

export async function load() {
	const mainHandle = 'flo-bit.dev';
	const data = await loadData(mainHandle);
	return { ...data, handle: mainHandle };
}
