import { fail } from '@sveltejs/kit';
import { getBoardMessages, getBoardHeader, addBoardMessage, addReport } from "$lib/server/database";

export async function load({ params }) {
  const boardId = params.boardId;
  const messages = await getBoardMessages(boardId); // Calls stored procedure
  const headerMsg = await getBoardHeader(boardId)
  
  return { boardId, messages, headerMsg };
}

export const actions = {
  postMessage: async ({ request, cookies, url }) => {
    const formData = new URLSearchParams(await request.text());
    const message = formData.get('message');
    const username = cookies.get('session_id') || "";
    const boardId = url.pathname.split('/').pop();

    // Validate required fields
    if (!message) {
      return fail(400, { error: 'Cannot post empty message.' });
    }
    if (!username) {
      return fail(400, { error: 'User is not logged in.' });
    }
    if (!boardId) {
      return fail(400, { error: 'Board ID was not saved.' });
    }

    try {
      await addBoardMessage(boardId, username, message);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message.' });
    }
  },
  submitReport: async ({ request, cookies }) => {
    const formData = new URLSearchParams(await request.text());
    const msgId = formData.get('msgId');
    const reportText = formData.get('reportText');
    const username = cookies.get('session_id') || "";
    
    try {
      await addReport(username, msgId, reportText);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add report.' });
    }
  }
}