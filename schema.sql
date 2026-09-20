-- contacts テーブルの定義
-- 新しい環境でDBを作るには:
--   sqlite3 contacts.db < schema.sql

CREATE TABLE IF NOT EXISTS contacts (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT NOT NULL,
    email TEXT,
    phone TEXT
);
