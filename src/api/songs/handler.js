const ClientError = require('../../exceptions/ClientError');
const { successResponse, failResponse, errorResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    // this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    // this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    this.truncateTableHandler = this.truncateTableHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const newSongId = await this._service.addSong(request.payload);

      return successResponse(h, {
        withMessage: true,
        responseMessage: 'Lagu berhasil ditambahkan',
        responseData: { songId: newSongId },
        responseCode: 201,
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      console.log(error);
      return errorResponse();
    }
  }

  async getSongsHandler(request, h) {
    const retrievedSongs = await this._service.getSongs();
    return successResponse(h, {
      responseData: { songs: retrievedSongs },
    });
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const retrievedSong = await this._service.getSongById(id);
      return successResponse(h, {
        responseData: { song: retrievedSong },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return failResponse(h, error);
      }

      console.log(error);
      return errorResponse();
    }
  }

  // async putSongByIdHandler(request, h) {
  //   try {
  //     this._validators.validateNotePayload(request.payload);
  //     const { id } = request.params;

  //     await this._service.editNoteById(id, request.payload);

  //     return {
  //       status: 'success',
  //       message: 'Catatan berhasil diperbarui',
  //     };
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message,
  //       });
  //       response.code(error.statusCode);
  //       return response;
  //     }

  //     // Server ERROR!
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Maaf, terjadi kegagalan pada server kami.',
  //     });
  //     response.code(500);
  //     console.error(error);
  //     return response;
  //   }
  // }

  // async deleteNoteByIdHandler(request, h) {
  //   try {
  //     const { id } = request.params;
  //     await this._service.deleteNoteById(id);

  //     return {
  //       status: 'success',
  //       message: 'Catatan berhasil dihapus',
  //     };
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message,
  //       });
  //       response.code(error.statusCode);
  //       return response;
  //     }

  //     // Server ERROR!
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Maaf, terjadi kegagalan pada server kami.',
  //     });
  //     response.code(500);
  //     console.error(error);
  //     return response;
  //   }
  // }
  async truncateTableHandler(request, h) {
    try {
      await this._service.truncateTable();
      return successResponse(h, { withMessage: true, responseMessage: 'Tabel berhasil di truncate' });
    } catch (error) {
      console.log(error);
      return errorResponse();
    }
  }
}

module.exports = SongsHandler;
