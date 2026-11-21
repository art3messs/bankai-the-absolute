import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface WishItem {
  id: string;
  type: "wish" | "review";
  name: string;
  message: string;
  reaction?: string;
  stamp?: string;
  createdAt: string;
}

const WISHES_FILE = path.join(process.cwd(), "src", "data", "wishes.json");

// Default starter items
let memoryWishes: WishItem[] = [
  {
    id: "wish-001",
    type: "wish",
    name: "Harleen",
    message: "To always have peace, laughter, and endless happiness together ✨",
    stamp: "🕯️",
    createdAt: "2026-02-16T00:00:00Z",
  },
];

async function loadWishes(): Promise<WishItem[]> {
  try {
    const data = await fs.readFile(WISHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return memoryWishes;
  }
}

async function saveWishes(wishes: WishItem[]): Promise<void> {
  memoryWishes = wishes;
  try {
    await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist wishes to disk:", err);
  }
}

// Send instant push notification to user's phone / laptop via ntfy.sh
async function sendInstantNotification(title: string, message: string, tags: string[] = ["sparkles", "heart"]) {
  try {
    const topic = "harleen-birthday-pucchi-alert";
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: title,
        Priority: "urgent",
        Tags: tags.join(","),
      },
      body: message,
    });
  } catch {
    // Network or offline gracefully ignored
  }
}

// GET /api/wishes
export async function GET() {
  const wishes = await loadWishes();
  return NextResponse.json(wishes);
}

// POST /api/wishes
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message, type = "wish", reaction, stamp = "🤍" } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const currentWishes = await loadWishes();
    const newEntry: WishItem = {
      id: `${type}-${Date.now()}`,
      type: type === "review" ? "review" : "wish",
      name: (name && String(name).trim()) || "Harleen",
      message: message.trim(),
      reaction: reaction || undefined,
      stamp: stamp || "🤍",
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...currentWishes];
    await saveWishes(updated);

    // Trigger instant notification
    if (newEntry.type === "wish") {
      await sendInstantNotification(
        "🎂 Harleen Just Made A Birthday Wish!",
        `Harleen blew the candle and wished: "${newEntry.message}"`,
        ["birthday", "star2", "candle"]
      );
    } else {
      await sendInstantNotification(
        "💌 New Reaction From Harleen!",
        `Reaction: ${newEntry.reaction || "Loved it"} | Note: "${newEntry.message}"`,
        ["heart", "love_letter", "sparkling_heart"]
      );
    }

    return NextResponse.json({ success: true, item: newEntry });
  } catch (err) {
    console.error("POST /api/wishes error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
