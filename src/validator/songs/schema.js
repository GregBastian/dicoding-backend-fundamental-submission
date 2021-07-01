const Joi = require('joi');

// Constants from .env
const MIN_YEAR = parseInt(process.env.MIN_YEAR, 10);
const MAX_YEAR = +new Date().getFullYear();

const postSongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(MIN_YEAR).max(MAX_YEAR).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

const putSongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(MIN_YEAR).max(MAX_YEAR).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.number(),
});

module.exports = { postSongPayloadSchema, putSongPayloadSchema };
