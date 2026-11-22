import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import {
  isRequestSessionValid,
  getTrustedClientIp,
} from "@/lib/session";
import { parseJsonBodyWithByteLimit, checkSharedRateLimit } from "@/lib/stream";

export type ItemType = "note" | "wish" | "review";
export type ItemVisibility = "public" | "private";

export interface WishItem {
  id: string;
  type: ItemType;
  visibility: ItemVisibility;
  name: string;
  message: string;
  reaction?: string;
  stamp?: string;
  createdAt: string;
}

const WISHES_FILE = path.join(process.cwd(), "src", "data", "wishes.json");
const MAX_BODY_BYTES = 64 * 1024; // 64 KB strict byte limit

// Allowed stamps and reactions
const ALLOWED_STAMPS = new Set(["🌸", "💖", "✨", "💌", "🎀", "🤍", "🎂", "🕯️", "👑", "🌹", "🧸"]);
const ALLOWED_REACTIONS = new Set([
  "🥹 Adored every second",
  "😭 In happy tears",
  "✨ Best gift ever",
  "💖 Pucchi for life",
  "👑 1000/10 Queen feel",
]);

// Initial fallback seed
const INITIAL_NOTES: WishItem[] = [
  {
    id: "note-intro-01",
    type: "note",
    visibility: "public",
    name: "Harleen 4 Life",
    message: "A gentle corner to leave sweet reminders and memories for Harleen. 🌸",
    stamp: "🌸",
    createdAt: "2026-02-16T00:00:00Z",
  },
];

/**
 * Validates admin authentication using constant-time comparison.
 * Never accepts credentials from query parameters.
 */
function verifyAdminAuth(req: Request): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || !adminToken.trim()) return false;

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7).trim();
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(adminToken.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Validates recipient authorization for private wish and review submissions.
 * Checks for:
 * 1. Admin Bearer token, or
 * 2. Cryptographically signed, unexpired session cookie.
 */
function isCallerAuthorizedForPrivateSubmissions(req: Request): boolean {
  if (verifyAdminAuth(req)) return true;
  return isRequestSessionValid(req);
}

// Check if Redis is configured
const isRedisConfigured = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
);

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

type StorageResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status: number };

let inMemoryWishes: WishItem[] = [...INITIAL_NOTES];

/**
 * Loads wishes from storage.
 * CRITICAL PERSISTENCE RULE:
 * If Redis is configured and fails, return an error immediately (503).
 * NEVER fall back to local disk or stale repo JSON, which would lead to
 * subsequent writes overwriting Redis with stale data!
 */
