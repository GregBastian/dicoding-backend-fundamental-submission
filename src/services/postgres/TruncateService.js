const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class TruncateService {
  constructor() {
    this._pool = new Pool();
  }

  async truncateTables(apiKey) {
    if (apiKey === process.env.TRUNCATE_KEY) {
      await this._pool.query('TRUNCATE TABLE songs');
      await this._pool.query('TRUNCATE TABLE authentications');
      await this._pool.query('TRUNCATE TABLE users CASCADE');
      await this._pool.query('TRUNCATE TABLE playlists');
    } else {
      throw new AuthorizationError('API Key not valid!');
    }
  }
}

module.exports = TruncateService;
