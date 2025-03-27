import { getChatsForUser } from "$lib/server/database"; // Your database.js file

export async function load({ cookies }) {
  const userId = cookies.get("session_id") || ""; // Get user ID from authentication/session
  const chats = await getChatsForUser(userId); // Calls stored procedure
  
  return { chats };
}