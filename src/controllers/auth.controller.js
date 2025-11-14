const authService = require('../services/auth.service');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    try {
      const result = await authService.register(email, password, username);
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Inscription réussie',
        data: result
      });
    } catch (err) {
      if (err.message === 'USER_EXISTS') {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: ERROR_MESSAGES.USER_EXISTS
        });
      }
      throw err;
    }
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await authService.login(email, password);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Connexion réussie',
        data: result
      });
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS
        });
      }
      throw err;
    }
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Refresh token manquant'
      });
    }
    try {
      const result = await authService.refresh(refreshToken);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result
      });
    } catch (err) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.TOKEN_INVALID
      });
    }
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Déconnexion réussie'
    });
  });
}

module.exports = new AuthController();