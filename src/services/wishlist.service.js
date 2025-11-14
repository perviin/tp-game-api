const { Wishlist } = require('../models/postgres/Order');
const Game = require('../models/postgres/Game');

class WishlistService {
  async addToWishlist(userId, gameId) {
    const game = await Game.findById(gameId);
    if (!game) {
      throw new Error('GAME_NOT_FOUND');
    }

    return await Wishlist.add(userId, gameId);
  }

  async getUserWishlist(userId) {
    return await Wishlist.findByUserId(userId);
  }

  async removeFromWishlist(userId, gameId) {
    return await Wishlist.remove(userId, gameId);
  }
}

module.exports = new WishlistService();