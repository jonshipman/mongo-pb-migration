<script lang="ts">
	import { Button, Field, Wrapper } from '$lib';
</script>

<Wrapper action="?/login" title="Login to your account">
	<Field label="Email address" name="email" required autocomplete="email" type="email" />
	<Field label="Password" name="password" required type="password" />

	<div>
		<Button>Login</Button>
	</div>
</Wrapper>
