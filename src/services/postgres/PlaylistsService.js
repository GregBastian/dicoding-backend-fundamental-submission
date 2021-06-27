const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const PlaylistModel = require('../../utils/model/PlaylistModel');

class PlaylistServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(payload) {
    const newPlaylist = new PlaylistModel(payload);
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: newPlaylist.instanceToArray(),
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistsByOwnerId({ ownerId }) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             INNER JOIN users
             ON users.id = playlists.owner 
             WHERE users.id = $1
             `,
      values: [ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistServices;
