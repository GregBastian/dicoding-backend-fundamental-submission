const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
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

  async deletePlaylistByOwnerId({ playlistId, ownerId }) {
    await this.verifyPlaylistOwner(playlistId, ownerId);

    const query = {
      text: 'DELETE FROM playlists WHERE owner = $1 RETURNING id',
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Playlist gagal dihapus. Anda bukan pemilik playlist ini');
    }
  }
}

module.exports = PlaylistServices;
