const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/songs/{id}',
  //   handler: handler.getSongByIdHandler,
  // },
  // {
  //   method: 'PUT',
  //   path: '/songs/{id}',
  //   handler: handler.putSongByIdHandler,
  // },
  // {
  //   method: 'DELETE',
  //   path: '/songs/{id}',
  //   handler: handler.deleteSongByIdHandler,
  // },
  {
    method: 'PUT',
    path: '/special/truncate',
    handler: handler.truncateTableHandler,
  },
];

module.exports = routes;
