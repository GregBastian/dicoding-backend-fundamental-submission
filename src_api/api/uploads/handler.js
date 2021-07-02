const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);

    const pictureUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`;

    return successResponse(h, {
      responseData: {
        pictureUrl,
      },
      responseCode: 201,
    });
  }
}

module.exports = UploadsHandler;
