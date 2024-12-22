const Redis = require('ioredis');

// Creating a Redis Client
const redis = new Redis({
  host: '127.0.0.1', 
  port: 6379,        
  password: '',      // If have a password, enter it here
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;
