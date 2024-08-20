<script>
	let inputValue = ""
</script>

<div class="app2">
	<h5>
		App 2
	</h5>

	<p>
		Your input: {inputValue.toUpperCase()}
	</p>

	<input
		bind:value={inputValue}
		type="text"
	>
</div>

<style>
	.app2 {
		border: 1px solid;
		padding: 1rem;
	}
</style>
