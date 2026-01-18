import type { CardDefinition } from '../types';
import type GithubContributionsGraph from './GithubContributionsGraph.svelte';
import GitHubProfileCard from './GitHubProfileCard.svelte';
import type { GitHubContributionsData } from './types';

export type GithubProfileLoadedData = Record<string, GitHubContributionsData | undefined>;

export const GithubProfileCardDefitition = {
	type: 'githubProfile',
	contentComponent: GitHubProfileCard,

	loadData: async (items) => {
		const githubData: Record<string, GithubContributionsGraph> = {};
		for (const item of items) {
			try {
				const response = await fetch(
					`https://blento.app/api/github?user=${encodeURIComponent(item.cardData.user)}`
				);
				if (response.ok) {
					githubData[item.cardData.user] = await response.json();
				}
			} catch (error) {
				console.error('Failed to fetch GitHub contributions:', error);
			}
		}
		return githubData;
	},
	onUrlHandler: (url, item) => {
		const username = getGitHubUsername(url);

		console.log(username);
		if (!username) return;

		item.cardData.href = url;
		item.cardData.user = username;

		item.w = 6;
		item.mobileW = 8;
		item.h = 3;
		item.mobileH = 6;
		return item;
	},
	urlHandlerPriority: 5,
	minH: 2,
	minW: 2,

	canChange: (item) => Boolean(getGitHubUsername(item.cardData.href)),
	change: (item) => {
		item.cardData.user = getGitHubUsername(item.cardData.href);

		return item;
	},
	name: 'Github Profile'
} as CardDefinition & { type: 'githubProfile' };

function getGitHubUsername(url: string | undefined): string | undefined {
	if (!url) return;

	try {
		const parsed = new URL(url);

		// Must be github.com (optionally with www.)
		if (!/^(www\.)?github\.com$/.test(parsed.hostname)) {
			return undefined;
		}

		// Remove empty segments
		const segments = parsed.pathname.split('/').filter(Boolean);

		// Profile URLs have exactly one path segment: /username
		if (segments.length !== 1) {
			return undefined;
		}

		const username = segments[0];

		// GitHub username rules (simplified but accurate)
		// - Alphanumeric or hyphens
		// - Cannot start or end with a hyphen
		// - Max length 39
		if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
			return undefined;
		}

		return username;
	} catch {
		// Invalid URL
		return undefined;
	}
}
