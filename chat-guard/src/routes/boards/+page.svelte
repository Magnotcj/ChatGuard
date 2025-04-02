<script>
  export let data;
  const { boards } = data;
  import { goto } from "$app/navigation";

  let message = "";
  let userId = 1; // Get this from authentication if needed

  function openBoard(boardId) {
    goto(`/board/${boardId}`);
  }
</script>

<button on:click={() => goto('/dashboard')} id="backBtn">Back</button>
<h1>Public Message Board</h1>


<form method="POST" action="?/postMessage">
  <label>
    <input bind:value={message} name="message" placeholder="message" />
  </label>
  <button type="submit" disabled={message == ""}> Send </button>
</form>

<div class="messages">
  {#each boards as board}
    <li on:click={() => openBoard(board.id)} class="chat-item">
      {board.text} - <strong>{board.user}</strong>
      ({board.time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}, {board.time.toLocaleDateString("en-US")})
    </li>
  {/each}
</div>

<style>
  .chat-item {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .chat-item:hover {
    background: #f3f3f3;
  }
  .messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  .message {
    margin-bottom: 10px;
  }
  .input-container {
    display: flex;
    gap: 10px;
  }
  input {
    flex: 1;
    padding: 8px;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #800000;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>
