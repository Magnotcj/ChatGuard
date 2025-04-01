<script>
  export let data;
  const { messages } = data;

  let message = "";
  let userId = 1; // Get this from authentication if needed
</script>

<h1>Public Message Board</h1>
<div class="messages">
  {#each messages as message}
    <li class="chat-item">
      {message.text} - <strong>{message.user}</strong>
      ({message.time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}, {message.time.toLocaleDateString("en-US")})
    </li>
  {/each}
</div>

<form method="POST" action="?/postMessage">
  <label>
    <input bind:value={message} name="message" placeholder="message" />
  </label>
  <button type="submit" disabled={message == ""}> Send </button>
</form>

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
    padding: 8px;
    cursor: pointer;
  }
</style>
