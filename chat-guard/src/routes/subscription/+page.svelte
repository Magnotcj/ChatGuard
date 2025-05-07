<script>
  import { enhance } from '$app/forms';
  let subscriptionType = '0';
    let step = 'start'; // 'start' | 'loading' | 'success' | 'error'
  
    function fakePayPalPayment() {
      step = 'loading';
  
      // Simulate a delay for "payment processing"
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; // 90% chance of success
        step = isSuccess ? 'success' : 'error';
      }, 2000);
    }
  
    function reset() {
      step = 'start';
    }
  </script>
  <div class="centered">
    <h2>Subscription</h2>
	<form method="POST" action="?/create" use:enhance>
      <label>
        Select the type of subscription
        <select name="subscriptionType" bind:value={subscriptionType} required>
            <option value="1">Weekly</option>
            <option value="2">Monthly</option>
        </select>
      </label>
      <button type="submit">Update</button>
    </form>
    </div>
  
  <div class="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl text-center">
    {#if step === 'start'}
      <h2 class="text-xl font-bold mb-4">Fake PayPal Payment</h2>
      <button on:click={fakePayPalPayment} class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded">
        Pay with PayPal
      </button>
    {:else if step === 'loading'}
      <p class="text-blue-500 font-semibold">Processing payment...</p>
    {:else if step === 'success'}
      <p class="text-green-600 font-bold">Payment successful! 🎉</p>
      <button on:click={reset} class="mt-4 bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded">
        Try Again
      </button>
    {:else if step === 'error'}
      <p class="text-red-600 font-bold">Payment failed. Please try again.</p>
      <button on:click={reset} class="mt-4 bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded">
        Try Again
      </button>
    {/if}
  </div>
  
  <style>
    /* Optional styling for demo purposes */
  </style>
  