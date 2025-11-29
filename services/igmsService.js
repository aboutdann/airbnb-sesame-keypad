require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const IGMS_API_KEY = process.env.IGMS_API_KEY;
const IGMS_BASE = 'https://api.igms.com/v1';

async function sendAirbnbMessage(threadId, message) {
  if (!IGMS_API_KEY) {
    console.log('⚠️ iGMS API key missing - skipping message');
    return false;
  }

  try {
    const url = `${IGMS_BASE}/messages`;
    const body = {
      thread_id: threadId,
      body: message
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': IGMS_API_KEY
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error(`iGMS message failed: ${res.status} ${txt}`);
      return false;
    }
    
    console.log('📨 Airbnb message sent');
    return true;
  } catch (e) {
    console.error('iGMS send error:', e.message);
    return false;
  }
}

module.exports = { sendAirbnbMessage };
