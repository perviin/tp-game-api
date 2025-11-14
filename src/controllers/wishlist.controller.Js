const wishlistService = require('../services/wishlist.service');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class WishlistController {
  getUserWishlist = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const wishlist = await wishlistService.getUserWishlist(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: wishlist });
  });

  addToWishlist = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user.id;

    try {
      const item = await wishlistService.addToWishlist(userId, parseInt(gameId));
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Ajouté à la wishlist',
        data: item
      });
    } catch (err) {
      if (err.message === 'GAME_NOT_FOUND') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Jeu introuvable'
        });
      }
      throw err;
    }
  });

  removeFromWishlist = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user.id;

    await wishlistService.removeFromWishlist(userId, parseInt(gameId));
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Retiré de la wishlist'
    });
  });
}

module.exports = new WishlistController();