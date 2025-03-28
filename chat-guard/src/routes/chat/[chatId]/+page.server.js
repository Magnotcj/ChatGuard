import { fail } from '@sveltejs/kit';
import { getMessages, addMessage, getChatMembers } from "$lib/server/database";

export async function load({ params }) {
  const chatId = params.chatId;
  const messages = await getMessages(chatId); // Calls stored procedure
  const membersDb = await getChatMembers(chatId);
  let members = [];
  for (let i = 0; i < membersDb.length; i++) {
    members.push(membersDb[i].user_username);
  }
  
  return { chatId, messages, members };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
    const formData = new URLSearchParams(await request.text());
    const message = formData.get('message');
    const username = cookies.get('session_id') || "";
    const chatId = url.pathname.split('/').pop();

    // Validate required fields
    if (!message) {
      return fail(400, { error: 'Cannot post empty message.' });
    }
    if (!username) {
      return fail(400, { error: 'User is not logged in.' });
    }
    if (!chatId) {
      return fail(400, { error: 'Chat ID was not saved.' });
    }

    try {
      await addMessage(chatId, username, message);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message.' });
    }
  }
}