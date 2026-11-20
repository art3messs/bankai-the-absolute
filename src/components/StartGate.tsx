"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Disc3, Moon } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const handleStart = () => {
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#fde047", "#fef08a", "#e0a4b8", "#f4c2ce", "#ffffff"],
    });
    onStart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0e0a12] via-[#09070c] to-[#040306] text-center select-none film-grain"
        >
          {/* Subtle Backlight */}
          <div className="absolute w-[30rem] h-[30rem] bg-rose-500/10 rounded-full blur-[160px] pointer-events-none animate-breathe" />

          {/* Central Monogram Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="editorial-card p-8 sm:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center border border-white/10 relative z-10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* Spinning CAS Vinyl Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-300 p-0.5 shadow-xl mb-6 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#120d18] flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-amber-200 animate-spin" style={{ animationDuration: "10s" }} />
              </div>
            </div>

            {/* Editorial Title */}
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-mono font-semibold mb-2 block">
              Now Playing • Cigarettes After Sex
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-wide mb-2">
              For {recipientName}
            </h1>

            <p className="font-hand text-xl sm:text-2xl text-rose-200/90 mb-8 italic">
              A private midnight celebration curated for your 16th of February...
            </p>

            {/* Enter Button */}
            <button
              onClick={handleStart}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-base shadow-[0_0_35px_rgba(253,224,71,0.4)] hover:shadow-[0_0_50px_rgba(253,224,71,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Moon className="w-4 h-4 fill-black text-black" />
              <span>Step Inside & Listen 🎶</span>
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
            </button>

            <span className="text-[11px] text-white/40 mt-5 font-mono">
              Best experienced with headphones on 🎧
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
