import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const q = url.searchParams.get('q');
	if (!q) {
		return json({ error: 'No search provided' }, { status: 400 });
	}

	try {
		const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(q);
		console.log(url);
		const data = await fetch(url);
		const location = await data.json();

		return json(location[0]);
	} catch (error) {
		console.error('Error fetching location:', error);
		return json({ error: 'Failed to fetch location' }, { status: 500 });
	}
}
