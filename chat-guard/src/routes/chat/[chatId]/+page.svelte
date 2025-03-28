<script>
  export let data;
  const { chatId, messages, members } = data;
  import { goto } from "$app/navigation";

  let msg = "";
</script>

<h1>{members.join(", ")}</h1>
<ul>
  {#each messages as msg}
    <li class="chat-item">
      {msg.text + " - " + msg.user + " (" + msg.time + ")"}
    </li>
  {/each}
</ul>

<form method="POST" action="?/postMessage">
  <label>
    <input bind:value={msg} name="message" placeholder="message" />
  </label>
  <button type="submit" disabled={msg == ""}> Send </button>
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
  button {
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #800000;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>
