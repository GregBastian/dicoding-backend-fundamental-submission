/* eslint-disable class-methods-use-this */
const ClientError = require('../../exceptions/ClientError');
const { failResponse, errorResponse } = require('../../utils/responses');

class ErrorHandler {
  errorHandler(request, h) {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof ClientError) {
      // kondisi ini digunakan untuk menangkap error yang sengaja di-throw
      return failResponse(h, response);
    } if (response instanceof Error) {
      // kondisi ini digunakan untuk menangkap error yang tidak terduga
      // alias yang tidak dibangkitkan secara manual via 'throw new'
      const { statusCode, payload } = response.output;
      switch (statusCode) {
        case 500:
          console.log(response);
          return errorResponse(h);
        default:
          return h.response(payload).code(statusCode);
      }
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
  }
}

module.exports = ErrorHandler;
