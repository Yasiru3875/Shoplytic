const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications
 *     responses:
 *       200: { description: List of all notifications }
 *   post:
 *     tags: [Notifications]
 *     summary: Send a notification to a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, message, type]
 *             properties:
 *               userId:  { type: string, example: "64abc123" }
 *               message: { type: string, example: "Your order #123 has been shipped!" }
 *               type:    { type: string, enum: [email, sms, push], example: "email" }
 *     responses:
 *       201: { description: Notification sent }
 */
router.get('/', ctrl.getAll);
router.post('/', ctrl.sendNotification);

/**
 * @swagger
 * /notifications/user/{userId}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notifications list }
 */
router.get('/user/:userId', ctrl.getByUser);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Marked as read }
 *
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification deleted }
 */
router.put('/:id/read', ctrl.markAsRead);
router.delete('/:id', ctrl.deleteNotification);

module.exports = router;
