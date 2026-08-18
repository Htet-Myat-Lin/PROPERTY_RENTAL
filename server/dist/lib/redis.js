import { createClient } from "redis";
import IORedis from "ioredis";
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));
await client.connect();
// for bull queue
export const bullConnection = new IORedis({
    host: "localhost",
    port: 6379,
    maxRetriesPerRequest: null
});
// for caching
export { client as redisClient };
