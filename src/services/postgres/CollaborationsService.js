const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const CollaborationModel = require('../../utils/model/CollaborationModel');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(payload) {
    const newCollaboration = new CollaborationModel(payload);
    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) returning id',
      values: newCollaboration.instanceToArray(),
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan sebagai collaborator');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaborator gagal dihapus');
    }
  }
}

module.exports = CollaborationsService;
