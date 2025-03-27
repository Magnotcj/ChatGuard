import { getMessages } from "$lib/server/database";

export async function load({ params }) {
  const chatId = params.chatId;
  const messages = await getMessages(chatId); // Calls stored procedure

  console.log(messages);
  
  return { chatId, messages };
}
