"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Award, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface Reason {
  number: number;
  title: string;
  note: string;
  icon: string;
}

const REASONS: Reason[] = [
  {
    number: 1,
    title: "That Effortless Smile",
    note: "The way your entire face lights up when you smile genuinely. It is hands-down my favorite sight in this world.",
    icon: "✨",
  },
  {
    number: 2,
    title: "Cinematic Presence",
    note: "You make even the simplest, most mundane moments feel like scenes from a movie you never want to end.",
    icon: "🌸",
  },
  {
    number: 3,
    title: "Quiet Grace",
    note: "In a world that is always loud and hurried, you bring an effortless, calming peace just by existing.",
    icon: "🕊️",
  },
  {
    number: 4,
    title: "Your Laughter",
    note: "Literally the sweetest melody in the world. When you laugh without holding back, everything feels right.",
    icon: "💖",
  },
  {
    number: 5,
    title: "The Queen of Pink",
    note: "Nobody on this planet pulls off pink aesthetic the way you do. It was made for you.",
    icon: "🎀",
  },
  {
    number: 6,
    title: "My Safest Haven",
    note: "You calm my chaotic mind in seconds. Talking to you makes all the heavy things in life feel feather-light.",
    icon: "🌙",
  },
  {
    number: 7,
    title: "When You Get Excited",
    note: "The cute little spark in your eyes whenever you talk about something you genuinely love.",
    icon: "🧸",
  },
  {
    number: 8,
    title: "Our Shared Music",
    note: "Your music taste, the Cigarettes After Sex vibe, and all the late night tracks we share together.",
    icon: "🎶",
  },
  {
    number: 9,
    title: "The Softness in Your Voice",
    note: "The gentle warmth and kindness in the way you speak. It instantly feels like home.",
    icon: "💌",
  },
  {
    number: 10,
    title: "Turning Bad Days Around",
    note: "You can turn my worst days upside down with just a single notification or a few sweet words.",
    icon: "☀️",
  },
  {
    number: 11,
    title: "Rare Dignity & Sweetness",
    note: "The way you hold yourself with so much poise, elegance, and pure kindness for everyone around you.",
    icon: "👑",
  },
  {
    number: 12,
    title: "Your Unfiltered Silly Side",
    note: "The adorable, funny, unhinged side that is so special because only you and I get to share it.",
    icon: "😂",
  },
  {
    number: 13,
    title: "Your Big, Caring Heart",
    note: "How deeply and selflessly you care. You give so much warmth to the world.",
    icon: "🤍",
  },
  {
    number: 14,
    title: "Our Secret Inside Jokes",
    note: "All the memories, phrases, and moments that belong exclusively to only the two of us.",
    icon: "🔐",
  },
  {
    number: 15,
    title: "How Fast Time Flies",
    note: "Hours feel like minutes whenever I talk to you. I never run out of things to tell you.",
    icon: "⏳",
  },
  {
    number: 16,
    title: "Simply Because You Are Harleen",
    note: "Because you are rare, irreplaceable, and genuinely the only person in this whole world I adore.",
    icon: "🌹",
  },
];

export default function SixteenReasons() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const toggleCard = (num: number) => {
    setFlippedCards((prev) => {
      const next = prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num];
      if (next.length === REASONS.length && !hasCelebrated) {
        setHasCelebrated(true);
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
        });
      }
      return next;
    });
  };

  const revealAll = () => {
    setFlippedCards(REASONS.map((r) => r.number));
    if (!hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
      });
    }
  };

  return (
    <section id="reasons" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>February 16th Special Edition</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#2e1322] drop-shadow-xs">
          16 Reasons Why I Adore You 🌸
        </h2>
        <p className="font-hand text-2xl text-rose-600/90 mt-2">
          One for every year & date of your 16th of February. Tap any card to flip & reveal!
        </p>

        {/* Progress Tracker & Quick Reveal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-mono font-bold text-rose-800 shadow-xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>
              Revealed: {flippedCards.length} / {REASONS.length}
            </span>
          </div>

          {flippedCards.length < REASONS.length && (
            <button
              onClick={revealAll}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold underline decoration-amber-300 underline-offset-4 transition-colors"
            >
              Flip All 16 Cards ✨
            </button>
          )}
        </div>
      </div>

      {/* 16 CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {REASONS.map((item) => {
          const isFlipped = flippedCards.includes(item.number);

          return (
            <motion.div
              key={item.number}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCard(item.number)}
              className="h-64 cursor-pointer select-none perspective-[1000px]"
            >
              <div
                className={`w-full h-full relative transition-all duration-500 transform-style-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT FACE (Foil Card Cover) */}
                <div
                  className="absolute inset-0 rounded-2xl glass-pearl p-6 flex flex-col items-center justify-between text-center border-2 border-pink-200/90 shadow-md backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-amber-600">
                    <span>N° {String(item.number).padStart(2, "0")}</span>
                    <span>16TH FEB</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <span className="font-serif font-black text-rose-950 text-base">
                      {item.title}
                    </span>
                  </div>

                  <div className="w-full pt-2 border-t border-pink-200/60 flex items-center justify-center gap-1.5 text-[11px] font-sans font-bold text-rose-500">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Tap to reveal reason</span>
                  </div>
                </div>

                {/* BACK FACE (Unveiled Note) */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#fff7f9] via-white to-[#fff0f3] p-6 flex flex-col justify-between text-center border-2 border-amber-300 shadow-xl backface-hidden rotate-y-180"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="w-full flex justify-between items-center text-xs font-mono font-bold text-rose-700">
                    <span className="px-2 py-0.5 rounded-full bg-pink-100">
                      REASON N° {item.number}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>

                  <p className="font-hand text-xl text-rose-900 leading-snug my-auto px-1">
                    &ldquo;{item.note}&rdquo;
                  </p>

                  <span className="text-[10px] uppercase font-mono font-bold text-amber-700 tracking-wider">
                    Harleen 4 Life 🌸
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* COMPLETION CERTIFICATE (Unlocked when all 16 are opened) */}
      <AnimatePresence>
        {flippedCards.length === REASONS.length && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-pink-50 to-amber-50 border-2 border-amber-300 shadow-xl text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 mx-auto mb-4 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Award className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            <span className="text-xs font-mono font-bold tracking-widest text-amber-800 uppercase">
              Official Birthday Decree • February 16
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#2e1322] mt-1">
              You Have Unlocked All 16 Reasons 🤍
            </h3>
            <p className="font-hand text-2xl text-rose-700 mt-2">
              &ldquo;Truth is, there are a million more reasons. You are the only person I adore.&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
