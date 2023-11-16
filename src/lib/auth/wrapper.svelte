<script lang="ts">
	export let action: string;
	export let title: string;
</script>

<div class="h-screen">
	<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
			<h2
				class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100"
			>
				{title}
			</h2>
			<div class="text-center">
				<slot name="altaction">
					or <a class="text-indigo-500 hover:underline cursor-pointer" href="/login">login</a>
				</slot>
			</div>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form class="space-y-6" {action} method="POST">
				<slot />
			</form>
		</div>
	</div>
</div>
