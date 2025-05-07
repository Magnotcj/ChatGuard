import { fail } from '@sveltejs/kit';
import { getMessages, addMessage, getChatMembers, addReport } from "$lib/server/database";
import { validateSessionToken } from "../../../lib/server/session"

export async function load({ params, cookies }) {
  const sessionId = cookies.get('session_id') || "";
  
  const chatId = params.chatId;
  const membersDb = await getChatMembers(chatId, sessionId);
  const messages = await getMessages(chatId, sessionId); // Calls stored procedure
  let members = [];
  for (let i = 0; i < membersDb.length; i++) {
    members.push(membersDb[i].user_username);
  }
  
  return { chatId, messages, members };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
    const sessionId = cookies.get('session_id') || "";

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
      await addMessage(chatId, message, sessionId);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message.' });
    }
  },
  submitReport: async ({ request, cookies }) => {
    const sessionId = cookies.get('session_id') || "";

    const formData = new URLSearchParams(await request.text());
    const msgId = formData.get('msgId');
    const reportText = formData.get('reportText');
    const username = cookies.get('session_id') || "";
    
    try {
      await addReport(msgId, reportText, sessionId);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add report.' });
    }
  }
}