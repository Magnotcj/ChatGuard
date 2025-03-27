<script>
    export let data;
    const { chats } = data;
    import { goto } from "$app/navigation";
  
    function openChat(chatId) {
      goto(`/chat/${chatId}`);
    }
  </script>
  
  <h1>Your Chats</h1>
  <ul>
    {#each chats as chat}
      <li on:click={() => openChat(chat.id)} class="chat-item">
        {chat.users.join(', ')}
      </li>
    {/each}
  </ul>
  
  <style>
    .chat-item {
      cursor: pointer;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .chat-item:hover {
      background: #f3f3f3;
    }
  </style>
  