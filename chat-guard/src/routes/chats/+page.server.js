import { fail, redirect } from '@sveltejs/kit';
import { getChatsForUser, createChat } from "$lib/server/database"; // Your database.js file

export async function load({ cookies }) {
  const sessionId = cookies.get('session_id') || "";

  const chatsDb = await getChatsForUser(sessionId); // Calls stored procedure

  let chats = [];
  for (let i = 0; i < chatsDb.length;) {
    let currId = chatsDb[i].id;
    let currUsers = [];
    while (i < chatsDb.length && currId == chatsDb[i].id) {
      currUsers.push(chatsDb[i].user);
      i++;
    }
    chats.push({
      id: currId,
      users: currUsers
    });
  }
  
  return { chats };
}

export const actions = {
  createChat: async ({ request, cookies, url }) => {
    const sessionId = cookies.get('session_id') || "";

    const formData = new URLSearchParams(await request.text());
    const memberStr = formData.get('members') || "";
    const members = memberStr.split(' ').join('').split(',');
    const username = cookies.get('session_id') || "";

    // Validate required fields
    if (!username) {
      return fail(400, { error: 'User is not logged in.' });
    }
    
    members.push(username);

    let chatId;
    try {
      chatId = await createChat(members, sessionId);
    } catch (error) {
      console.error('Database error:', error);
      return fail(500, { error: 'Failed to add message.' });
    }

    if (chatId != null) {
      throw redirect(303, '/chat/' + chatId); 
    }
  }
}