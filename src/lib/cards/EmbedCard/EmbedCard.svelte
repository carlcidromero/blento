<script lang="ts">
	import type { ContentComponentProps } from '../types';

	let { item }: ContentComponentProps = $props();
</script>

<iframe
	src={item.cardData.href}
	sandbox="allow-scripts"
	referrerpolicy="no-referrer"
	class="absolute inset-0 h-full w-full"
	title=""
></iframe>
