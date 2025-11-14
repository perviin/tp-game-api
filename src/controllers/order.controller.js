const { Order } = require('../models/postgres/Order');
const Game = require('../models/postgres/Game');
const ActivityLog = require('../models/mongo/ActivityLog');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class OrderController {
  getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orders = await Order.findByUserId(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: orders });
  });

  createOrder = asyncHandler(async (req, res) => {
    const { gameId } = req.body;
    const userId = req.user.id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Jeu introuvable'
      });
    }

    const alreadyOwned = await Order.userOwnsGame(userId, gameId);
    if (alreadyOwned) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'Vous possédez déjà ce jeu'
      });
    }

    const order = await Order.create(userId, gameId, game.price);

    await ActivityLog.create({
      userId,
      action: 'GAME_PURCHASE',
      details: { gameId, gameTitle: game.title, pricePaid: game.price }
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Jeu acheté',
      data: order
    });
  });
}

module.exports = new OrderController();