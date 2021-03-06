const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validatePostSongPayload(request.payload);

    const newSongId = await this._service.addSong(request.payload);

    return successResponse(h, {
      responseMessage: 'Lagu berhasil ditambahkan',
      responseData: { songId: newSongId },
      responseCode: 201,
    });
  }

  async getSongsHandler(request, h) {
    const retrievedSongs = await this._service.getSongs();
    return successResponse(h, {
      responseData: { songs: retrievedSongs },
    });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const retrievedSong = await this._service.getSongById(id);
    return successResponse(h, {
      responseData: { song: retrievedSong },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validatePutSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return successResponse(h, {
      responseMessage: 'lagu berhasil diperbarui',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return successResponse(h, {
      responseMessage: 'lagu berhasil dihapus',
    });
  }
}

module.exports = SongsHandler;
