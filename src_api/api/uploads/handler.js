const autoBind = require('auto-bind');
const path = require('path');
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

  // eslint-disable-next-line class-methods-use-this
  async getUploadImageHandler(request, h) {
    const { filename } = request.params;
    const filepath = path.resolve(__dirname, '../../uploads/file/pictures', filename);
    return h.file(filepath);
  }
}

module.exports = UploadsHandler;
