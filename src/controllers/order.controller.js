const orderService = require('../services/order.service');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class OrderController {
  getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: orders });
  });

  createOrder = asyncHandler(async (req, res) => {
    const { gameId } = req.body;
    const userId = req.user.id;

    try {
      const order = await orderService.createOrder(userId, gameId);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Jeu acheté',
        data: order
      });
    } catch (err) {
      if (err.message === 'GAME_NOT_FOUND') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Jeu introuvable'
        });
      }
      if (err.message === 'ALREADY_OWNED') {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: 'Vous possédez déjà ce jeu'
        });
      }
      throw err;
    }
  });
}

module.exports = new OrderController();