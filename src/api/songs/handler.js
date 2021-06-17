const ClientError = require('../../exceptions/ClientError');
const { successResponse } = require('../../utils/responses');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    // this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    // this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    // this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    this.truncateTableHandler = this.truncateTableHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);

      const newSongId = await this._service.addSong(request.payload);

      const response = h.response(successResponse({
        responseMessage: 'Lagu berhasil ditambahkan',
        responseData: { songId: newSongId },
      }));
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongsHandler() {
    const retrievedSongs = await this._service.getSongs();
    return successResponse({
      responseData: { songs: retrievedSongs },
      responseWithMessage: false,
    });
  }

  // async getNoteByIdHandler(request, h) {
  //   try {
  //     const { id } = request.params;
  //     const note = await this._service.getNoteById(id);
  //     return {
  //       status: 'success',
  //       data: {
  //         note,
  //       },
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

  // async putNoteByIdHandler(request, h) {
  //   try {
  //     this._validator.validateNotePayload(request.payload);
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
      const response = h.response(successResponse({ responseMessage: 'Tabel berhasil di truncate' }));
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
