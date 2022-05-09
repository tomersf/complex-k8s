const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // attempt to automatically reconnect to the redis server if losing connection after every 1 sec.
})
const sub = redisClient.duplicate(); // create a subscription

function fib (index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel,message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
})
sub.subscribe('insert');