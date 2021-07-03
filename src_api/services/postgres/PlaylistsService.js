const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const PlaylistModel = require('../../utils/model/PlaylistModel');

class PlaylistsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    this._cacheService.delete(`playlists:${newPlaylist.getOwner()}`);
    return result.rows[0].id;
  }

  async getPlaylistsByUserId({ userId }) {
    const resultCache = await this._cacheService.get(`playlists:${userId}`);
    if (resultCache) {
      return resultCache;
    }

    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             INNER JOIN users ON playlists.owner = users.id  
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [userId],
    };
    const result = await this._pool.query(query);

    await this._cacheService.set(`playlists:${userId}`, JSON.stringify(result));
    return result.rows;
  }

  async deletePlaylistByPlaylistId({ playlistId, userId }) {
    await this.verifyPlaylistOwnerAccess(playlistId, userId);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }

    this._cacheService.delete(`playlists:${userId}`);
  }

  async verifyPlaylistOwnerAccess(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Gagal melakukan operasi. Anda bukan pemilik playlist ini');
    }
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

  async verifyPlaylistIsExist(playlistId) {
    const query = {
      text: 'SELECT COUNT(1) FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new NotFoundError('Playlist yang dicari tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
