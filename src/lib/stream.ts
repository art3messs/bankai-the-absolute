import { NextResponse } from "next/server";

/**
 * Enforces a strict byte-level limit while reading the request stream in chunks.
 * Does not buffer the entire stream before checking the limit.
 * Measures raw bytes, not JavaScript characters.
 * Returns 413 immediately when the limit is exceeded, even if Content-Length is absent.
 */
export async function parseJsonBodyWithByteLimit<T>(
  req: Request,
  maxBytes: number = 64 * 1024
): Promise<{ data?: T; errorResponse?: NextResponse }> {
  const contentLength = req.headers.get("content-length");
  if (contentLength) {
    const parsedLen = parseInt(contentLength, 10);
    if (!isNaN(parsedLen) && parsedLen > maxBytes) {
      return {
        errorResponse: NextResponse.json(
          { error: "Payload too large. Maximum allowed size is 64KB." },
          { status: 413 }
        ),
      };
    }
  }

  if (!req.body) {
    return {
      errorResponse: NextResponse.json(
        { error: "Request body cannot be empty." },
        { status: 400 }
      ),
    };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("Payload size limit exceeded");
          return {
            errorResponse: NextResponse.json(
              { error: "Payload too large. Maximum allowed size is 64KB." },
              { status: 413 }
            ),
          };
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    console.error("Stream reading error:", err);
    return {
      errorResponse: NextResponse.json(
        { error: "Failed to read request stream." },
        { status: 400 }
      ),
    };
  }

  if (totalBytes === 0) {
    return {
      errorResponse: NextResponse.json(
        { error: "Request body cannot be empty." },
        { status: 400 }
      ),
    };
  }

  const fullBuffer = Buffer.concat(chunks);
  try {
    const parsed = JSON.parse(fullBuffer.toString("utf-8")) as T;
    return { data: parsed };
  } catch {
    return {
      errorResponse: NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      ),
    };
  }
}

/**
 * Shared rate limiter using Upstash Redis when configured,
 * or in-memory fallback for local development.
 */
const inMemoryRateLimits = new Map<string, { count: number; resetAt: number }>();

export async function checkSharedRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds],
        ]),
        signal: AbortSignal.timeout(2000),
      });

      if (res.ok) {
        const results = await res.json();
        const currentCount = typeof results[0]?.result === "number" ? results[0].result : 1;
        return {
          allowed: currentCount <= limit,
          remaining: Math.max(0, limit - currentCount),
        };
      }
    } catch (err) {
      console.warn("Shared Redis rate limiter unavailable, falling back to local memory:", err);
    }
  }

  // Local fallback
  const now = Date.now();
  const entry = inMemoryRateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    inMemoryRateLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
