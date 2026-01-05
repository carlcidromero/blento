<script lang="ts">
	import { setRecentRecords } from '$lib/helper.js';
	import { type Item } from '$lib/types.js';
	import Website from '$lib/Website.svelte';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	setRecentRecords(data.recentRecords);
</script>

<Website
	{data}
	handle={data.handle}
	did={data.did}
	items={Object.values(data.data['app.blento.card']).map((i) => i.value) as Item[]}
/>
