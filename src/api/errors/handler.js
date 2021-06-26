/* eslint-disable class-methods-use-this */
const ClientError = require('../../exceptions/ClientError');
const { failResponse, errorResponse } = require('../../utils/responses');

class ErrorHandler {
  errorHandler(request, h) {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      return failResponse(h, response);
    } if (response instanceof Error) {
      const { statusCode, payload } = response.output;
      if (statusCode === 404) {
        return h.response(payload).code(404);
      }
      console.log(response);
      return errorResponse(h);
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  }
}

module.exports = ErrorHandler;
