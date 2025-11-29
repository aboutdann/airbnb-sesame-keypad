const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const sesameConfig = require('../config/sesame');

async function createSignature(history) {
  const key = Buffer.from(sesameConfig.secretKeyHex, 'hex');
  const msg = Buffer.from(history);
  const c = crypto.createCipheriv('aes-128-ecb', key, null);
  c.setAutoPadding(true);
  const enc = Buffer.concat([c.update(msg), c.final()]);
  return enc.toString('hex');
}

async function unlockDoor(historyNote = 'Web Keypad') {
  if (!sesameConfig.apiKey || !sesameConfig.deviceUuid) {
    throw new Error('Sesame config missing - check .env');
  }

  const history = historyNote;
  const sign = await createSignature(history);

  const url = `https://app.candyhouse.co/api/sesame2/${sesameConfig.deviceUuid}/cmd`;
  const body = {
    cmd: 82,  // Unlock command
    history,
    sign
  };

  console.log('🔓 Unlocking Sesame:', historyNote);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': sesameConfig.apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sesame unlock failed: ${res.status} ${text}`);
  }

  return await res.json();
}

module.exports = { unlockDoor };
