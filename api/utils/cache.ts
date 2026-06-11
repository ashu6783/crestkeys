import { getRedisClient } from "./redis";

const LIST_TTL_SECONDS = 300;
const DETAIL_TTL_SECONDS = 600;

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // Cache write failures should not break the request path.
  }
}

export function postsListCacheKey(query: Record<string, unknown>): string {
  const normalized = Object.keys(query)
    .sort()
    .map((key) => `${key}=${String(query[key])}`)
    .join("&");

  return `posts:list:${normalized || "all"}`;
}

export function postDetailCacheKey(postId: string): string {
  return `posts:detail:${postId}`;
}

export async function invalidatePostCaches(postId?: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const keys: string[] = [];
    const stream = redis.scanStream({ match: "posts:list:*", count: 100 });

    for await (const batch of stream) {
      keys.push(...(batch as string[]));
    }

    if (postId) {
      keys.push(postDetailCacheKey(postId));
    }

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // Cache invalidation failures should not break mutations.
  }
}

export { LIST_TTL_SECONDS, DETAIL_TTL_SECONDS };
