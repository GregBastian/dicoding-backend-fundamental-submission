const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: `SELECT playlists.id
             FROM playlists
             INNER JOIN users ON playlists.owner = users.id  
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE (playlists.owner = $1 OR collaborations.user_id = $1) AND 
             playlists.id = $2`,
      values: [userId, playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new AuthorizationError('Anda bukan pemilik/collaborator playlist ini');
    }
  }

  async getPlaylistName(playlistId) {
    const query = {
      text: 'SELECT name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new InvariantError('Gagal mengambil nama playlist');
    }

    return result.rows[0].name;
  }
}

module.exports = PlaylistService;
