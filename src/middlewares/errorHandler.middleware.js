const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  if (err.code === '23505') {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      message: 'Cette ressource existe déjà'
    });
  }

  res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? ERROR_MESSAGES.INTERNAL 
      : err.message
  });
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = { errorHandler, asyncHandler }; 