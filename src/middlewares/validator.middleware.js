const Joi = require('joi');
const { HTTP_STATUS } = require('../config/constants');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    username: Joi.string().min(3).max(50).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  createGame: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().min(0).required(),
    publisher: Joi.string(),
    releaseDate: Joi.date()
  })
};

module.exports = { validate, schemas };