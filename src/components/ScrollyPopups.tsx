"use client";

import React, { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, Heart, Film, Award, Smile, Star } from "lucide-react";
import confetti from "canvas-confetti";

interface MemoryPopup {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  side: "left" | "right";
  rotate: number;
  category: string;
  tagColor: string;
}

const SCROLL_POPUPS: MemoryPopup[] = [
  {
    id: "pogo-popup",
    badge: "👶 LITTLE POGO DETECTED",
    title: "Baby Fur Collar Throwback",
    subtitle: "The cutest, sweetest little human in the universe 🍼",
    image: "/media/pogo-baby-fur-smile.jpg",
    side: "left",
    rotate: -4,
    category: "little pogo",
    tagColor: "bg-pink-100 text-pink-700 border-pink-300",
  },
  {
    id: "nails-popup",
    badge: "💅 AESTHICK NAILS CHECK",
    title: "Almond Shimmer & Rings",
    subtitle: "Nail art on point • 1000/10 hands down ✨",
    image: "/media/nails-almond-rings.jpg",
    side: "right",
    rotate: 3.5,
    category: "aesthick nails",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
  },
  {
    id: "popaaa-popup",
    badge: "😂 POPAAA MOMENT UNLOCKED",
    title: "Squishy Cheeks & Goofy Grin",
    subtitle: "Zero filters, 100% pure joy & silly laughs 😂",
    image: "/media/popaaa-cheek-pinch.jpg",
    side: "left",
    rotate: -3,
    category: "popaaa moments",
    tagColor: "bg-amber-50 text-amber-700 border-amber-300",
  },
  {
    id: "ethnic-popup",
    badge: "💃 SICK IN ETHNIC",
    title: "Royal Emerald Tiara & Silk",
    subtitle: "Straight out of a royal fairytale • Timeless elegance 👑",
    image: "/media/ethnic-dragonfly-tiara.jpg",
    side: "right",
    rotate: 4,
    category: "sick in ethnic",
    tagColor: "bg-purple-50 text-purple-700 border-purple-300",
  },
  {
    id: "harleen-popup",
    badge: "👑 HARLEEN 4 LIFE",
    title: "Polka Dots & Rhinestone Sparkle",
    subtitle: "The only person I adore • Forever & always 💖",
    image: "/media/harleen-polka-rhinestones.jpg",
    side: "left",
    rotate: -2.5,
    category: "harleen 4 life",
    tagColor: "bg-rose-50 text-rose-700 border-rose-300",
  },
];

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-[65px] left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#d97d93] via-[#d4af37] to-[#c95874] origin-left z-50 pointer-events-none shadow-[0_0_10px_rgba(217,125,147,0.5)]"
    />
  );
}

interface ScrollyCardProps {
  popup: MemoryPopup;
}

export function ScrollyCard({ popup }: ScrollyCardProps) {
  const [popped, setPopped] = useState(false);

  const handleCelebrate = () => {
    setPopped(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
    });
  };

  const isLeft = popup.side === "left";

  return (
    <div
      className={`w-full max-w-5xl mx-auto px-4 py-8 flex ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 50, rotate: popup.rotate * 2 }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotate: popup.rotate,
        }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 22,
          bounce: 0.45,
        }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        onClick={handleCelebrate}
        className="cursor-pointer select-none bg-white p-4 rounded-3xl border border-[#d97d93]/35 shadow-[0_15px_35px_rgba(36,30,22,0.06)] hover:shadow-2xl transition-all max-w-sm sm:max-w-md w-full relative group"
      >
        {/* Playful Floating Stamp Badge */}
        <div className="absolute -top-3.5 left-6 z-20">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-raleway font-black tracking-wider uppercase border shadow-xs ${popup.tagColor}`}
          >
            {popup.badge}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {/* Mini Polaroid Frame */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-[#d97d93]/20 bg-[#fdfaf5] shadow-inner">
            <img
              src={popup.image}
              alt={popup.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 pr-1">
            <h4 className="font-forum text-lg sm:text-xl text-[#241e16] font-normal leading-tight group-hover:text-[#c95874] transition-colors truncate">
              {popup.title}
            </h4>
            <p className="font-signature text-base sm:text-lg text-[#7d7265] mt-1 leading-snug line-clamp-2">
              {popup.subtitle}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] font-mono uppercase text-[#d4af37] font-semibold tracking-wider">
                Tap to celebrate ✦
              </span>
              <Heart className="w-3 h-3 text-[#c95874] fill-[#c95874] animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ScrollyStickers() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden hidden xl:block">
      {/* Floating Interactive Stamps on Left Margin */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ margin: "-100px" }}
        className="absolute top-1/4 left-6 pointer-events-auto cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 6 }}
        onClick={() => {
          confetti({ particleCount: 30, spread: 50, origin: { x: 0.1, y: 0.3 } });
        }}
      >
        <div className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#d97d93]/30 shadow-md text-center">
          <span className="text-xl block">👑</span>
          <span className="text-[10px] font-raleway font-bold uppercase tracking-widest text-[#c95874]">
            Harleen 4 Life
          </span>
        </div>
      </motion.div>

      {/* Floating Interactive Stamps on Right Margin */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.85, x: 0 }}
        viewport={{ margin: "-100px" }}
        className="absolute top-2/3 right-6 pointer-events-auto cursor-pointer"
        whileHover={{ scale: 1.1, rotate: -6 }}
        onClick={() => {
          confetti({ particleCount: 30, spread: 50, origin: { x: 0.9, y: 0.7 } });
        }}
      >
        <div className="px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#d4af37]/40 shadow-md text-center">
          <span className="text-xl block">💖</span>
          <span className="text-[10px] font-raleway font-bold uppercase tracking-widest text-[#d4af37]">
            Feb 16 Forever
          </span>
        </div>
      </motion.div>
    </div>
  );
}
