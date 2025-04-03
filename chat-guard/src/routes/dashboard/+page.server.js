import { getChatsForUser, deletePerson } from "$lib/server/database"; // Your database.js file
import { fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
  const userId = cookies.get("session_id") || ""; // Get user ID from authentication/session
  const chats = await getChatsForUser(userId); // Calls stored procedure
  
  return { chats };
}

export const actions = {
  delete: async ({ request, cookies }) => {
		const userid = cookies.get("session_id");
	  try {
		await deletePerson(userid);
		return { success: true };
	  } catch (error) {
		console.error('Database error:', error);
		return fail(500, { error: 'Failed to create account.' });
	  }
	}
	

  };