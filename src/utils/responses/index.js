const successResponse = (h, {
  withMessage = false, responseMessage = '', responseData = {}, responseCode = 200,
}) => {
  const response = {
    status: 'success',
    data: responseData,
  };
  if (withMessage) {
    response.message = responseMessage;
  }
  return h.response(response).code(responseCode);
};

const failResponse = (h, error) => (
  h.response({
    status: 'fail',
    message: error.message,
  }).code(error.statusCode));

const errorResponse = (h) => (
  h.response({
    status: 'error',
    message: 'Terjadi kesalahan di sisi server',
  }).code(500));

module.exports = { successResponse, failResponse, errorResponse };
