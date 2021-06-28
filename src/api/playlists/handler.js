const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner });

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
    const playlistsByOwnerId = await this._playlistsService.getPlaylistsByOwnerId({ ownerId });

    return successResponse(h, {
      responseData: { playlists: playlistsByOwnerId },
    });
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await this._playlistsService.deletePlaylistByOwnerId({ playlistId, ownerId });

    return successResponse(h, {
      responseMessage: 'Playlist berhasil dihapus',
    });
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);

    const { id: ownerId } = request.auth.credentials;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this._songsService.verifySongIsExist(songId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await this._playlistsService.verifyPlaylistIsExist(playlistId);

    await this._playlistSongsService.addSongToPlaylist({ playlistId, songId });

    return successResponse(h, {
      responseMessage: 'Lagu berhasil ditambahkan ke playlist',
      responseCode: 201,
    });
  }

  async getSongsFromPlaylistHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    const songsFromPlaylist = await this._playlistSongsService.getSongsFromPlaylistId(playlistId);

    return successResponse(h, {
      responseData: {
        songs: songsFromPlaylist,
      },
    });
  }
}

module.exports = PlaylistsHandler;
