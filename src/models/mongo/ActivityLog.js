const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  action: { 
    type: String, 
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'REGISTER', 'GAME_VIEW', 'GAME_PURCHASE']
  },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);