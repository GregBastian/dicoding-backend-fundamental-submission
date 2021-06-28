const { Pool } = require('pg');
// const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');
const PlaylistSongModel = require('../../utils/model/PlaylistSongModel');

class PlaylistSongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(payload) {
    const newPlaylistSong = new PlaylistSongModel(payload);
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
}

module.exports = PlaylistSongServices;
