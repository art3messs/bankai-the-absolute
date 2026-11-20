import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export interface Wish {
  id: string;
  name: string;
  message: string;
  stamp: string;
  createdAt: string;
}

const WISHES_FILE = path.join(process.cwd(), "src", "data", "wishes.json");

// In-memory fallback if filesystem write is restricted (e.g. read-only serverless edge)
let memoryWishes: Wish[] = [
  {
    id: "1",
    name: "A Close Friend",
    message: "Happy Birthday Harleen!! 🌸 Hope your 16th of Feb is filled with lots of pink cakes, laughs, and unforgettable memories! Keep shining always ✨",
    stamp: "🌸",
    createdAt: "2026-02-16T00:01:00Z",
  },
  {
    id: "2",
    name: "Secret Admirer",
    message: "To the prettiest girl with the sweetest vibe 💖 Happy Birthday Harleen! Never stop smiling!",
    stamp: "💖",
    createdAt: "2026-02-16T00:05:00Z",
  },
  {
    id: "3",
    name: "Bestie",
    message: "Queen of pink!! 🎀 You deserve the absolute best year ahead. So lucky to have you in our lives!",
    stamp: "🎀",
    createdAt: "2026-02-16T00:10:00Z",
  },
];

async function loadWishes(): Promise<Wish[]> {
  try {
    const data = await fs.readFile(WISHES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return memoryWishes;
  }
}

async function saveWishes(wishes: Wish[]): Promise<void> {
  memoryWishes = wishes;
  try {
    await fs.writeFile(WISHES_FILE, JSON.stringify(wishes, null, 2), "utf-8");
  } catch {
    // Falls back to memoryWishes if file system is read-only
  }
}

// GET /api/wishes
export async function GET() {
  const wishes = await loadWishes();
  return NextResponse.json(wishes);
}

// POST /api/wishes
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, stamp } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const newWish: Wish = {
      id: Date.now().toString(),
      name: String(name).slice(0, 50),
      message: String(message).slice(0, 500),
      stamp: String(stamp || "🌸").slice(0, 4),
      createdAt: new Date().toISOString(),
    };

    const wishes = await loadWishes();
    const updated = [newWish, ...wishes];
    await saveWishes(updated);

    return NextResponse.json(newWish, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process wish" },
      { status: 500 }
    );
  }
}
