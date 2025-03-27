<script>
    export let data;
    const { chatId, messages } = data;
    import { goto } from "$app/navigation";
  </script>
  
  <h1>{chatId}</h1>
  <ul>
    {#each messages as msg}
      <li class="chat-item">
        {msg.text + ' - ' + msg.user + ' (' + msg.time + ')'}
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
  