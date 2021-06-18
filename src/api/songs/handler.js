const ClientError = require('../../exceptions/ClientError');
const { successResponse, failResponse, errorResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    this.truncateTableHandler = this.truncateTableHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const newSongId = await this._service.addSong(request.payload);

      return successResponse(h, {
        withMessage: true,
        withData: true,
        responseMessage: 'Lagu berhasil ditambahkan',
        responseData: { songId: newSongId },
        responseCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      console.log(error);
      return errorResponse(h);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const retrievedSongs = await this._service.getSongs();
      return successResponse(h, {
        withData: true,
        responseData: { songs: retrievedSongs },
      });
    } catch (error) {
      console.log(error);
      return errorResponse(h);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const retrievedSong = await this._service.getSongById(id);
      return successResponse(h, {
        withData: true,
        responseData: { song: retrievedSong },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      console.log(error);
      return errorResponse(h);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;

      await this._service.editSongById(id, request.payload);

      return successResponse(h, {
        withMessage: true,
        responseMessage: 'lagu berhasil diperbarui',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      console.log(error);
      return errorResponse(h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return successResponse(h, {
        withMessage: true,
        responseMessage: 'lagu berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      // Server ERROR!
      return errorResponse(h);
    }
  }

  async truncateTableHandler(request, h) {
    try {
      await this._service.truncateTable();
      return successResponse(h, {
        withMessage: true,
        responseMessage: 'Tabel berhasil di truncate',
      });
    } catch (error) {
      console.log(error);
      return errorResponse();
    }
  }
}

module.exports = SongsHandler;
