import { fail, redirect } from '@sveltejs/kit';
import { addMessageBoard, getMessageBoards } from "$lib/server/database";

export async function load({ params, cookies }) {
  const sessionId = cookies.get('session_id') || "";

  const boards = await getMessageBoards(sessionId); 
  return { boards };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
    const sessionId = cookies.get('session_id') || "";

    const formData = new URLSearchParams(await request.text());
    const message = formData.get('message');
    const username = cookies.get('session_id') || "";

    // Validate required fields
    if (!message) {
      return fail(400, { error: 'Cannot post empty message.' });
    }
    if (!username) {
      return fail(400, { error: 'User is not logged in.' });
    }
    
    try {
      await addMessageBoard(message, sessionId);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message board.' });
    }
  }
}