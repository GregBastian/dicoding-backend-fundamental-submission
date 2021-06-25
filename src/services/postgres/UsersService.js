const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const UserModel = require('../../utils/model/UserModel');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser(payload) {
    await this.verifyNewUsername(payload);
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const newUser = new UserModel(payload, hashedPassword);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: newUser.instanceToArray(),
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyNewUsername({ username }) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }
}

module.exports = UsersService;
