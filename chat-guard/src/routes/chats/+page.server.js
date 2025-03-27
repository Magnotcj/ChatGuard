import { getChatsForUser } from "$lib/server/database"; // Your database.js file

export async function load({ cookies }) {
  const userId = cookies.get("session_id") || ""; // Get user ID from authentication/session
  const chatsDb = await getChatsForUser(userId); // Calls stored procedure

  let chats = [];
  for (let i = 0; i < chatsDb.length; i++) {
    let currId = chatsDb[i].id;
    console.log(currId);
    let currUsers = [];
    while (i < chatsDb.length && currId == chatsDb[i].id) {
      currUsers.push(chatsDb[i].user);
      i++;
    }
    console.log(currUsers);
    chats.push({
      id: currId,
      users: currUsers
    });
  }
  
  return { chats };
}
