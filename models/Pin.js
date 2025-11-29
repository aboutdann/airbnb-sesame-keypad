const db = require('../config/db');

async function createPin(pin) {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    db.run(
      `INSERT INTO pins (code, type, reservation_id, starts_at, ends_at, label, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pin.code,
        pin.type,
        pin.reservation_id || null,
        pin.starts_at || null,
        pin.ends_at || null,
        pin.label || null,
        now
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, ...pin, created_at: now });
      }
    );
  });
}

async function findValidPin(code, atTime) {
  return new Promise((resolve, reject) => {
    const now = atTime || Date.now();
    db.get(
      `SELECT * FROM pins WHERE code = ?`,
      [code],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);

        // Permanent pins always valid
        if (row.type === 'permanent') return resolve(row);

        // Check time windows
        if (row.starts_at && now < row.starts_at) return resolve(null);
        if (row.ends_at && now > row.ends_at) return resolve(null);

        resolve(row);
      }
    );
  });
}

async function listPins() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM pins ORDER BY created_at DESC LIMIT 50`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function deletePin(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM pins WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = { createPin, findValidPin, listPins, deletePin };
