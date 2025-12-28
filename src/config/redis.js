const { REDIS_URL } = require('./env');
const IORedis = require('ioredis');

const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
};

const redis = new IORedis(REDIS_URL, redisOptions);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', err => console.error('Redis error', err));

module.exports = redis;
