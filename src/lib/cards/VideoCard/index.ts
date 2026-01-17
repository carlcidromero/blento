import { uploadBlob } from '$lib/oauth/utils';
import type { CardDefinition } from '../types';
import VideoCard from './VideoCard.svelte';
import VideoCardSettings from './VideoCardSettings.svelte';

async function getAspectRatio(videoBlob: Blob): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const video = document.createElement('video');
		video.preload = 'metadata';

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(video.src);
			resolve({
				width: video.videoWidth,
				height: video.videoHeight
			});
		};

		video.onerror = () => {
			URL.revokeObjectURL(video.src);
			reject(new Error('Failed to load video metadata'));
		};

		video.src = URL.createObjectURL(videoBlob);
	});
}

export const VideoCardDefinition = {
	type: 'video',
	contentComponent: VideoCard,
	createNew: (card) => {
		card.cardType = 'video';
		card.cardData = {
			video: null,
			href: ''
		};
	},
	upload: async (item) => {
		if (item.cardData.blob) {
			const blob = item.cardData.blob;
			const aspectRatio = await getAspectRatio(blob);
			const uploadedBlob = await uploadBlob(blob);

			item.cardData.video = {
				$type: 'app.bsky.embed.video',
				video: uploadedBlob,
				aspectRatio
			};

			delete item.cardData.blob;
		}

		if (item.cardData.objectUrl) {
			URL.revokeObjectURL(item.cardData.objectUrl);
			delete item.cardData.objectUrl;
		}

		return item;
	},
	settingsComponent: VideoCardSettings,

	name: 'Video Card'
} as CardDefinition & { type: 'video' };
