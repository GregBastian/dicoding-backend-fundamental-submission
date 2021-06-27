const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class PlaylistsHandler {
  constructor(playlistService, validator) {
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({ name, owner });

    return successResponse(h, {
      responseMessage: 'Playlist berhasil ditambahkan',
      responseData: {
        playlistId,
      },
      responseCode: 201,
    });
  }

  async getPlaylistsByOwnerIdHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const playlistsByOwnerId = await this._playlistService.getPlaylistsByOwnerId({ ownerId });

    return successResponse(h, {
      responseData: { playlists: playlistsByOwnerId },
    });
  }
}

module.exports = PlaylistsHandler;
