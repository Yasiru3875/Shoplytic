const Notification = require('../models/Notification');

// POST /notifications
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notification = await Notification.create({ userId, message, type });
    // In a real system this would call an email/SMS provider
    console.log(`[Notification] ${type.toUpperCase()} → User ${userId}: "${message}"`);
    res.status(201).json({ message: 'Notification sent', notification });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /notifications/user/:userId
exports.getByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ sentAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /notifications
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ sentAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
