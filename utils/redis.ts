import redis from 'redis';

const { REDIS_HOST, REDIS_PORT: REDIS_PORT_STR, REDIS_PASSWORD } = process.env;

const REDIS_PORT = parseInt(REDIS_PORT_STR, 10);

export const getRedisClient = () =>
  redis.createClient(REDIS_PORT, REDIS_HOST, {
    password: REDIS_PASSWORD,
    tls: true,
  });
