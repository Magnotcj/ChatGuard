import sql from "mssql"; 

const config = {
  user: "USER",
  password: "PASS",
  server: "490chatguard.csse.rose-hulman.edu",
  database: "490chatguard",
  options: {
    encrypt: true, // Needed for some Azure SQL connections
    trustServerCertificate: true,
  }
};

export async function getBoardMessages() {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .execute("getBoardMessages"); 
  return result.recordset;
}

export async function addPublicMessage(username, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("username", sql.VarChar(50), username)
    .input("text", sql.VarChar(50), content)
    .execute("createPublicPost"); 
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