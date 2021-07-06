const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const PlaylistSongModel = require('../../utils/model/PlaylistSongModel');

class PlaylistSongsService {
  constructor(playlistsService, cacheService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
    this._cacheService = cacheService;
  }

  async addSongToPlaylist(payload) {
    const { playlistId, userId, songId } = payload;
    await this._playlistsService.verifyPlaylistIsExist(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const newPlaylistSong = new PlaylistSongModel({ playlistId, userId, songId });
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: newPlaylistSong.instanceToArray(),
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    this._cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async getSongsFromPlaylistId(playlistId, userId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const resultCache = await this._cacheService.get(`playlistSongs:${playlistId}`);
    if (resultCache) {
      return resultCache;
    }
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM playlists
      INNER JOIN playlistsongs ON playlistsongs.playlist_id = playlists.id
      INNER JOIN songs ON songs.id = playlistsongs.song_id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows) {
      throw new InvariantError('Gagal mengambil lagu-lagu dari playlist');
    }

    await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(result.rows));
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId, userId) {
    await this._playlistsService.verifyPlaylistIsExist(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }

    this._cacheService.delete(`playlistSongs:${userId}`);
  }
}

module.exports = PlaylistSongsService;
