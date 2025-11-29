require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const webhookRoutes = require('./routes/webhooks');
const taskRoutes = require('./routes/tasks');

// Require DB early to initialize
require('./config/db');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static keypad
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/tasks', taskRoutes);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚪 Keypad server running on port ${PORT}`);
  console.log(`🔑 Admin PIN: ${process.env.ADMIN_PIN || '123456'}`);
  console.log('📱 Open in browser to test');
});
