// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// error
const errorHandler = require('./api/errors');

// truncate
const truncateHandler = require('./api/truncate');
const TruncateService = require('./services/postgres/TruncateService');

// songs
const songHandler = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const userHandler = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const truncateService = new TruncateService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  await server.register([
    {
      plugin: truncateHandler,
      options: {
        service: truncateService,
      },
    },
    {
      plugin: errorHandler,
    },
    {
      plugin: songHandler,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: userHandler,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
