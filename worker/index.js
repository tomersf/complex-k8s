import redis from "redis";
import keys from "./keys.js";

(async () => {
  const client = redis.createClient({
    socket: {
      host: keys.redisHost,
      port: keys.redisPort,
      reconnectStrategy: 1000,
    },
  });
  const subscriber = client.duplicate();
  const publisher = client.duplicate();

  await subscriber.connect();
  await publisher.connect();

  await subscriber.subscribe("insert", (message) => {
    publisher.hSet("values", message, slowFib(parseInt(message)));
  });
})();

function slowFib(index) {
  if (index < 2) return 1;
  return slowFib(index - 1) + slowFib(index - 2);
}
