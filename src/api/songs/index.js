const SongsHandler = require('./handler');
const ErrorHandler = require('./errorHandler');
const routes = require('./routes');

const songHandler = {
  name: 'openMusic API',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};

const errorHandlerPlugin = {
  name: 'Error Handler for openMusic API',
  version: '1.0.0',
  register: (server) => {
    const errorHandler = new ErrorHandler();
    server.ext('onPreResponse', errorHandler.errorHandler);
  },
};

module.exports = { songHandler, errorHandlerPlugin };
