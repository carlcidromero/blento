<script lang="ts">
	import type { WebsiteData } from '$lib/types';
	import type { Snippet } from 'svelte';
	import { setAdditionalUserData, setCanEdit, setDidContext, setHandleContext } from './context';
	import { dev } from '$app/environment';
	import { client } from '$lib/oauth';

	let {
		data,
		children
	}: {
		data: WebsiteData;
		children: Snippet<[]>;
	} = $props();

	// svelte-ignore state_referenced_locally
	setAdditionalUserData(data.additionalData);

	setCanEdit(() => dev || (client.isLoggedIn && client.profile?.did === data.did));

	// svelte-ignore state_referenced_locally
	setDidContext(data.did);
	// svelte-ignore state_referenced_locally
	setHandleContext(data.handle);
</script>

{@render children()}
