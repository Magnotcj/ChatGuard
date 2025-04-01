<script>
    export let messages;
    
    let message = "";
    let userId = 1; // Get this from authentication if needed
    
  </script>
  
  <h1>Public Message Board</h1>
  <div class="messages">
    {#each messages as message}
      <div class="message">
        <strong>{message.userName}</strong>
        <p>{message.content}</p>
      </div>
    {/each}
  </div>
  
  <form method="POST" action="?/postMessage">
    <label>
      <input bind:value={message} name="message" placeholder="message" />
    </label>
    <button type="submit" disabled={message == ""}> Send </button>
  </form>
  
  <style>
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
  