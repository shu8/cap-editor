import { createClient } from "redis";
const redis = createClient({ socket: { host: process.env.REDIS_HOST } });
redis.connect().catch((e) => console.error("Redis connection error", e));
redis.on("error", (e) => console.error("Redis client error", e));
export default redis;
