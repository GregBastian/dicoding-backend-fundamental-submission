const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel4SingleSong } = require('../../utils/model/SongModel');
const SongModel = require('../../utils/model/SongModel');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(payload) {
    const newSong = new SongModel(payload);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: newSong.instanceToArray4NewEntry(newSong),
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu yang Anda cari tidak ditemukan');
    }

    return result.rows.map(mapDBToModel4SingleSong)[0];
  }

  async editSongById(id, payload) {
    const newSongData = SongModel.instance4ExistingEntry(id, payload);
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: newSongData.instanceToArray4ExistingEntry(),
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongIsExist(id) {
    const query = {
      text: 'SELECT COUNT(1) FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result) {
      throw new NotFoundError('Lagu yang Anda cari tidak ditemukan');
    }
  }
}

module.exports = SongsService;
