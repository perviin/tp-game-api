const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const Joi = require('joi');
const { validate } = require('../middlewares/validator.middleware');

const createReviewSchema = Joi.object({
  gameId: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('')
});

/**
 * @swagger
 * /api/reviews/game/{gameId}:
 *   get:
 *     summary: Avis sur un jeu
 *     tags: [Reviews]
 */
router.get('/game/:gameId', reviewController.getReviewsByGame);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Créer un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, validate(createReviewSchema), reviewController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, reviewController.deleteReview);

module.exports = router;