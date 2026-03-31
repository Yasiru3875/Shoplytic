const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId:  { type: String, required: true },
    message: { type: String, required: true },
    type:    { type: String, enum: ['email', 'sms', 'push'], default: 'email' },
    read:    { type: Boolean, default: false },
    sentAt:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
