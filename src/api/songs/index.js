const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'openMusic API',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};
