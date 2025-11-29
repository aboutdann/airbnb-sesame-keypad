const express = require('express');
const router = express.Router();
const { processMorningCheckins } = require('../services/pinService');
const { notifyGuest } = require('../services/messageService');

router.post('/morning-messages', async (req, res) => {
  try {
    console.log('🌅 Processing morning check-ins...');
    const pins = await processMorningCheckins();
    
    const keypadUrl = process.env.KEPAD_URL || 'https://your-keypad-url.com';
    
    // TODO: Send notifications for each pin
    // await notifyGuest(reservation, pin, keypadUrl);
    
    console.log(`✅ Created ${pins.length} pins for today`);
    res.json({ ok: true, count: pins.length, pins });
  } catch (e) {
    console.error('Morning task error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
