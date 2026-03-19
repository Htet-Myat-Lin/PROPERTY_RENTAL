import { createClient } from "redis";

const client = createClient()

client.on("error", (err) => console.log("Redis Client Error", err))

client.on("connect", () => console.log("Redis Client Connected"))

await client.connect()

export { client as redisClient }