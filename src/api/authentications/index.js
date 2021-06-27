const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'API to get access and refresh tokens (JWT)',
  version: '1.0.0',
  register: async (server, {
    authenticationService,
    usersService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationService,
      usersService,
      tokenManager,
      validator,
    );

    server.route(routes(authenticationsHandler));
  },
};
