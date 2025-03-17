import db from "$lib/server/database"; // Your database.js file

export async function load({ locals }) {
  const userId = locals.user?.id || 1; // Get user ID from authentication/session
  const chats = await db.getChatsForUser(userId); // Calls stored procedure
  
  return { chats };
}
