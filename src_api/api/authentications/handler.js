const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const { payload: requestPayload } = request;
    this._validator.validatePostAuthenticationPayload(requestPayload);
    const id = await this._usersService.verifyUserCredential(requestPayload);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);
    return successResponse(h, {
      responseMessage: 'Authentication berhasil ditambahkan',
      responseData: {
        accessToken,
        refreshToken,
      },
      responseCode: 201,
    });
  }

  async putAuthenticationHandler(request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload);
    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ id });

    return successResponse(h, {
      responseMessage: 'Authentication berhasil ditambahkan',
      responseData: {
        accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return successResponse(h, {
      responseMessage: 'Authentication berhasil diperbarui',
    });
  }
}

module.exports = AuthenticationsHandler;
