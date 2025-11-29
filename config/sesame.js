require('dotenv').config();

module.exports = {
  apiKey: process.env.SESAME_API_KEY,
  deviceUuid: process.env.SESAME_DEVICE_UUID,
  secretKeyHex: process.env.SESAME_SECRET_KEY
};
