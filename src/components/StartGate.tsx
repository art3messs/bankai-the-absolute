"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const handleStart = () => {
    // Fire celebratory confetti on entry
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
    });
    onStart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2a0b1c] via-[#1a0511] to-[#0c0208] text-center select-none"
        >
          {/* Ambient Glowing Blobs */}
          <div className="absolute w-[28rem] h-[28rem] bg-pink-500/20 rounded-full blur-[140px] pointer-events-none animate-pink-pulse" />
          <div className="absolute w-80 h-80 bg-rose-500/15 rounded-full blur-[110px] pointer-events-none -bottom-20 animate-pink-pulse" />

          {/* Center Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel-glow p-8 md:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-pink-300/40 relative z-10 shadow-[0_0_80px_rgba(255,105,180,0.25)]"
          >
            {/* Crown / Flower Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-xl mb-6 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-pink-950/70 flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-300 fill-pink-400/50 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-md mb-2">
              For {recipientName} 🌸
            </h1>

            <p className="font-hand text-xl md:text-2xl text-pink-200/90 mb-6">
              A little digital universe created just for your birthday...
            </p>

            {/* Enter Button */}
            <button
              onClick={handleStart}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white font-bold text-base md:text-lg shadow-[0_0_30px_rgba(255,75,145,0.6)] hover:shadow-[0_0_45px_rgba(255,75,145,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>Tap to Enter 🎶✨</span>
              <Sparkles className="w-5 h-5 text-amber-200 group-hover:-rotate-12 transition-transform" />
            </button>

            <span className="text-xs text-pink-300/60 mt-4">
              Turn your sound on for the best experience 🎧
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
