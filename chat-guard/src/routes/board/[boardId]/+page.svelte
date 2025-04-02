<script>
  export let data;
  const { boardId, messages, headerMsg } = data;
  import { goto } from "$app/navigation";

  let openModal = false;
  let reportText = "";
  let reportMsgId = null;
  let msg = "";

  function openReport(id) {
    reportText = "";
    openModal = true;
    reportMsgId = id;
  }
</script>

<button on:click={() => goto('/boards')} id="backBtn">Back</button>
<h1 on:click={() => openReport(headerMsg[0].id)} class="chat-item">{headerMsg[0].text}</h1>
<h2>
  {headerMsg[0].user} ({headerMsg[0].time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })}, {headerMsg[0].time.toLocaleDateString("en-US")})
</h2>

<form method="POST" action="?/postMessage">
  <label>
    <input bind:value={msg} name="message" placeholder="message" />
  </label>
  <button type="submit" disabled={msg == ""}> Send </button>
</form>

<ul>
  {#each messages as message}
    <li on:click={() => openReport(message.id)} class="chat-item">
      {message.text} - <strong>{message.user}</strong>
      ({message.time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}, {message.time.toLocaleDateString("en-US")})
    </li>
  {/each}
</ul>

{#if openModal}
<div class="modal">
  <div class="modal-content">
    <h3>Submit a report</h3>
    <form method="POST" action="?/submitReport">
      <label>
        <input type="hidden" name="msgId" bind:value={reportMsgId} />
        <input bind:value={reportText} name="reportText" placeholder="enter report" />
      </label>
      <button type="submit" disabled={reportText == ""}>Submit</button>
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
