const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments
 *     responses:
 *       200: { description: List of payments }
 *   post:
 *     tags: [Payments]
 *     summary: Process a payment for an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, userId, amount, method]
 *             properties:
 *               orderId: { type: string, example: "64abc123" }
 *               userId:  { type: string, example: "64def456" }
 *               amount:  { type: number, example: 150000 }
 *               method:  { type: string, enum: [card, cash, online], example: "card" }
 *     responses:
 *       201: { description: Payment processed }
 *       409: { description: Payment already completed }
 */
router.get('/', ctrl.getAllPayments);
router.post('/', ctrl.processPayment);

/**
 * @swagger
 * /payments/{orderId}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by order ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment found }
 *       404: { description: Payment not found }
 *
 * /payments/{id}/refund:
 *   put:
 *     tags: [Payments]
 *     summary: Refund a payment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment refunded }
 */
router.get('/:orderId', ctrl.getPaymentByOrder);
router.put('/:id/refund', ctrl.refundPayment);

module.exports = router;
