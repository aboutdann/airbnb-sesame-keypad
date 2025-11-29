const express = require('express');
const router = express.Router();
const { listPins, createPin, deletePin, generateRandomPin } = require('../services/pinService');
const { sendSms } = require('../services/messageService');

const ADMIN_PIN = process.env.ADMIN_PIN;

function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_PIN) {
    return res.status(401).json({ ok: false, error: 'Admin access required' });
  }
  next();
}

router.use(requireAdmin);

router.get('/pins', async (req, res) => {
  try {
    const pins = await listPins();
    res.json({ ok: true, pins });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/pins', async (req, res) => {
  try {
    let { code, type, starts_at, ends_at, label, phone } = req.body;
    
    if (!code) {
      code = generateRandomPin();
    }
    
    const pin = await createPin({
      code,
      type: type || 'temporary',
      starts_at: starts_at ? parseInt(starts_at) : null,
      ends_at: ends_at ? parseInt(ends_at) : null,
      label: label || `Manual ${type || 'temp'}`
    });

    if (phone) {
      const url = process.env.KEPAD_URL || 'https://your-keypad-url.com';
      const msg = `Access granted! PIN: ${code}\nUse at: ${url}`;
      await sendSms(phone, msg, url);
    }

    res.json({ ok: true, pin });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

router.delete('/pins/:id', async (req, res) => {
  try {
    const success = await deletePin(req.params.id);
    res.json({ ok: success });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
