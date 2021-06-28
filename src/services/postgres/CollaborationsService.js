const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const CollaborationModel = require('../../utils/model/CollaborationModel');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(payload) {
    const newCollaboration = new CollaborationModel(payload);
    console.log(newCollaboration.instanceToArray(), '<-----');
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
}

module.exports = CollaborationsService;
