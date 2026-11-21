"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Disc3, Heart, Headphones } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const handleStart = () => {
    confetti({
      particleCount: 80,
      spread: 85,
      origin: { y: 0.55 },
      colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
    });
    onStart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#fdfaf5] text-center select-none"
        >
          {/* Subtle Ambient Nebulae */}
          <div className="absolute w-[36rem] h-[36rem] bg-rose-200/25 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute w-96 h-96 bg-amber-100/40 rounded-full blur-[120px] pointer-events-none -bottom-10" />

          {/* Central Editorial Invitation Card */}
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="editorial-card p-8 sm:p-14 rounded-3xl max-w-lg w-full flex flex-col items-center border border-[#d97d93]/30 relative z-10 shadow-[0_25px_60px_rgba(36,30,22,0.06)]"
          >
            {/* Top Serial / Issue Metadata */}
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] font-semibold mb-6">
              <span>SPECIAL ISSUE</span>
              <span className="text-[#d97d93]">•</span>
              <span>16TH FEBRUARY</span>
              <span className="text-[#d97d93]">•</span>
              <span>N° 2026</span>
            </div>

            {/* Spinning Disc Monogram */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d97d93] via-[#f2ccd6] to-[#d4af37] p-0.5 shadow-lg mb-4 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <Disc3 className="w-7 h-7 text-[#c95874] animate-spin" style={{ animationDuration: "9s" }} />
              </div>
            </div>

            {/* Signature Title */}
            <span className="font-signature text-5xl sm:text-6xl text-[#c95874] leading-tight mb-1 drop-shadow-xs">
              {recipientName}
            </span>

            {/* Antique Roman Serif Subtitle */}
            <h1 className="font-forum text-2xl sm:text-3xl text-[#241e16] tracking-[0.1em] uppercase font-normal mt-2">
              The Only One I Adore
            </h1>

            <p className="font-raleway text-xs sm:text-sm text-[#7d7265] tracking-wide max-w-sm mt-3 mb-8 leading-relaxed">
              An intimate visual storytelling archive curated straight from my heart.
            </p>

            {/* Enter Button with Champagne Gold Accent */}
            <button
              onClick={handleStart}
              className="group relative px-9 py-4 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] hover:opacity-95 text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-[0_12px_35px_rgba(201,88,116,0.35)] hover:shadow-[0_16px_45px_rgba(201,88,116,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Enter The Experience</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Soundtrack & Headphone Tag */}
            <div className="flex items-center gap-2 text-[11px] font-raleway text-[#7d7265] mt-6 tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-[#d97d93]" />
              <span>Soundtrack: Cigarettes After Sex — &ldquo;K.&rdquo;</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
