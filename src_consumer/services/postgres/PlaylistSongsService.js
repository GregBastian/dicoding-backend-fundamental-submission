const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getSongsFromPlaylistId(playlistId) {
    const resultCache = await this._cacheService.get(`playlistSongs-consumer:${playlistId}`);
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

    await this._cacheService.set(`playlistSongs-consumer:${playlistId}`, JSON.stringify(result));
    return result.rows;
  }
}

module.exports = PlaylistSongsService;
