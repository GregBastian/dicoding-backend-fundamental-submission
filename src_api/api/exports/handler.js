const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class ExportsHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistSongsHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { id: userId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      userId,
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(process.env.PLAYLIST_CHANNEL_NAME,
      JSON.stringify(message));

    return successResponse(h, {
      responseMessage: 'Permintaan Anda sedang kami proses',
      responseCode: 201,
    });
  }
}

module.exports = ExportsHandler;
