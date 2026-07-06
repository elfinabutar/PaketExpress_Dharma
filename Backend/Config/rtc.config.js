// RTC Configuration
const config = {
  ice: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  signalingServer: process.env.SIGNALING_SERVER || 'http://localhost:3000',
};

module.exports = config;
