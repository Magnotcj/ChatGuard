import { fail } from '@sveltejs/kit';
import { getBoardMessages, getBoardHeader, addBoardMessage, addReport } from "$lib/server/database";

export async function load({ params, cookies }) {
  const sessionId = cookies.get('session_id') || "";

  const boardId = params.boardId;
  const messages = await getBoardMessages(boardId, sessionId); // Calls stored procedure
  const headerMsg = await getBoardHeader(boardId, sessionId)
  
  return { boardId, messages, headerMsg };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
    const sessionId = cookies.get('session_id') || "";

    const formData = new URLSearchParams(await request.text());
    const message = formData.get('message');
    const boardId = url.pathname.split('/').pop();

    // Validate required fields
    if (!message) {
      return fail(400, { error: 'Cannot post empty message.' });
    }
    if (!boardId) {
      return fail(400, { error: 'Board ID was not saved.' });
    }

    try {
      await addBoardMessage(boardId, message, sessionId);
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
    
    try {
      await addReport(msgId, reportText, sessionId);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add report.' });
    }
  }
}