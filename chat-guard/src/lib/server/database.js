import sql from "mssql"; 

const config = {
  user: "un",
  password: "pw",
  server: "490chatguard.csse.rose-hulman.edu",
  database: "490chatguard",
  options: {
    encrypt: true, // Needed for some Azure SQL connections
    trustServerCertificate: true,
  }
};

async function getChatsForUser(username) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("username", sql.VarChar(50), username)
    .execute("getChats"); 
  return result.recordset;
}

async function getMessages(chatId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("ChatId", sql.Int, chatId)
    .execute("getMessages"); 
  return result.recordset;
}

async function addMessage(chatId, username, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("ChatId", sql.Int, chatId)
    .input("username", sql.VarChar(50), username)
    .input("Content", sql.NVarChar, content)
    .execute("createChatPost"); 
}

async function createUser(username, password) {
  const pool = await sql.connect(config);
  const result = await pool.request()
      .input("username", sql.VarChar(50), username)
      .input("PasswordHash", sql.NVarChar, password)
      .execute("createUser");
    return result; // TODO: return if creation was successful
}

async function getHashedPassword(username) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("Username", sql.NVarchar(50), username)
    .execute("getPassHash");

  const hashedPassword = result.recordset[0]?.password; 
  
  return hashedPassword;
}

export default { getChatsForUser, getMessages, addMessage, createUser, getHashedPassword };
