"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award } from "lucide-react";
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
          colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
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
        colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    }
  };

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
          16 Reasons Why I Adore You
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-2 leading-relaxed">
          &ldquo;One for every year &amp; date of your 16th of February. Tap any card to flip &amp; reveal.&rdquo;
        </p>

        {/* Progress Tracker & Quick Reveal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d97d93]/30 text-xs font-mono font-bold text-[#c95874] shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#c95874] fill-[#c95874]" />
            <span>
              Revealed: {flippedCards.length} / {REASONS.length}
            </span>
          </div>

          {flippedCards.length < REASONS.length && (
            <button
              onClick={revealAll}
              className="text-xs text-[#d4af37] hover:text-amber-600 font-bold underline decoration-[#d4af37]/60 underline-offset-4 transition-colors font-raleway tracking-wider uppercase"
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
              className="h-64 cursor-pointer select-none [perspective:1000px]"
            >
              <div
                className={`w-full h-full relative transition-all duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* FRONT (Linen Alabaster with Bronze Foil Border) */}
                <div className="absolute inset-0 [backface-visibility:hidden] editorial-card rounded-2xl p-5 flex flex-col justify-between border border-[#d97d93]/30 shadow-xs hover:border-[#d4af37] transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-forum text-2xl text-[#d4af37] font-bold">
                      #{item.number < 10 ? `0${item.number}` : item.number}
                    </span>
                    <span className="text-xl select-none">{item.icon}</span>
                  </div>

                  <div className="my-auto text-center px-1">
                    <h3 className="font-forum text-lg sm:text-xl text-[#241e16] font-normal leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-center pt-2 border-t border-[#d97d93]/15">
                    <span className="text-[10px] font-raleway font-semibold text-[#7d7265] tracking-[0.2em] uppercase">
                      Tap to reveal ✦
                    </span>
                  </div>
                </div>

                {/* BACK (Rose Silk Inset) */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl p-5 flex flex-col justify-between bg-white border border-[#d97d93]/40 shadow-md">
                  <div className="flex justify-between items-center text-xs text-[#c95874] font-forum font-bold">
                    <span>REASON #{item.number}</span>
                    <Heart className="w-3.5 h-3.5 fill-[#c95874]" />
                  </div>

                  <p className="font-raleway text-xs sm:text-[13px] text-[#241e16] leading-relaxed my-auto text-center px-1 font-medium">
                    &ldquo;{item.note}&rdquo;
                  </p>

                  <div className="text-center pt-2 border-t border-[#d97d93]/15">
                    <span className="text-[9px] font-signature text-xl text-[#c95874]">
                      harleen 4 life
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
