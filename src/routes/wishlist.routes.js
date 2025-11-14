const express = require('express');
const router = express.Router();
// const wishlistController = require('../controllers/wishlist.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Voir sa wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, wishlistController.getUserWishlist);

/**
 * @swagger
 * /api/wishlist/{gameId}:
 *   post:
 *     summary: Ajouter à la wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:gameId', authenticateToken, wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlist/{gameId}:
 *   delete:
 *     summary: Retirer de la wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:gameId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router;