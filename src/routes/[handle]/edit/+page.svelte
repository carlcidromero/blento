<script lang="ts">
	import { page } from '$app/state';
	import EditableWebsite from '$lib/EditableWebsite.svelte';
	import { setRecentRecords } from '$lib/helper.js';
	import { type Item } from '$lib/types.js';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	setRecentRecords(data.recentRecords);
</script>

<EditableWebsite
	handle={page.params.handle}
	did={data.did}
	{data}
	items={Object.values(data.data['app.blento.card']).map((i) => i.value) as Item[]}
/>
