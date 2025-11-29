const db = require('../config/db');

async function createReservation(reservation) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO reservations 
       (id, guest_name, guest_phone, guest_airbnb_thread_id, checkin_at, checkout_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reservation.id,
        reservation.guest_name,
        reservation.guest_phone || null,
        reservation.guest_airbnb_thread_id || null,
        reservation.checkin_at,
        reservation.checkout_at
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID || reservation.id, ...reservation });
      }
    );
  });
}

async function getTodaysCheckins() {
  return new Promise((resolve, reject) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayStart = now.getTime();
    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;

    db.all(
      `SELECT * FROM reservations 
       WHERE checkin_at >= ? AND checkin_at < ?`,
      [todayStart, tomorrowStart],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

module.exports = { createReservation, getTodaysCheckins };
