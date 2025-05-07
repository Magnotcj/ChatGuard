import sql from "mssql"; 
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

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

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const pool = await sql.connect(config);
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await pool.request()
		.input("id", sql.VarChar(255), session.id)
		.input("username", sql.VarChar(50), session.userId)
		.input("expires", sql.DateTime, session.expiresAt)
		.execute("CreateSession");
	// db.execute(
	// 	"INSERT INTO user_session (id, user_id, expires_at) VALUES (?, ?, ?)",
	// 	session.id,
	// 	session.userId,
	// 	session.expiresAt
	// );
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const pool = await sql.connect(config);
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const results = await pool.request()
		.input("id", sql.VarChar(255), sessionId)
		.execute("GetSessionById");
	const sessionVals = results.recordset[0];
	// const row = await db.queryOne(
	// 	"SELECT user_session.id, user_session.user_id, user_session.expires_at, user.id FROM user_session INNER JOIN user ON user.id = user_session.user_id WHERE id = ?",
	// 	sessionId
	// );
	if (sessionVals === undefined) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: sessionVals.id,
		userId: sessionVals.username,
		expiresAt: sessionVals.expires_at
	};
	const user: User = {
		id: sessionVals.username
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidateSession(session.id);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		// await db.execute(
		// 	"UPDATE user_session SET expires_at = ? WHERE id = ?",
		// 	session.expiresAt,
		// 	session.id
		// );
		await pool.request()
			.input("id", sql.VarChar(255), session.id)
			.input("new_expires", sql.DateTime, session.expiresAt)
			.execute("UpdateSessionById");
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	const pool = await sql.connect(config);
	await pool.request()
		.input("id", sql.VarChar(255), sessionId)
		.execute("DeleteSessionBySessionId");
	// await db.execute("DELETE FROM user_session WHERE id = ?", sessionId);
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	const pool = await sql.connect(config);
	await pool.request()
		.input("Username", sql.VarChar(50), userId)
		.execute("DeleteSessionByUsername");
	// await db.execute("DELETE FROM user_session WHERE user_id = ?", userId);
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

export interface User {
	id: number;
}