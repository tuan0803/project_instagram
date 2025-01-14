import Redis from 'ioredis';
import bluebird from 'bluebird';

class AsyncRedisClient extends Redis {
  public readonly keysAsync = bluebird.promisify(this.keys).bind(this);
  public readonly getAsync = bluebird.promisify(this.get).bind(this);
  public readonly mgetAsync = bluebird.promisify(this.mget).bind(this);
  public readonly setAsync = bluebird.promisify(this.set).bind(this);
  public readonly delAsync = bluebird.promisify(this.del).bind(this);
  public readonly rpushAsync = bluebird.promisify(this.rpush).bind(this);
  public readonly lrangeAsync = bluebird.promisify(this.lrange).bind(this);
  public readonly lremAsync = bluebird.promisify(this.lrem).bind(this);
}

export default new AsyncRedisClient(process.env.REDIS_URI, { maxRetriesPerRequest: null, enableReadyCheck: false });
