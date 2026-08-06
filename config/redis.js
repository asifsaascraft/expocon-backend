import { createClient } from "redis";

console.log("REDIS_URL =", process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("connect", () => {
  console.log("Redis connected.");
});

redisClient.on("error", (error) => {
  console.error("Redis Error:", error.message);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;