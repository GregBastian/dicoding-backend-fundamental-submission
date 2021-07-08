const redis = require('redis');

const EXPIRATION_IN_SECONDS = parseInt(process.env.EXPIRATION_IN_SECONDS, 10);

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this._client.on('error', (error) => {
      console.log(error);
    });
  }

  async set(key, value) {
    try {
      await this.redisSet(key, value);
      return true;
    } catch (error) {
      return null;
    }
  }

  async get(key) {
    try {
      const result = await this.redisGet(key);
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    try {
      await this.redisDelete(key);
      return true;
    } catch (error) {
      return null;
    }
  }

  redisSet(key, value, expirationInSeconds = EXPIRATION_IN_SECONDS) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSeconds, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok);
      });
    });
  }

  redisGet(key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }

        if (reply === null) {
          return reject(new Error('cache tidak ditemukan'));
        }

        return resolve(reply.toString());
      });
    });
  }

  redisDelete(key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        return resolve(count);
      });
    });
  }
}

module.exports = CacheService;
