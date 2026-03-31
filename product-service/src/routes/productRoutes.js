const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (with optional filters)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200: { description: 'List of products' }
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: 'Product details' }
 *       404: { description: 'Product not found' }
 */
router.get('/:id', getProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name:        { type: string, example: "Wireless Headphones" }
 *               description: { type: string, example: "Noise cancelling over-ear" }
 *               price:       { type: number, example: 149.99 }
 *               stock:       { type: number, example: 50 }
 *               category:    { type: string, example: "Electronics" }
 *               imageUrl:    { type: string, example: "https://example.com/headphones.jpg" }
 *     responses:
 *       201: { description: 'Product created successfully' }
 *       400: { description: 'Validation error' }
 */
router.post('/', createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
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
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: number }
 *               category: { type: string }
 *     responses:
 *       200: { description: 'Product updated' }
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: 'Product deleted' }
 */
router.delete('/:id', deleteProduct);

module.exports = router;