<script lang="ts">
	import { page } from '$app/state';
	import { type Item } from '$lib/types.js';
	import Website from '$lib/Website.svelte';

	let { data } = $props();
	$inspect(data);
</script>

<Website
	{data}
	handle={data.handle}
	did={data.did}
	items={Object.values(data.data['com.example.bento']).map((i) => i.value) as Item[]}
/>
