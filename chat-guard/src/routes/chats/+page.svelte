<script>
  export let data;
  const { chats } = data;
  import { goto } from "$app/navigation";

  let openModal = false;
  let members = "";

  function openChat(chatId) {
    goto(`/chat/${chatId}`);
  }
</script>

<button on:click={() => goto('/dashboard')} id="backBtn">Back</button>
<h1>Your Chats</h1>
<form>
  <button on:click={() => openModal = true}> New Chat </button>
</form>
<ul>
  {#each chats as chat}
    <li on:click={() => openChat(chat.id)} class="chat-item">
      {chat.id + " - " + chat.users.join(", ")}
    </li>
  {/each}
</ul>


{#if openModal}
<div class="modal">
  <div class="modal-content">
    <h3>Create a new chat</h3>
    <h4>Enter chat member names separated by ','</h4>
    <form method="POST" action="?/createChat">
      <label>
        <input bind:value={members} name="members" placeholder="enter member names" />
      </label>
      <button type="submit" disabled={members == ""}> Create </button>
    </form>
    <button on:click={() => openModal = false} id="returnBtn">Close</button>
  </div>
</div>
{/if}

<style>
  .chat-item {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .chat-item:hover {
    background: #f3f3f3;
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
  button {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #800000;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>
