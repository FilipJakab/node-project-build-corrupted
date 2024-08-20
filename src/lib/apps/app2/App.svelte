<script>
	let counter = 0
</script>

<div class="app2">
	<h5>
		App 2
	</h5>

	{#each {length: counter} as _, i}
		<div>
			Block {i + 1}
		</div>
	{/each}

	<button on:click={() => counter += 1}>
		Button from app2
	</button>
</div>

<style>
	.app2 {
		border: 1px solid;
		padding: 1rem;
	}
</style>
