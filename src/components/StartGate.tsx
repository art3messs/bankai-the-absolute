"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Disc3, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const handleStart = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
    });
    onStart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#fff6f8] via-[#faf2f5] to-[#f6ecf0] text-center select-none"
        >
          {/* Luminous Glow Behind */}
          <div className="absolute w-[32rem] h-[32rem] bg-rose-300/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute w-80 h-80 bg-amber-200/40 rounded-full blur-[110px] pointer-events-none -bottom-10" />

          {/* Central Gate Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-pearl-glow p-8 sm:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-amber-300/40 relative z-10 shadow-[0_25px_60px_rgba(255,105,180,0.15)]"
          >
            {/* Spinning Vinyl & Heart Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-xl mb-6 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-pink-500 animate-spin" style={{ animationDuration: "10s" }} />
              </div>
            </div>

            {/* Subtitle Badge */}
            <span className="px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300/50 text-[11px] uppercase tracking-[0.2em] text-amber-900 font-mono font-bold mb-3 shadow-xs">
              Cigarettes After Sex • K.
            </span>

            {/* Title */}
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#2e1322] tracking-tight mb-2">
              For {recipientName} 🌸
            </h1>

            <p className="font-hand text-2xl text-rose-600/90 mb-8">
              I created this little universe just for you, because you are the only one I adore...
            </p>

            {/* Enter Button with Gold Pop */}
            <button
              onClick={handleStart}
              className="group relative px-9 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-white font-extrabold text-base shadow-[0_10px_35px_rgba(255,75,145,0.4)] hover:shadow-[0_15px_45px_rgba(255,75,145,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Step Inside & Listen 🎶</span>
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
            </button>

            <span className="text-xs text-rose-800/60 mt-5 font-sans">
              Headphones on for the best experience 🎧
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
