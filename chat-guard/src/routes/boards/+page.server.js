import { fail } from '@sveltejs/kit';
import { addMessageBoard, getMessageBoards } from "$lib/server/database";

export async function load({ params }) {
  const boards = await getMessageBoards(); 
  return { boards };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
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
      await addMessageBoard(username, message);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message board.' });
    }
  }
}