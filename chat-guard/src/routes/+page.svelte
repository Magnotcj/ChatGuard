<svelte:head>
    <title>Chat Guard</title> 
</svelte:head>

<nav class="navbar navbar-dark">
	
</nav>
<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
    import { showModal } from './store.js';
	let creating = false;
    export let form;
    $: isModalVisible = $showModal;
    function closeModalAndRedirect() {
        showModal.set(false);  // Close the modal
        goto('./');    // Redirect to the home page
    }
</script>
<div class="centered">
	<h1>Welcome</h1>
	<br>

	<form
		method="POST" action="?/create"
	>
	<label>
		Username:
		<input
		   type="username"
		   name="username"
		   autocomplete="off"
		   required
		/>
	 </label>
	 
	 <label>
		Password:
		<input
		   type="password"
		   name="password"
		   autocomplete="off"
		   required
		/>
     </label>
        <button formaction="?/login" type="submit" disabled={creating}>
            {creating ? 'Saving...' : 'Log In'}
        </button>
        <button formaction="?/create" type="submit" disabled={creating}>
            {creating ? 'Saving...' : 'Sign Up'}
        </button>
		
	</form>
	<a href='https://docs.google.com/document/d/1OSOZiAH3Wd2-iuRVmsZMMHUwBezOOmiEyMSOqa72VoQ/edit?usp=sharing'> 
		<h3>Privacy Policy</h3>
		</a>
    <!-- Success Modal -->
	{#if form?.success}
	<div class="modal">
	<div class="modal-content">
	<h3>Account Successfully Created!</h3>
	<button on:click={closeModalAndRedirect} id="returnBtn">Close</button>
	</div>
	</div>
	{/if}

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}
</div>

<style>
    .navbar {
        background-color: #800000;
        color: white;
    }
    .centered {
		max-width: 20em;
		margin: 0 auto;
	}
	.modal {
       position: fixed;
       top:36%;
        left:36%;
        width:100%;
        height:100%;
        background-color:rgba(0, 0, 0, 0);
       display: flex;
       justify-content: center;
       align-items: center;
       display: block;
       z-index: 9999;
   }
   .modal-content {
		background: white;
		padding: 20px;
		width: 400px; /* Set a fixed width */
		max-width: 90%; /* Prevent it from being too large */
		border-radius: 10px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
		text-align: center;
		position: relative;
	}
	label {
		display: block;
		margin-top: 1rem; 
	}

	input {
		width: 100%; 
		padding: 0.5rem; 
		margin-top: 0.5rem; 
	}
	button {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: #800000;
        color: white;
        border: none;
        cursor: pointer;
    }

    button[disabled] {
        background-color: #ccc;
    }

</style>
