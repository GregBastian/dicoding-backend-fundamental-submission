const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'API to do CRUD operations on users',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new UsersHandler(service, validator);
    server.route(routes(songsHandler));
  },
};
