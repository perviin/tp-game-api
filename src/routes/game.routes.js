const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate, schemas } = require('../middlewares/validator.middleware');

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Liste tous les jeux
 *     tags: [Games]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des jeux
 */
router.get('/', gameController.getAllGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Détails d'un jeu
 *     tags: [Games]
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Créer un jeu (admin)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, requireAdmin, validate(schemas.createGame), gameController.createGame);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Modifier un jeu (admin)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, requireAdmin, gameController.updateGame);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Supprimer un jeu (admin)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, requireAdmin, gameController.deleteGame);

module.exports = router;