/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
          type: 'VARCHAR(10)',
          primaryKey: true,
        },
        title: {
          type: 'TEXT',
          notNull: true,
        },
        year: {
          type: 'TEXT',
          notNull: true,
        },
        performer: {
          type: 'TEXT',
          notNull: true,
        },
        genre: {
          type: 'TEXT',
        },
        duration: {
          type: 'TEXT',
        },
        created_at: {
          type: 'TEXT',
          notNull: true,
        },
        updated_at: {
          type: 'TEXT',
          notNull: true,
        },
      });
};

exports.down = pgm => {
    pgm.dropTable('songs');
};
