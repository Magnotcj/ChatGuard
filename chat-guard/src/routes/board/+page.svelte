<script>
    export let messages;
    
    let newMessage = "";
    let userId = 1; // Get this from authentication if needed
    
    async function sendMessage() {
      if (!newMessage.trim()) return;
      
      // Sending message to the public board
      await fetch("/message-board/post-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, content: newMessage })
      });
    
      newMessage = "";
      location.reload(); // Refresh messages, consider using stores for better performance
    }
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
  
  <div class="input-container">
    <input bind:value={newMessage} placeholder="Type a message..." />
    <button on:click={sendMessage}>Post</button>
  </div>
  
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
  