import { DatabaseSync } from "node:sqlite";

/** FAITH keeps only its own state here: sign-in secrets (hashed), sessions,
 *  paired screens, API tokens, conversations and an action log. Family data
 *  stays in the apps that own it (wiki, ALLGlance, Home Assistant, Mealie...). */
export type Db = DatabaseSync;

export function openDb(file: string): Db {
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS person_auth (
      person_id TEXT PRIMARY KEY, pin_hash TEXT, password_hash TEXT,
      failures INTEGER NOT NULL DEFAULT 0, locked_until INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS passkeys (
      id TEXT PRIMARY KEY, person_id TEXT NOT NULL, public_key BLOB NOT NULL, counter INTEGER NOT NULL,
      transports TEXT, label TEXT, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY, person_id TEXT NOT NULL, challenge TEXT NOT NULL, kind TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL, last_seen INTEGER);
    CREATE TABLE IF NOT EXISTS pair_codes (
      code_hash TEXT PRIMARY KEY, device_id TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, person_id TEXT NOT NULL, device_id TEXT, kind TEXT NOT NULL,
      created_at INTEGER NOT NULL, last_activity INTEGER NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS api_tokens (
      name TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, kind TEXT NOT NULL, person_id TEXT,
      created_at INTEGER NOT NULL, last_used INTEGER);
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY, owner_key TEXT NOT NULL, person_id TEXT, channel TEXT NOT NULL, ext_id TEXT,
      created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS conversations_owner ON conversations(owner_key, updated_at);
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT, conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      role TEXT NOT NULL, content TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS pending (
      id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, owner_key TEXT NOT NULL, tool TEXT NOT NULL, args TEXT NOT NULL,
      summary TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'waiting', created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER NOT NULL, who TEXT NOT NULL, channel TEXT NOT NULL,
      tool TEXT NOT NULL, summary TEXT NOT NULL, ok INTEGER NOT NULL);
  `);
  return db;
}
