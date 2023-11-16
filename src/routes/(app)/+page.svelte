<script lang="ts">
	import { Button } from '$lib';
	import { onMount } from 'svelte';

	export let form;
	let writeForm: HTMLFormElement;

	onMount(() => {
		if (form && !form.done && writeForm) {
			writeForm.submit();
		}
	});
</script>

<div class="grid grid-cols-2 gap-4 mb-4">
	<Button action="?/test">Test</Button>
	<Button action="?/write" bind:form={writeForm}>Write</Button>
</div>

{#if form}
	<pre class="text-sm rounded bg-gray-900 text-yellow-500 p-4">{JSON.stringify(
			form,
			null,
			'  '
		)}</pre>
{/if}
