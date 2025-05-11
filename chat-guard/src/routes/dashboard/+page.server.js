import { getChatsForUser, deletePerson } from "$lib/server/database"; // Your database.js file
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { validateToken } from "$lib/server/database";

export async function load({ cookies }) {
  const sessionId = cookies.get("session_id") || ""; // Get user ID from authentication/session

  try {
	  await validateToken(sessionId);
	} catch (error) {
	  throw redirect(308, '/');
	}
}

export const actions = {
  delete: async ({ request, cookies }) => {
		const sessionId = cookies.get("session_id");
	  try {
		await deletePerson(sessionId);
		// return { success: true };
	  } catch (error) {
		console.error('Database error:', error);
		return fail(500, { error: 'Failed to create account.' });
	  }
	  throw redirect(303, '/');
	},

	logout: async ({ cookies }) => {
		cookies.set('session_id', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
		  
		  });
		  redirect(303, '/')
	}
	

  };