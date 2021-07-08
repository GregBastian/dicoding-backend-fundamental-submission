const InvariantError = require('../../exceptions/InvariantError');
const { postSongPayloadSchema, putSongPayloadSchema } = require('./schema');

const SongsValidator = {
  validatePostSongPayload: (payload) => {
    const validationResult = postSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutSongPayload: (payload) => {
    const validationResult = putSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
