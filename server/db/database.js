const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'reflection.db');
const db = new Database(DB_PATH);

// Enable encryption (requires SQLCipher)
const ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY;
if (ENCRYPTION_KEY) {
  db.pragma(`key='${ENCRYPTION_KEY}'`);
}

function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Daily entries
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      energy_direction TEXT NOT NULL,
      moment TEXT NOT NULL,
      pressure_source TEXT,
      body_state TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    )
  `);

  // Weekly reflections
  db.exec(`
    CREATE TABLE IF NOT EXISTS weekly_reflections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_key TEXT NOT NULL,
      repeated TEXT,
      misaligned TEXT,
      stable TEXT,
      override TEXT,
      summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, week_key)
    )
  `);

  // Monthly reflections
  db.exec(`
    CREATE TABLE IF NOT EXISTS monthly_reflections (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      month_key TEXT NOT NULL,
      pattern TEXT,
      draining TEXT,
      stabilizing TEXT,
      direction TEXT,
      lesson TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, month_key)
    )
  `);

  // LifeOS
  db.exec(`
    CREATE TABLE IF NOT EXISTS lifeos (
      user_id TEXT PRIMARY KEY,
      refuse_1 TEXT,
      refuse_2 TEXT,
      refuse_3 TEXT,
      bad_at_1 TEXT,
      bad_at_2 TEXT,
      bad_at_3 TEXT,
      slow_down_1 TEXT,
      slow_down_2 TEXT,
      slow_down_3 TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized');
}

module.exports = {
  db,
  initDatabase
};
