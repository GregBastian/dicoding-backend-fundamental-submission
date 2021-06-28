const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'API to do CRUD operations on playlist',
  version: '1.0.0',
  register: async (server, {
    playlistsService, playlistSongsService, songsService, validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService, playlistSongsService, songsService, validator,
    );
    server.route(routes(playlistsHandler));
  },
};
