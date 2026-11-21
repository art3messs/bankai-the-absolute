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
    note: "The way your entire face lights up when you smile genuinely. It is hands-down my favorite sight in this entire universe.",
    icon: "✨",
  },
  {
    number: 2,
    title: "Cinematic Presence",
    note: "You make even the simplest mundane moments feel like scenes from a movie you never want to end.",
    icon: "🌸",
  },
  {
    number: 3,
    title: "Quiet, Calming Peace",
    note: "In a world that is always loud and hurried, you bring an effortless, calming stillness just by existing.",
    icon: "🕊️",
  },
  {
    number: 4,
    title: "Your Unfiltered Laughter",
    note: "Literally the sweetest melody in the world. When you laugh without holding back, everything in life feels completely right.",
    icon: "💖",
  },
  {
    number: 5,
    title: "Queen of Pink Aesthetic",
    note: "Nobody on this planet pulls off pink and elegance the way you do. It was made specifically for you.",
    icon: "🎀",
  },
  {
    number: 6,
    title: "My Safest Haven",
    note: "You calm my chaotic thoughts in seconds. Talking to you makes all the heavy things in life feel feather-light.",
    icon: "🌙",
  },
  {
    number: 7,
    title: "That Cute Spark In Your Eyes",
    note: "The adorable enthusiasm in your eyes whenever you talk about something you genuinely adore.",
    icon: "🧸",
  },
  {
    number: 8,
    title: "Our Shared CAS Vibe",
    note: "Cigarettes After Sex spinning at late night, sharing tracks, and the soundtrack of us together.",
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
    title: "Turning Bad Days Into Gold",
    note: "You can turn my worst days completely around with just a single notification or a few sweet words.",
    icon: "☀️",
  },
  {
    number: 11,
    title: "Royal Grace & Elegance",
    note: "The way you carry yourself with so much poise, modesty, and radiant beauty in traditional silk.",
    icon: "👑",
  },
  {
    number: 12,
    title: "Your Silly Popaaa Faces",
    note: "The adorable, unhinged, goofy side that is so special because only you and I get to share it.",
    icon: "😂",
  },
  {
    number: 13,
    title: "Your Big, Caring Heart",
    note: "How deeply and selflessly you care. You give so much quiet kindness and gentle warmth to everyone around you.",
    icon: "🤍",
  },
  {
    number: 14,
    title: "Pucchi & Our Secret Code",
    note: "Our secret little inside joke and tender nickname that instantly brings the biggest smile to my face.",
    icon: "🔐",
  },
  {
    number: 15,
    title: "How Fast Time Flies With You",
    note: "Hours feel like seconds whenever I talk to you. I never run out of things to say or adore about you.",
    icon: "⏳",
  },
  {
    number: 16,
    title: "Simply Because You Are Harleen",
    note: "Because you are rare, irreplaceable, and genuinely the center of my whole universe. Harleen 4 Life.",
    icon: "🌹",
  },
];

export default function SixteenReasons() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const toggleCard = (num: number) => {
    const isCurrentlyFlipped = flippedCards.includes(num);
    const nextFlipped = isCurrentlyFlipped
      ? flippedCards.filter((n) => n !== num)
      : [...flippedCards, num];

    setFlippedCards(nextFlipped);

    if (nextFlipped.length === REASONS.length && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    }
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
        <h2 className="font-forum text-3xl sm:text-5xl text-[#831843] uppercase tracking-[0.06em]">
          16 Reasons Why You Are My World
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#9d174d] mt-2 leading-relaxed">
          &ldquo;Tap each archival card to flip and reveal an intimate truth.&rdquo;
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={revealAll}
            className="px-5 py-2 rounded-full bg-white hover:bg-pink-50/80 border-2 border-[#f472b6]/40 text-[#db2777] text-xs font-raleway font-bold uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>Unveil All 16 Cards</span>
          </button>
        </div>
      </div>

      {/* 4x4 Grid of Editorial Archival Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {REASONS.map((item) => {
          const isFlipped = flippedCards.includes(item.number);
          return (
            <motion.button
              type="button"
              key={item.number}
              aria-pressed={isFlipped}
              aria-label={`Chronicle ${item.number}: ${item.title}`}
              whileHover={{ y: -8, scale: 1.03, rotateX: 4, rotateY: -3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() => toggleCard(item.number)}
              className="relative h-60 w-full text-left rounded-3xl cursor-pointer perspective-[1200px] select-none group block p-0 bg-transparent border-0"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* FRONT FACE (Card Cover) */}
                <div
                  className="absolute inset-0 rounded-3xl bg-white p-6 flex flex-col justify-between border border-[#d97d93]/30 shadow-xs hover:shadow-md transition-shadow backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-forum text-2xl font-bold text-[#c95874]">
                      N° {item.number < 10 ? `0${item.number}` : item.number}
                    </span>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-raleway tracking-[0.2em] text-[#7d7265] uppercase font-bold block mb-1">
                      CHRONICLE {item.number}
                    </span>
                    <h3 className="font-forum text-lg sm:text-xl text-[#241e16] uppercase tracking-wide leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-raleway text-[#c95874] uppercase tracking-wider font-semibold">
                    <Heart className="w-3 h-3 fill-[#c95874]" />
                    <span>Tap to flip</span>
                  </div>
                </div>

                {/* BACK FACE (Unveiled Note) */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#fff7f8] via-[#fdfaf5] to-[#fbf2e9] p-6 flex flex-col justify-between border-2 border-[#d4af37]/40 shadow-md backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-[#d97d93]/20 pb-2">
                    <span className="text-[9px] font-raleway tracking-[0.25em] text-[#d4af37] uppercase font-bold">
                      REASON N° {item.number}
                    </span>
                    <Heart className="w-3.5 h-3.5 text-[#c95874] fill-[#c95874]" />
                  </div>

                  <p className="font-forum text-sm sm:text-base text-[#241e16] leading-relaxed my-auto">
                    {item.note}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#d97d93]/20 text-[9px] text-[#7d7265] font-raleway uppercase tracking-wider font-semibold">
                    <span>Harleen 4 Life</span>
                    <span>16 Feb ✦</span>
                  </div>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
