const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order lifecycle management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     responses:
 *       200: { description: List of all orders }
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, items]
 *             properties:
 *               userId: { type: string, example: "64abc123" }
 *               shippingAddress: { type: string, example: "123 Main St, Colombo" }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string, example: "64def456" }
 *                     quantity:  { type: integer, example: 2 }
 *                     price:     { type: number, example: 75000 }
 *     responses:
 *       201: { description: Order created }
 */
router.get('/', ctrl.getAllOrders);
router.post('/', ctrl.createOrder);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Orders list }
 */
router.get('/user/:userId', ctrl.getOrdersByUser);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order found }
 *       404: { description: Order not found }
 *
 * /orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [pending, confirmed, shipped, delivered, cancelled] }
 *     responses:
 *       200: { description: Status updated }
 */
router.get('/:id', ctrl.getOrder);
router.put('/:id/status', ctrl.updateStatus);

module.exports = router;
