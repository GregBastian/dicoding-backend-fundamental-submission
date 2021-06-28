const Joi = require('joi');

const PostCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  PostCollaborationPayloadSchema,
};
