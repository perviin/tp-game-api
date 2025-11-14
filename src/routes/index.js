const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const gameRoutes = require('./game.routes');
const reviewRoutes = require('./review.routes');
// const orderRoutes = require('./order.routes');
// const wishlistRoutes = require('./wishlist.routes');
const userRoutes = require('./user.routes');

router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/users', userRoutes);

module.exports = router;