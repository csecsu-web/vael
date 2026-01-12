const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));

db.pragma(`key = '${process.env.DB_KEY}'`);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_entry (
  date TEXT PRIMARY KEY,
  energy_direction TEXT NOT NULL,
  moment TEXT NOT NULL,
  pressure_source TEXT,
  body_state TEXT
);

CREATE TABLE IF NOT EXISTS weekly_reflection (
  week TEXT PRIMARY KEY,
  repeated TEXT,
  misaligned TEXT,
  stable TEXT,
  override TEXT,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS monthly_reflection (
  month TEXT PRIMARY KEY,
  patterns TEXT,
  draining TEXT,
  stabilizing TEXT,
  drifting TEXT,
  lesson TEXT
);

CREATE TABLE IF NOT EXISTS lifeos (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  refuse TEXT,
  allowed_bad TEXT,
  slow_down TEXT
);
`);
module.exports = db;
