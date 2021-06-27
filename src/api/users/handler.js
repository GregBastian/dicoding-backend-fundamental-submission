const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const newUserId = await this._service.addUser(request.payload);
    return successResponse(h, {
      responseMessage: 'User berhasil ditambahkan',
      responseData: { userId: newUserId },
      responseCode: 201,
    });
  }
}

module.exports = UsersHandler;
