import type { ResultSetHeader } from 'mssql';

// Define types for your data models
export interface Chat {
  chatId: number;
  chatName: string;
  // Add more fields if applicable
}

export interface Message {
  messageId: number;
  chatId: number;
  username: string,
  content: string;
  timestamp: string; // or Date if you're converting it from SQL
}

declare module '$lib/server/database.js' {
  export function deletePerson(
    username: string,
  ): Promise<Chat[]>;

  /**
   * Retrieves chats for a specific user.
   */
  export function getChatsForUser(
    username: string,
  ): Promise<Chat[]>;

  /**
   * Retrieves messages for a specific chat.
   */
  export function getMessages(
    chatId: number
  ): Promise<Message[]>;

  export function getBoardMessages(
  ): Promise<Message[]>;

  /**
   * Adds a new message to a chat.
   */
  export function addMessage(
    chatId: number,
    username: string,
    content: string
  ): Promise<ResultSetHeader>;

  export function addPublicMessage(
    username: string,
    content: string
  ): Promise<ResultSetHeader>;

  /**
   * Creates a user by hashing their password and storing it.
   */
  export function createUser(
    username: string,
    password: string
  ): Promise<ResultSetHeader>;

  /**
   * Logs in a user by verifying their hashed password.
   */
  export function getHashedPassword(
    username: string
  ): Promise<boolean>;

}
