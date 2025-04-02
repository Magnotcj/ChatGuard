import sql from "mssql"; 

const config = {
  user: "",
  password: "",
  server: "490chatguard.csse.rose-hulman.edu",
  database: "490chatguard",
  options: {
    encrypt: true, // Needed for some Azure SQL connections
    trustServerCertificate: true,
  }
};

export async function getMessageBoards() {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .execute("getMessageBoards"); 
  return result.recordset;
}

export async function getBoardMessages(boardId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("messageboard_id", sql.Int, boardId)
    .execute("getBoardMessages"); 
  return result.recordset;
}

export async function getBoardHeader(boardId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("messageboard_id", sql.Int, boardId)
    .execute("getBoardHeader");
  return result.recordset;
}

export async function addBoardMessage(boardId, username, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("username", sql.VarChar(50), username)
    .input("messageboard_id", sql.Int, boardId)
    .input("text", sql.VarChar(255), content)
    .execute("createPublicPost"); 
}

export async function addMessageBoard(username, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("username", sql.VarChar(50), username)
    .input("text", sql.VarChar(255), content)
    .execute("createMessageBoard"); 
}

export async function getChatsForUser(username) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("username", sql.VarChar(50), username)
    .execute("getChats"); 
  return result.recordset;
}

export async function getChatMembers(chatId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("chat_id", sql.Int, chatId)
    .execute("getChatMembers"); 
  return result.recordset;
}

export async function getMessages(chatId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("chat_id", sql.Int, chatId)
    .execute("getMessages"); 
  return result.recordset;
}

export async function addMessage(chatId, username, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("chat_id", sql.Int, chatId)
    .input("username", sql.VarChar(50), username)
    .input("text", sql.VarChar(50), content)
    .execute("createChatPost"); 
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

export async function createChat(members) {
  const pool = await sql.connect(config);
  const result = await pool.request()
      .execute("createChat");
  const chatId = result.returnValue;

  for (const member of members) {
    await pool.request()
      .input("username", sql.VarChar(50), member)
      .input("chat_id", sql.Int, chatId)
      .execute("addChatMember");
  }
  
  return chatId;
}

export async function addChatMember(username, chatId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("chat_id", sql.Int, chatId)
      .execute("createChat");
  return result.returnValue;
}

export async function addReport(username, msgId, reportText) {
  const pool = await sql.connect(config);
  const result = await pool.request()
      .input("reporter_username", sql.VarChar(50), username)
      .input("msg_id", sql.Int, msgId)
      .input("report_text", sql.VarChar(255), reportText)
      .execute("addReport");
}