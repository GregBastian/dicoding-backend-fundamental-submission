const routes = (handler) => [
  {
    method: 'DELETE',
    path: '/special/truncate',
    handler: handler.truncateAllTablesHandler,
  },
];

module.exports = routes;
