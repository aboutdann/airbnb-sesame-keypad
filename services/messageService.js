require('dotenv').config();
const twilio = require('twilio');
const { sendAirbnbMessage } = require('./igmsService');

const provider = process.env.MESSAGING_PROVIDER;
let twilioClient = null;

if (provider === 'twilio') {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID, 
    process.env.TWILIO_AUTH_TOKEN
  );
}

async function sendSms(to, text, keypadUrl) {
  if (!twilioClient) {
    console.log('⚠️ Twilio not configured - SMS skipped');
    return false;
  }

  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_FROM_NUMBER,
      to,
      body: `${text}\nKeypad: ${keypadUrl}`
    });
    console.log('📱 SMS sent');
    return true;
  } catch (e) {
    console.error('SMS error:', e.message);
    return false;
  }
}

async function notifyGuest(reservation, pin, keypadUrl) {
  const message = `Hello ${reservation.guest_name || 'Guest'}, 
your door PIN is ${pin.code}. 
Valid ${new Date(pin.starts_at).toLocaleDateString()} - ${new Date(pin.ends_at).toLocaleDateString()}.
Use at: ${keypadUrl}`;

  if (reservation.guest_airbnb_thread_id) {
    await sendAirbnbMessage(reservation.guest_airbnb_thread_id, message);
  }
  
  if (reservation.guest_phone) {
    await sendSms(reservation.guest_phone, message, keypadUrl);
  }
}

module.exports = { sendSms, notifyGuest };
