<script lang="ts">
	import { Alert, Button, Input, Modal, Subheading } from '@foxui/core';
	import type { CreationModalComponentProps } from '../types';
	import { matcher } from '.';

	let { item = $bindable(), oncreate, oncancel }: CreationModalComponentProps = $props();

	let isFetchingMetadata = $state(false);

	let errorMessage = $state('');

	const idRegExp = /^[A-Za-z0-9-_]+$/;

	function extractID(idOrUrl: string) {
		if (idRegExp.test(idOrUrl)) return idOrUrl;
		return matcher(idOrUrl);
	}

	async function fetchMetadata() {
		errorMessage = '';

		const videoid = extractID(item.cardData.href);
		if (!videoid) {
			errorMessage = 'Not a valid youtube URL!';
			return false;
		}
		const posterFile = 'hqdefault';
		const posterURL = `https://i.ytimg.com/vi/${videoid}/${posterFile}.jpg`;

		item.cardData.poster = posterURL;
		item.cardData.youtubeId = videoid;

		return true;
	}
</script>

<Modal open={true} closeButton={false}>
	<Subheading>Enter a link to a youtube video</Subheading>
	<Input bind:value={item.cardData.href} />

	{#if errorMessage}
		<Alert type="error" title="Failed to create youtube card"><span>{errorMessage}</span></Alert>
	{/if}

	<div class="mt-4 flex justify-end gap-2">
		<Button onclick={oncancel} variant="ghost">Cancel</Button>
		<Button
			disabled={isFetchingMetadata}
			onclick={async () => {
				if (await fetchMetadata()) oncreate();
			}}>{isFetchingMetadata ? 'Creating...' : 'Create'}</Button
		>
	</div>
</Modal>
