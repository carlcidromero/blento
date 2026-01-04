<script lang="ts">
	import { Button, Modal, Subheading } from '@foxui/core';
	import type { CreationModalComponentProps } from '../types';

	let { item = $bindable(), oncreate, oncancel }: CreationModalComponentProps = $props();

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length < 1) return;

		const file = target.files[0];
		const compressedFile = await compressImage(file);

		if (item.cardData.objectUrl) URL.revokeObjectURL(item.cardData.objectUrl);

		item.cardData.blob = compressedFile;
		item.cardData.objectUrl = URL.createObjectURL(compressedFile);
	}

	export function compressImage(file: File, maxSize: number = 600 * 1024): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const reader = new FileReader();

			reader.onload = (e) => {
				if (!e.target?.result) {
					return reject(new Error('Failed to read file.'));
				}
				img.src = e.target.result as string;
			};

			reader.onerror = (err) => reject(err);
			reader.readAsDataURL(file);

			img.onload = () => {
				let width = img.width;
				let height = img.height;
				const maxDimension = 2048;

				if (width > maxDimension || height > maxDimension) {
					if (width > height) {
						height = Math.round((maxDimension / width) * height);
						width = maxDimension;
					} else {
						width = Math.round((maxDimension / height) * width);
						height = maxDimension;
					}
				}

				console.log('Width:', width);
				console.log('Height:', height);

				// Create a canvas to draw the image
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext('2d');
				if (!ctx) return reject(new Error('Failed to get canvas context.'));
				ctx.drawImage(img, 0, 0, width, height);

				// Function to try compressing at a given quality
				let quality = 0.8;
				function attemptCompression() {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								return reject(new Error('Compression failed.'));
							}
							// If the blob is under our size limit, or quality is too low, resolve it
							if (blob.size <= maxSize || quality < 0.3) {
								console.log('Compression successful. Blob size:', blob.size);
								console.log('Quality:', quality);
								resolve(blob);
							} else {
								// Otherwise, reduce the quality and try again
								quality -= 0.1;
								attemptCompression();
							}
						},
						'image/jpeg',
						quality
					);
				}

				attemptCompression();
			};

			img.onerror = (err) => reject(err);
		});
	}

	let inputRef = $state<HTMLInputElement | null>(null);

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileChange({ target: { files: [file] } } as unknown as Event);
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'none';
		}
	}
</script>

<Modal
	bind:open={
		() => true,
		(change) => {
			if (!change) oncancel();
		}
	}
	closeButton={false}
>
	<Subheading>Select an image</Subheading>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		ondragover={handleDragOver}
		ondrop={handleDrop}
		ondragleave={handleDragLeave}
		onclick={() => {
			inputRef?.click();
		}}
		class="dark:bg-accent-600/5 hover:bg-accent-400/10 dark:hover:bg-accent-600/10 border-accent-400 bg-accent-400/5 dark:border-accent-800 flex h-44 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-4 transition-colors duration-200"
	>
		{#if !item.cardData.objectUrl}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="text-accent-600 dark:text-accent-400 size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
				/>
			</svg>
			<span class="text-accent-600 dark:text-accent-400 text-sm">Click to upload image</span>
		{:else}
			<img
				alt=""
				src={item.cardData.objectUrl}
				class="max-h-full max-w-full rounded-xl object-contain"
			/>
		{/if}
		<input
			type="file"
			accept="image/*"
			onchange={handleFileChange}
			class="hidden"
			multiple
			bind:this={inputRef}
		/>
	</div>

	<div class="mt-4 flex justify-end gap-2">
		<Button
			onclick={() => {
				if (item.cardData.objectUrl) URL.revokeObjectURL(item.cardData.objectUrl);

				oncancel();
			}}
			variant="ghost">Cancel</Button
		>
		<Button
			disabled={!item.cardData.objectUrl}
			onclick={async () => {
				oncreate();
			}}>Create</Button
		>
	</div>
</Modal>
