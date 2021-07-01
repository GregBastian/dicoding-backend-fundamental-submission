const autoBind = require('auto-bind');
const { successResponse } = require('../../utils/responses');

class TruncateHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async truncateAllTablesHandler(request, h) {
    const apiKey = request.headers['x-api-key'];
    await this._service.truncateTables(apiKey);
    return successResponse(h, {
      responseMessage: 'Tabel-tabel berhasil di truncate',
    });
  }

  async emptyFolder(request, h) {
    return null;
  }
}

module.exports = TruncateHandler;
