const crypto = require('crypto');
const { createPin, findValidPin, listPins, deletePin } = require('../models/Pin');
const { getTodaysCheckins } = require('../models/Reservation');

function generateRandomPin(length = 6) {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}

async function createReservationPin(reservation) {
  const code = generateRandomPin();
  const label = `Res ${reservation.id} - ${reservation.guest_name}`;
  
  return await createPin({
    code,
    type: 'reservation',
    reservation_id: reservation.id,
    starts_at: reservation.checkin_at,
    ends_at: reservation.checkout_at,
    label
  });
}

async function processMorningCheckins() {
  const checkins = await getTodaysCheckins();
  const pins = [];
  
  for (const res of checkins) {
    const pin = await createReservationPin(res);
    pins.push(pin);
  }
  
  return pins;
}

module.exports = {
  generateRandomPin,
  createReservationPin,
  findValidPin,
  listPins,
  deletePin,
  processMorningCheckins
};
