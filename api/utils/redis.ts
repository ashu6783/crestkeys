import Redis from "ioredis";

let client: Redis | null = null;
let available = false;

export async function initRedis(): Promise<void> {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.log("Redis not configured — API cache disabled");
    return;
  }

  try {
    client = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: true,
    });
    client.on("error", () => {
      available = false;
    });
    await client.connect();
    await client.ping();
    available = true;
    console.log("Redis connected");
  } catch (error) {
    console.warn("Redis unavailable — API cache disabled");
    client?.disconnect();
    client = null;
    available = false;
  }
}

export function isRedisAvailable(): boolean {
  return available && client !== null;
}

export function getRedisClient(): Redis | null {
  return available ? client : null;
}
