const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel4SingleSong: MapDBToModel4singleSong } = require('../../utils/model');
const SongModel = require('../../utils/model');

class CrudService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong(payload) {
    const newSong = new SongModel(payload);
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: newSong.instanceToArray(newSong),
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(SongModel.mapDBToModel4AllSongs);
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

    return result.rows.map(MapDBToModel4singleSong)[0];
  }

  //   async editNoteById(id, { title, body, tags }) {
  //     const updatedAt = new Date().toISOString();
  //     const query = {
  //       text: 'UPDATE notes SET title = $1, body = $2,
  //   tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
  //       values: [title, body, tags, updatedAt, id],
  //     };

  //     const result = await this._pool.query(query);

  //     if (!result.rows.length) {
  //       throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
  //     }
  //   }

  //   async deleteNoteById(id) {
  //     const query = {
  //       text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
  //       values: [id],
  //     };

  //     const result = await this._pool.query(query);

  //     if (!result.rows.length) {
  //       throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
  //     }
  //   }

  async truncateTable() {
    try {
      await this._pool.query('TRUNCATE TABLE songs');
    } catch (error) {
      throw new Error('Terdapat kesalahan pada sistem');
    }
  }
}

module.exports = CrudService;