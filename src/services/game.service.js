const Game = require('../models/postgres/Game');

class GameService {
  async getAllGames(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await Game.findAll(limit, offset);
  }

  async getGameById(id) {
    const game = await Game.findById(id);
    if (!game) throw new Error('NOT_FOUND');
    return game;
  }

  async createGame(gameData) {
    return await Game.create(gameData);
  }

  async updateGame(id, updates) {
    const game = await Game.findById(id);
    if (!game) throw new Error('NOT_FOUND');
    return await Game.update(id, updates);
  }

  async deleteGame(id) {
    const game = await Game.findById(id);
    if (!game) throw new Error('NOT_FOUND');
    await Game.delete(id);
    return { message: 'Jeu supprimé' };
  }
}

module.exports = new GameService();