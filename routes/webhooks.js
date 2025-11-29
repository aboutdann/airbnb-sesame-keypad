const express = require('express');
const router = express.Router();
const { createReservation } = require('../models/Reservation');

router.post('/igms', async (req, res) => {
  try {
    console.log('🌐 iGMS webhook:', req.body);
    
    // Parse iGMS webhook payload (adjust based on actual format)
    const reservation = {
      id: req.body.reservation_id || req.body.booking_id,
      guest_name: req.body.guest_name || req.body.guest?.name,
      guest_phone: req.body.guest_phone,
      guest_airbnb_thread_id: req.body.thread_id || req.body.airbnb_thread_id,
      checkin_at: new Date(req.body.checkin_date).getTime(),
      checkout_at: new Date(req.body.checkout_date).getTime()
    };

    if (reservation.id) {
      await createReservation(reservation);
      console.log('💾 Reservation saved:', reservation.id);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
