<script lang="ts">
	import { Button } from '$lib';

	export let data;
</script>

<div class="h-screen overflow-x-auto p-5 max-w-5xl mx-auto">
	<nav class="flex justify-end items-center -m-4 py-4">
		{#if data.user}
			<Button class="px-4" href="/logout">Logout</Button>
		{:else}
			<Button class="px-4" href="/login">Login</Button>
		{/if}
	</nav>

	<div class="mt-4">
		<slot />
	</div>
</div>
