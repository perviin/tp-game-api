const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Liste ses commandes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, orderController.getUserOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Acheter un jeu
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, orderController.createOrder);

module.exports = router;