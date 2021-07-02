const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/gif', 'image/avif', 'image/jpeg', 'image/svg+xml', 'image/png', 'image/webp').required(),
}).unknown();

module.exports = { ImageHeadersSchema };
