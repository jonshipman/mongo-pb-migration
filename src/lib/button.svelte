<script lang="ts">
	import { goto } from '$app/navigation';

	export let action = '';
	export let href = '';
	export let form: HTMLFormElement | undefined = undefined;
	let className = '';

	function handleClick(event: Event) {
		if (href) {
			event.preventDefault();
			goto(href);
		}
	}

	export { className as class };
</script>

{#if action}
	<form method="POST" {action} bind:this={form}>
		<svelte:self class={className}>
			<slot />
		</svelte:self>
	</form>
{:else}
	<div class={className}>
		<button
			type="submit"
			class="block w-full hover:bg-indigo-400 active:bg-indigo-600 bg-indigo-500 text-white py-1 px-4 rounded"
			on:click={handleClick}
		>
			<slot />
		</button>
	</div>
{/if}
