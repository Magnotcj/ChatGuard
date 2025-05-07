import sql from "mssql";
import { validateSessionToken } from "../server/session"
import { fail, redirect } from '@sveltejs/kit';

const config = {
  user: "dickinje",
  password: "Natty#2024",
  server: "490chatguard.csse.rose-hulman.edu",
  database: "490chatguard",
  options: {
    encrypt: true, // Needed for some Azure SQL connections
    trustServerCertificate: true,
  }
};

async function validateToken(token) {
  const result = await validateSessionToken(token);
  if (result.session === null) {
    throw new Error('Failed to validate token.');
  }
  return result.user.id;
}

export async function deletePerson(sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .execute("DeletePersonByUsername"); 
    return result.recordset;
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function getMessageBoards(sessionToken) {
  try {
    await validateToken(sessionToken);
  } catch (error) {
    throw redirect(308, '/');
  }

  const pool = await sql.connect(config);
  const result = await pool.request()
    .execute("getMessageBoards"); 
  return result.recordset;
}

export async function getBoardMessages(boardId, sessionToken) {
  try {
    await validateToken(sessionToken);
  } catch (error) {
    throw redirect(308, '/');
  }

  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("messageboard_id", sql.Int, boardId)
    .execute("getBoardMessages"); 
  return result.recordset;
}

export async function getBoardHeader(boardId, sessionToken) {
  try {
    await validateToken(sessionToken);
  } catch (error) {
    throw redirect(308, '/');
  }

  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("messageboard_id", sql.Int, boardId)
    .execute("getBoardHeader");
  return result.recordset;
}

export async function addBoardMessage(boardId, content, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    console.log(username);
    const pool = await sql.connect(config);
    await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("messageboard_id", sql.Int, boardId)
      .input("text", sql.VarChar(255), content)
      .execute("createPublicPost"); 
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function addMessageBoard(content, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("text", sql.VarChar(255), content)
      .execute("createMessageBoard"); 
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function getChatsForUser(sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .execute("getChats"); 
    return result.recordset;
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function getChatMembers(chatId, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("chat_id", sql.Int, chatId)
      .execute("getChatMembers"); 

    let isMember = false;
    for (const member of result.recordset) {
      if (username === member.user_username) {
        isMember = true;
        break;
      }
    }
    if (!isMember) {
      throw new Error('User is not a member of this chat.');
    }

    return result.recordset;
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function getMessages(chatId, sessionToken) {
  try {
    await validateToken(sessionToken);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("chat_id", sql.Int, chatId)
      .execute("getMessages");
    return result.recordset;
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function addMessage(chatId, content, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    await pool.request()
      .input("chat_id", sql.Int, chatId)
      .input("username", sql.VarChar(50), username)
      .input("text", sql.VarChar(50), content)
      .execute("createChatPost"); 
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function createUser(username, password) {
  const pool = await sql.connect(config);
  const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("PasswordHash", sql.NVarChar, password)
      .execute("createUser");
    return result; // TODO: return if creation was successful
}

export async function getHashedPassword(username) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("Username", sql.VarChar(50), username)
    .execute("getPassHash");

  const hashedPassword = result.recordset[0]?.password; 
  
  return hashedPassword;
}

export async function createChat(members, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);

    const result = await pool.request()
        .execute("createChat");
    const chatId = result.returnValue;

    members.push(username);
    for (const member of members) {
      await pool.request()
        .input("username", sql.VarChar(50), member)
        .input("chat_id", sql.Int, chatId)
        .execute("addChatMember");
    }
    
    return chatId;
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function addChatMember(username, chatId, sessionToken) {
  try {
    await validateToken(sessionToken);
  } catch (error) {
    throw redirect(308, '/');
  }

  const pool = await sql.connect(config);
  const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("chat_id", sql.Int, chatId)
      .execute("createChat");
  return result.returnValue;
}

export async function addReport(msgId, reportText, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    const pool = await sql.connect(config);
    await pool.request()
        .input("reporter_username", sql.VarChar(50), username)
        .input("msg_id", sql.Int, msgId)
        .input("report_text", sql.VarChar(255), reportText)
        .execute("addReport");
  } catch (error) {
    throw redirect(308, '/');
  }
}

export async function addPersonToSubscription(subscriptionType, sessionToken) {
  try {
    const username = await validateToken(sessionToken);
    console.log('username: ', username);
    const pool = await sql.connect(config);
    await pool.request()
        .input("SubscriptionType", sql.Int, subscriptionType)
        .input("Username", sql.VarChar(50), username)
        .execute("AddPersonToSubscription");
  } catch (error) {
    throw redirect(308, '/');
  }
}