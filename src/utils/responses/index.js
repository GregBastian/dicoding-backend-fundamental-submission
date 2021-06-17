const successResponse = ({ responseMessage = '', responseData = {}, withMessage = true }) => {
  if (withMessage) {
    return {
      status: 'success',
      message: responseMessage,
      data: responseData,
    };
  }
  return {
    status: 'success',
    data: responseData,
  };
};

const failResponse = ({ responseMessage = 'Terjadi kesalahan di sisi client' }) => ({
  status: 'fail',
  message: responseMessage,
});

const errorResponse = ({ responseMessage = 'Terjadi kesalahan di sisi server' }) => ({
  status: 'error',
  message: responseMessage,
});

module.exports = { successResponse, failResponse, errorResponse };
