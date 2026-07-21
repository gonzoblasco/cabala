import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cabala.db');
    await runMigrations(db);
  }
  return db;
}

async function runMigrations(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      photo_path TEXT NOT NULL,
      title TEXT,
      description TEXT,
      latitude REAL,
      longitude REAL,
      address TEXT,
      audio_path TEXT,
      is_incognito INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entry_tags (
      entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
      tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (entry_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS notification_config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      daily_count INTEGER NOT NULL DEFAULT 3,
      time_windows TEXT NOT NULL DEFAULT '["09:00-12:00","13:00-16:00","18:00-21:00"]',
      enabled INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      prompt_template TEXT,
      is_active INTEGER DEFAULT 0,
      started_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS challenge_entries (
      id TEXT PRIMARY KEY,
      challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
      entry_id TEXT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(challenge_id, day_number)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      photo_quality INTEGER NOT NULL DEFAULT 70,
      photo_max_width INTEGER NOT NULL DEFAULT 1080,
      theme TEXT NOT NULL DEFAULT 'system',
      language TEXT NOT NULL DEFAULT 'es',
      backup_enabled INTEGER DEFAULT 0,
      backup_provider TEXT,
      last_backup_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_entries_location ON entries(latitude, longitude);
    CREATE INDEX IF NOT EXISTS idx_entry_tags_entry ON entry_tags(entry_id);
    CREATE INDEX IF NOT EXISTS idx_entry_tags_tag ON entry_tags(tag_id);
  `);
}
