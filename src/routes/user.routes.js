const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middlewares/auth.middleware');
const User = require('../models/postgres/User');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Voir son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Voir un profil (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json({ success: true, data: user });
});

module.exports = router;