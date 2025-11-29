const express = require('express');
const router = express.Router();
const { findValidPin } = require('../services/pinService');
const { unlockDoor } = require('../services/sesameService');

router.post('/check-pin', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || code.length < 4) {
      return res.status(400).json({ ok: false, error: 'Invalid PIN format' });
    }

    const ADMIN_PIN = process.env.ADMIN_PIN;
    if (code === ADMIN_PIN) {
      return res.json({ ok: true, mode: 'admin' });
    }

    const pin = await findValidPin(code);
    if (!pin) {
      return res.status(401).json({ ok: false, error: 'Invalid or expired PIN' });
    }

    await unlockDoor(`PIN ${code} - ${pin.label}`);
    res.json({ ok: true, mode: 'guest', message: 'Door unlocked!' });
    
  } catch (e) {
    console.error('PIN check error:', e);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

module.exports = router;
