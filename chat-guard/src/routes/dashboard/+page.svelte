<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let creating = false;
</script>

<svelte:head>
  <title>Chat Guard</title>
</svelte:head>

<nav class="navbar navbar-dark"></nav>
<div class="centered">
  <h1>Welcome</h1>
  <br />
  <form>
    <button formaction="/subscription" type="submit" disabled={creating}>
      {creating ? "Saving..." : "Manage Subscription"}
    </button>
  </form>
  <form>
    <button formaction="/chats" type="submit" disabled={creating}>
      {creating ? "Saving..." : "Chats"}
    </button>
    <button formaction="/boards" type="submit" disabled={creating}>
      {creating ? "Saving..." : "Public"}
    </button>
  </form>
  <form method="POST" action="?/delete">
    <button disabled={creating}>
      Delete Account
    </button>
  </form>
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
    top: 36%;
    left: 36%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
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
