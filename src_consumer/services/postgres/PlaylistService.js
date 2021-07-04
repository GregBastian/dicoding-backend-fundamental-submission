const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getPlaylistName(playlistId) {
    const resultCache = await this._cacheService.get(`playlistName-consumer:${playlistId}`);
    if (resultCache) {
      return resultCache;
    }
    const query = {
      text: 'SELECT name FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new InvariantError('Gagal mengambil nama playlist');
    }

    await this._cacheService.set(`playlistName-consumer:${playlistId}`, JSON.stringify(result));
    return result.rows[0].name;
  }
}

module.exports = PlaylistService;
