// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const { songHandler, errorHandlerPlugin } = require('./api/songs');
const CrudService = require('./services/postgres/crudService');
const SongsValidator = require('./validator/songs');

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

  const crudService = new CrudService();
  await server.register({
    plugin: songHandler,
    options: {
      service: crudService,
      validator: SongsValidator,
    },
  });

  await server.register({
    plugin: errorHandlerPlugin,
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
