const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const PlaylistSongModel = require('../../utils/model/PlaylistSongModel');

class PlaylistSongsService {
  constructor(playlistsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
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
  }

  async getSongsFromPlaylistId(playlistId) {
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
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongsService;