async function loadWishes(): Promise<StorageResult<WishItem[]>> {
  if (isRedisConfigured) {
    try {
      const res = await fetch(`${redisUrl}/get/harleen_birthday_wishes`, {
        headers: { Authorization: `Bearer ${redisToken}` },
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        console.error(`Redis GET returned HTTP ${res.status}`);
        return {
          success: false,
          error: "Database service unavailable. Please try again later.",
          status: 503,
        };
      }

      const json = await res.json();
      if (!json.result) return { success: true, data: [] };
      const parsed = typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      return { success: true, data: Array.isArray(parsed) ? parsed : [] };
    } catch (err) {
      console.error("Redis GET failed:", err);
      return {
        success: false,
        error: "Database service unavailable. Please try again later.",
        status: 503,
      };
    }
  }

  // When Redis is NOT configured:
  const allowFileStorage = process.env.ALLOW_FILE_STORAGE === "true" || process.env.NODE_ENV !== "production";
  if (!allowFileStorage) {
    return {
      success: false,
      error: "Storage service is not configured.",
      status: 503,
    };
  }

  try {
    const data = await fs.readFile(WISHES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      inMemoryWishes = parsed;
      return { success: true, data: parsed };
    }
  } catch {
    // File not readable
  }

  return { success: true, data: inMemoryWishes };
}

/**
 * Saves wishes to storage.
 * In production: Redis must be used, unless ALLOW_FILE_STORAGE=true is explicitly set.
 */
async function saveWishes(wishes: WishItem[]): Promise<StorageResult<void>> {
  if (isRedisConfigured) {
    try {
      const res = await fetch(`${redisUrl}/set/harleen_birthday_wishes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(wishes)),
        signal: AbortSignal.timeout(3000),
      });

      if (!res.ok) {
        console.error(`Redis SET returned HTTP ${res.status}`);
        return {
          success: false,
          error: "Database storage failed. Please try again.",
          status: 503,
        };
      }

      inMemoryWishes = wishes;
      return { success: true, data: undefined };
    } catch (err) {
      console.error("Redis SET failed:", err);
      return {
        success: false,
        error: "Database storage failed. Please try again.",
        status: 503,
      };
    }
  }

  const allowFileStorage = process.env.ALLOW_FILE_STORAGE === "true" || process.env.NODE_ENV !== "production";
  if (!allowFileStorage) {
    return {
      success: false,
      error: "Storage service is not configured. Submissions cannot be saved.",
      status: 503,
    };
  }

  try {
    const tempFile = `${WISHES_FILE}.${Date.now()}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(wishes, null, 2), "utf-8");
    await fs.rename(tempFile, WISHES_FILE);
    inMemoryWishes = wishes;
    return { success: true, data: undefined };
  } catch (err) {
    console.error("Local disk write failed:", err);
    return {
      success: false,
      error: "Failed to write to local storage.",
      status: 500,
    };
  }
}

/**
 * Sends notifications with strict privacy and abuse controls:
 * 1. Only sends if NTFY_TOPIC is configured in environment.
 * 2. Only includes private wish/review text if NTFY_ALLOW_PRIVATE_CONTENT=true.
 * 3. Does not send public guestbook notifications unless NOTIFY_PUBLIC_NOTES=true.
 */
async function dispatchNotification(entry: WishItem): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic || !topic.trim()) return;

  const allowPrivateContent = process.env.NTFY_ALLOW_PRIVATE_CONTENT === "true";
  let title = "";
  let message = "";
  let tags: string[] = [];

  if (entry.type === "wish") {
    title = "Harleen Made A Birthday Wish";
    tags = ["birthday", "star2", "candle"];
    message = allowPrivateContent
      ? `Harleen blew the candle and wished:\n"${entry.message}"`
      : "Harleen made a private birthday wish. Log in to the admin dashboard to read it.";
  } else if (entry.type === "review") {
    title = "New Review From Harleen";
    tags = ["heart", "envelope", "sparkling_heart"];
    message = allowPrivateContent
      ? `Reaction: ${entry.reaction || "Adored it"}\nNote: "${entry.message}"`
      : "A private review was submitted. Log in to the admin dashboard to read it.";
  } else {
    // Public guestbook note policy: disabled by default to prevent notification spam
    if (process.env.NOTIFY_PUBLIC_NOTES !== "true") return;

    // Rate-limit public note notifications to max 2 per 5 minutes
    const limitCheck = await checkSharedRateLimit("notify:public_notes", 2, 300);
    if (!limitCheck.allowed) return;

    title = "New Note On Guestbook Wall";
    tags = ["memo", "pencil", "blossom"];
    message = `Note from ${entry.name}:\n"${entry.message}"`;
  }

  try {
    const res = await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic.trim(),
        title,
        message,
        tags,
        priority: 4,
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      console.error(`ntfy.sh returned HTTP ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("Notification dispatch failed:", err);
  }
}

// GET /api/wishes
export async function GET(req: Request) {
  try {
    const isAdmin = verifyAdminAuth(req);
    const result = await loadWishes();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Public visitors strictly receive public notes; private entries are hidden
    const items = isAdmin
      ? result.data
      : result.data.filter(
          (item) => item.type === "note" && item.visibility === "public"
        );

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (err) {
    console.error("GET /api/wishes error:", err);
    return NextResponse.json({ error: "Failed to load entries." }, { status: 500 });
  }
}

// POST /api/wishes
export async function POST(req: Request) {
  try {
    const clientIp = getTrustedClientIp(req);
    // Rate limit: max 12 requests per minute per trusted client IP
    const rateKey = `wishes_post:${clientIp || "untrusted"}`;
    const rateCheck = await checkSharedRateLimit(rateKey, 12, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // Stream-level byte measurement & limit enforcement (413 if > 64 KB)
    const { data: body, errorResponse } = await parseJsonBodyWithByteLimit<Record<string, unknown>>(
      req,
      MAX_BODY_BYTES
    );
    if (errorResponse) return errorResponse;

    // Honeypot check
    if (body?.hp || body?.website) {
      return NextResponse.json({ success: true, item: { id: "ok" } });
    }

    const rawMessage = body?.message;
    const rawType = body?.type;
    const rawName = body?.name;
    const rawReaction = body?.reaction;
    const rawStamp = body?.stamp;

    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    if (rawMessage.length > 2000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 2000 characters." },
        { status: 400 }
      );
    }

    const message = rawMessage.trim().slice(0, 1000);

    let itemType: ItemType = "note";
    let visibility: ItemVisibility = "public";
    let finalName = "Guest";

    if (rawType === "wish" || rawType === "review") {
      // Validate recipient session signature and expiration
      const authorized = isCallerAuthorizedForPrivateSubmissions(req);
      if (!authorized) {
        return NextResponse.json(
          {
            error: "Private wish and review submissions are reserved for Harleen. Please leave a public note on the guestbook wall instead.",
          },
          { status: 403 }
        );
      }

      if (rawType === "wish") {
        itemType = "wish";
        visibility = "private";
        finalName = "Harleen";
      } else {
        itemType = "review";
        visibility = "private";
        finalName = "Harleen";
      }
    } else {
      // Guestbook note (public)
      itemType = "note";
      visibility = "public";
      if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
        return NextResponse.json({ error: "Name is required for guestbook notes." }, { status: 400 });
      }
      finalName = rawName.trim().slice(0, 50);
    }

    const stamp = typeof rawStamp === "string" && ALLOWED_STAMPS.has(rawStamp) ? rawStamp : "🌸";
    const reaction = typeof rawReaction === "string" && ALLOWED_REACTIONS.has(rawReaction) ? rawReaction : undefined;

    const newEntry: WishItem = {
      id: `${itemType}-${crypto.randomUUID()}`,
      type: itemType,
      visibility,
      name: finalName,
      message,
      reaction,
      stamp,
      createdAt: new Date().toISOString(),
    };

    // Load existing items; fail if storage service is unavailable
    const loadResult = await loadWishes();
    if (!loadResult.success) {
      return NextResponse.json({ error: loadResult.error }, { status: loadResult.status });
    }

    const updated = [newEntry, ...loadResult.data];
    const saveResult = await saveWishes(updated);

    if (!saveResult.success) {
      return NextResponse.json({ error: saveResult.error }, { status: saveResult.status });
    }

    // Dispatch notification only after guaranteed persistence
    void dispatchNotification(newEntry);

    return NextResponse.json({ success: true, item: newEntry });
  } catch (err) {
    console.error("POST /api/wishes error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE /api/wishes (Admin moderation endpoint)
export async function DELETE(req: Request) {
  try {
    if (!verifyAdminAuth(req)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const loadResult = await loadWishes();
    if (!loadResult.success) {
      return NextResponse.json({ error: loadResult.error }, { status: loadResult.status });
    }

    const filtered = loadResult.data.filter((w) => w.id !== id);
    const saveResult = await saveWishes(filtered);

    if (!saveResult.success) {
      return NextResponse.json({ error: saveResult.error }, { status: saveResult.status });
    }

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error("DELETE /api/wishes error:", err);
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}
