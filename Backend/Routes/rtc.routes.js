// RTC Routes
const express = require('express');
const router = express.Router();

// Get STUN servers configuration
router.get('/config', (req, res) => {
  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
  };
  res.json(config);
});

// Get active rooms
router.get('/rooms', (req, res) => {
  // This would typically come from your RTC manager
  res.json({ rooms: [] });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'RTC Server Running', timestamp: new Date() });
});

module.exports = router;
