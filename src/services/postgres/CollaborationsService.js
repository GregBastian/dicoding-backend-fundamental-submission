const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
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

  async verifyPlaylistCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT COUNT(1) FROM songs WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda bukan collaborator playlist ini');
    }
  }
}

module.exports = CollaborationsService;
