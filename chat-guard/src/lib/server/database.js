import sql from "mssql"; 

const config = {
  user: "your_db_user",
  password: "your_db_password",
  server: "your_server",
  database: "your_database",
  options: {
    encrypt: true, // Needed for some Azure SQL connections
    trustServerCertificate: true,
  }
};

async function getChatsForUser(userId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("UserId", sql.Int, userId)
    .execute("sp_GetChatsForUser"); 
  return result.recordset;
}

async function getMessages(chatId) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("ChatId", sql.Int, chatId)
    .execute("sp_GetMessages"); 
  return result.recordset;
}

async function addMessage(chatId, userId, content) {
  const pool = await sql.connect(config);
  await pool.request()
    .input("ChatId", sql.Int, chatId)
    .input("UserId", sql.Int, userId)
    .input("Content", sql.NVarChar, content)
    .execute("sp_AddMessage"); 
}

export default { getChatsForUser, getMessages, addMessage };
