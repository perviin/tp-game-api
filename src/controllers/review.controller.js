const Review = require('../models/postgres/Review');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class ReviewController {
  getReviewsByGame = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const result = await Review.findByGameId(gameId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  });

  createReview = asyncHandler(async (req, res) => {
    const { gameId, rating, comment } = req.body;
    const userId = req.user.id;

    const exists = await Review.existsForUser(userId, gameId);
    if (exists) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'Vous avez déjà noté ce jeu'
      });
    }

    const review = await Review.create(userId, gameId, rating, comment);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Avis créé',
      data: review
    });
  });

  deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Avis introuvable'
      });
    }

    if (review.user_id !== userId && userRole !== 'ADMIN') {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    await Review.delete(id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Avis supprimé'
    });
  });
}

module.exports = new ReviewController();