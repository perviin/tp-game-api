const gameService = require('../services/game.service');
const { HTTP_STATUS } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class GameController {
  getAllGames = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await gameService.getAllGames(page, limit);
    res.status(HTTP_STATUS.OK).json({ success: true, data: result });
  });

  getGameById = asyncHandler(async (req, res) => {
    try {
      const game = await gameService.getGameById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ success: true, data: game });
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Jeu introuvable'
        });
      }
      throw err;
    }
  });

  createGame = asyncHandler(async (req, res) => {
    const game = await gameService.createGame(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Jeu créé',
      data: game
    });
  });

  updateGame = asyncHandler(async (req, res) => {
    try {
      const game = await gameService.updateGame(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Jeu mis à jour',
        data: game
      });
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Jeu introuvable'
        });
      }
      throw err;
    }
  });

  deleteGame = asyncHandler(async (req, res) => {
    try {
      await gameService.deleteGame(req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Jeu supprimé'
      });
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Jeu introuvable'
        });
      }
      throw err;
    }
  });
}

module.exports = new GameController();