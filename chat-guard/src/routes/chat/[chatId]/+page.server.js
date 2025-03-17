import db from "$lib/server/database";

export async function load({ params }) {
  const chatId = params.chatId;
  const messages = await db.getMessages(chatId); // Calls stored procedure
  
  return { chatId, messages };
}
