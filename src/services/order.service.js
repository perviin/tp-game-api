const { Order } = require('../models/postgres/Order');
const Game = require('../models/postgres/Game');
const ActivityLog = require('../models/mongo/ActivityLog');

class OrderService {
  async createOrder(userId, gameId) {
    // vérif jeu existe
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error('GAME_NOT_FOUND');
    }

    // vérif user n'a pas le jeu
    const alreadyOwned = await Order.userOwnsGame(userId, gameId);
    if (alreadyOwned) {
      throw new Error('ALREADY_OWNED');
    }

    // créer commande
    const order = await Order.create(userId, gameId, game.price);

    // log activité
    await ActivityLog.create({
      userId,
      action: 'GAME_PURCHASE',
      details: { gameId, gameTitle: game.title, pricePaid: game.price }
    });

    return order;
  }

  async getUserOrders(userId) {
    return await Order.findByUserId(userId);
  }
}

module.exports = new OrderService();