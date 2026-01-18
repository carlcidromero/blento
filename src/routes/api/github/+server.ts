import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import type { GitHubContributionsData } from '$lib/cards/GitHubProfileCard/types';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const CONTRIBUTIONS_QUERY = `
query($login: String!) {
	user(login: $login) {
		login
		avatarUrl
		contributionsCollection {
			contributionCalendar {
				totalContributions
				weeks {
					contributionDays {
						date
						contributionCount
						color
					}
				}
			}
		}
		followers {
			totalCount
		}
	}
}
`;

export const GET: RequestHandler = async ({ url, platform }) => {
	const user = url.searchParams.get('user');

	if (!user) {
		return json({ error: 'No user provided' }, { status: 400 });
	}

	const cachedData = await platform?.env?.USER_DATA_CACHE?.get('#github:' + user);

	if (cachedData) {
		const parsedCache = JSON.parse(cachedData);

		const TWELVE_HOURS = 12 * 60 * 60 * 1000;
		const now = Date.now();

		if (now - (parsedCache.updatedAt || 0) < TWELVE_HOURS) {
			return json(parsedCache);
		}
	}

	const token = env.GITHUB_TOKEN;

	if (!token) {
		return json({ error: 'GitHub token not configured' }, { status: 500 });
	}

	try {
		const response = await fetch(GITHUB_GRAPHQL_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				query: CONTRIBUTIONS_QUERY,
				variables: { login: user }
			})
		});

		if (!response.ok) {
			return json({ error: 'Failed to fetch GitHub data' }, { status: response.status });
		}

		const data = await response.json();

		if (data.errors) {
			return json({ error: data.errors[0]?.message || 'GraphQL error' }, { status: 400 });
		}

		if (!data.data?.user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		const result = data.data.user as GitHubContributionsData;
		result.updatedAt = Date.now();

		await platform?.env?.USER_DATA_CACHE?.put('#github:' + user, JSON.stringify(result));

		return json(result);
	} catch (error) {
		console.error('Error fetching GitHub contributions:', error);
		return json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
	}
};
