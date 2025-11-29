const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '..', 'data.sqlite');
console.log('📊 Using database:', dbPath);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Pins table
  db.run(`
    CREATE TABLE IF NOT EXISTS pins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('reservation', 'temporary', 'permanent')),
      reservation_id TEXT,
      starts_at INTEGER,
      ends_at INTEGER,
      label TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
  `);

  // Reservations table  
  db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      guest_name TEXT,
      guest_phone TEXT,
      guest_airbnb_thread_id TEXT,
      checkin_at INTEGER,
      checkout_at INTEGER,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
  `);

  console.log('✅ Database tables ready');
});

module.exports = db;
