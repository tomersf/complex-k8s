import express from "express";
import cors from "cors";
import redis from "redis";
import pg from "pg";

import keys from "./keys.js";

const app = express();

app.use(express.json());
app.use(cors());

const pgClient = new pg.Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
  ssl:
    process.env.NODE_ENV !== "production"
      ? false
      : { rejectUnauthorized: false },
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
  socket: {
    host: keys.redisHost,
    port: keys.redisPort,
    reconnectStrategy: 1000,
  },
});
const publisher = redisClient.duplicate();

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  const allVals = await publisher.hGetAll("values");
  console.log(allVals);
  res.send(allVals);
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  publisher.hSet("values", index, "Nothing yet!");
  publisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, async (err) => {
  await publisher.connect();
  console.log("listening...");
});
