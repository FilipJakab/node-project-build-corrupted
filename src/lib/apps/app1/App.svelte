<script>
	let counter = 0
</script>

<div class="app1">
	<h5>
		App 1
	</h5>

	<p>
		counter: {counter}
	</p>

	<button on:click={() => counter += 1}>
		Button from app1
	</button>
</div>

<style>
	.app1 {
		border: 1px solid;
		padding: 1rem;
	}
</style>
