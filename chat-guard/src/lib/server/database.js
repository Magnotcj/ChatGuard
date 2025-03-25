import sql from "mssql"; 
import bcrypt from "bcrypt";

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

async function createUser(username, password) {
  bcrypt.hash(password, 10).then(async function(hash) {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("Username", sql.NVarchar, username)
      .input("PasswordHash", sql.NVarChar, hash)
      .execute("sp_CreateUser");
    return result; // TODO: return if creation was successful
  });
}

async function login(username, password) {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input("Username", sql.NVarchar, username)
    .input("PasswordHash", sql.NVarChar, hash)
    .execute("sp_CreateUser");
  const hash = result.resultSet; // TODO: find how to get hash value
  
  bcrypt.compare(password, hash).then(function(result)) {
    return result;
  }
}

export default { getChatsForUser, getMessages, addMessage, createUser, login };
