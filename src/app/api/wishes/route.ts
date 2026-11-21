import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";


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

// Allowed reactions and stamps for validation
const ALLOWED_STAMPS = new Set(["🌸", "💖", "✨", "💌", "🎀", "🤍", "🎂", "🕯️", "👑", "🌹"]);
const ALLOWED_REACTIONS = new Set([
  "🥹 Adored every second",
  "😭 In happy tears",
  "✨ Best gift ever",
  "💖 Pucchi for life",
  "👑 1000/10 Queen feel",
]);

// Starter notes for the public guestbook
const INITIAL_NOTES: WishItem[] = [
  {
    id: "note-intro-01",
    type: "note",
    visibility: "public",
    name: "Harleen 4 Life",
    message: "A gentle corner to leave sweet reminders and memories for Harleen. 🌸",
    stamp: "🌸",
    createdAt: "2027-02-16T00:00:00Z",
  },
];

// Simple in-memory rate limiting (max 10 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

// Upstash / Vercel KV REST helpers (zero dependencies)
async function getRedisData(): Promise<WishItem[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/harleen_birthday_wishes`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return [];
    return typeof json.result === "string" ? JSON.parse(json.result) : json.result;
  } catch (err) {
    console.error("Upstash Redis GET failed:", err);
    return null;
  }
}

async function setRedisData(data: WishItem[]): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/harleen_birthday_wishes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.stringify(data)),
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch (err) {
    console.error("Upstash Redis SET failed:", err);
    return false;
  }
}

// Safe file load/save fallback
let inMemoryWishes: WishItem[] = [...INITIAL_NOTES];

async function loadWishes(): Promise<WishItem[]> {
  const redisData = await getRedisData();
  if (redisData !== null) return redisData;

  try {
    const data = await fs.readFile(WISHES_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryWishes = parsed;
      return parsed;
    }
  } catch {
    // File doesn't exist yet or unreadable
  }
  return inMemoryWishes;
}

async function saveWishes(wishes: WishItem[]): Promise<void> {
  inMemoryWishes = wishes;

  const savedToRedis = await setRedisData(wishes);
  if (savedToRedis) return;

  // Atomic file write on local disk
  try {
    const tempFile = `${WISHES_FILE}.${Date.now()}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(wishes, null, 2), "utf-8");
    await fs.rename(tempFile, WISHES_FILE);
  } catch (err) {
    // In serverless read-only environment, local write may fail gracefully
    console.warn("Local disk write bypassed (serverless environment):", err);
  }
}

// Instant notification via JSON POST to ntfy.sh (No HTTP header encoding bugs)
async function sendInstantNotification(title: string, message: string, tags: string[] = ["sparkles", "heart"]): Promise<void> {
  try {
    const topic = process.env.NTFY_TOPIC || "harleen-birthday-pucchi-alert-priv-9f7a";
    const res = await fetch("https://ntfy.sh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
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
    console.error("Failed to send push notification:", err);
  }
}

// GET /api/wishes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || req.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;
    const isAdmin = Boolean(adminToken && token === adminToken);

    const allWishes = await loadWishes();

    // Unless authorized as admin, return ONLY public notes
    const items = isAdmin
      ? allWishes
      : allWishes.filter((item) => item.visibility === "public" || item.type === "note");

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
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON format." }, { status: 400 });
    }

    // Honeypot check (bot prevention)
    if (body.hp || body.website) {
      return NextResponse.json({ success: true, item: { id: "ok" } });
    }

    const rawMessage = body.message;
    const rawType = body.type;
    const rawName = body.name;
    const rawReaction = body.reaction;
    const rawStamp = body.stamp;

    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const message = rawMessage.trim().slice(0, 500);

    // Enforce type and visibility contract strictly
    let itemType: ItemType = "note";
    let visibility: ItemVisibility = "public";
    let finalName = "Guest";

    if (rawType === "wish") {
      itemType = "wish";
      visibility = "private";
      finalName = "Harleen";
    } else if (rawType === "review") {
      itemType = "review";
      visibility = "private";
      finalName = "Harleen";
    } else {
      itemType = "note";
      visibility = "public";
      if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
        return NextResponse.json({ error: "Name is required for guestbook notes." }, { status: 400 });
      }
      finalName = rawName.trim().slice(0, 40);
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

    const currentWishes = await loadWishes();
    const updated = [newEntry, ...currentWishes];
    await saveWishes(updated);

    // Fire-and-forget push notification based on strictly resolved itemType
    if (newEntry.type === "wish") {
      void sendInstantNotification(
        "Harleen Just Made A Birthday Wish",
        `Harleen blew the candle and wished:\n"${newEntry.message}"`,
        ["birthday", "star2", "candle"]
      );
    } else if (newEntry.type === "review") {
      void sendInstantNotification(
        "New Review From Harleen",
        `Reaction: ${newEntry.reaction || "Adored it"}\nNote: "${newEntry.message}"`,
        ["heart", "envelope", "sparkling_heart"]
      );
    } else {
      void sendInstantNotification(
        "New Note On Guestbook Wall",
        `Note from ${newEntry.name}:\n"${newEntry.message}"`,
        ["memo", "pencil", "blossom"]
      );
    }

    return NextResponse.json({ success: true, item: newEntry });
  } catch (err) {
    console.error("POST /api/wishes error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE /api/wishes (Admin moderation endpoint)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token") || req.headers.get("authorization")?.replace("Bearer ", "");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
    }

    const currentWishes = await loadWishes();
    const filtered = currentWishes.filter((w) => w.id !== id);
    await saveWishes(filtered);

    return NextResponse.json({ success: true, deleted: id });
  } catch (err) {
    console.error("DELETE /api/wishes error:", err);
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}
