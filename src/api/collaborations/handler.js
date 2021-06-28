const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);

    const { id: ownerId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistsService.verifyPlaylistOwnerAccess(playlistId, ownerId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      { playlistId, userId },
    );

    return successResponse(h, {
      responseMessage: 'Kolaborasi berhasil ditambahkan',
      responseData: {
        collaborationId,
      },
      responseCode: 201,
    });
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validatePostCollaborationPayload(request.payload);

    const { id: ownerId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;
    await this._playlistsService.verifyPlaylistOwnerAccess(playlistId, ownerId);
    await this._collaborationsService.deleteCollaboration({ playlistId, userId });

    return successResponse(h, {
      responseMessage: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;
