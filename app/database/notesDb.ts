import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("notes_v2.db");

export async function initDb() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT,
      deleted INTEGER DEFAULT 0
    );
  `);
}

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  deleted: number;
}

export async function getNotes(): Promise<Note[]> {
  return (await db.getAllAsync(
    "SELECT * FROM notes WHERE deleted = 0 ORDER BY id DESC"
  )) as Note[];
}
export async function getDeletedNotes(): Promise<Note[]> {
  return (await db.getAllAsync("SELECT * FROM notes WHERE deleted = 1 ORDER BY id DESC")) as Note[];
}

export async function deleteNote(id: number) {
  await db.runAsync("UPDATE notes SET deleted = 1 WHERE id = ?", [id]); // đưa vào thùng rác
}

export async function addNote(title: string, content: string) {
  const date = new Date().toLocaleDateString();
  await db.runAsync("INSERT INTO notes (title, content, date) VALUES (?, ?, ?)", [
    title,
    content,
    date,
  ]);
}

export async function updateNote(id: number, title: string, content: string) {
  await db.runAsync("UPDATE notes SET title = ?, content = ? WHERE id = ?", [
    title,
    content,
    id,
  ]);
}

export async function searchNotes(keyword: string): Promise<Note[]> {
  return (await db.getAllAsync(
    "SELECT * FROM notes WHERE deleted = 0 AND (title LIKE ? OR content LIKE ?) ORDER BY id DESC",
    [`%${keyword}%`, `%${keyword}%`]
  )) as Note[];
}

export async function searchDeletedNotes(keyword: string): Promise<Note[]> {
  return (await db.getAllAsync(
    "SELECT * FROM notes WHERE deleted = 1 AND (title LIKE ? OR content LIKE ?) ORDER BY id DESC",
    [`%${keyword}%`, `%${keyword}%`]
  )) as Note[];
}
export async function restoreNote(id: number) {
  await db.runAsync("UPDATE notes SET deleted = 0 WHERE id = ?", [id]);
}

