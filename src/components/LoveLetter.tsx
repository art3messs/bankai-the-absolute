"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart, Sparkles, X, HeartHandshake } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-xs font-semibold tracking-wider uppercase mb-3">
          <Mail className="w-3.5 h-3.5 text-pink-300" />
          <span>A Special Keepsake</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
          A Letter for You, Harleen 💌
        </h2>
        <p className="font-hand text-xl sm:text-2xl text-pink-200/90 mt-2">
          Tap the wax seal to break it open and read what is inside...
        </p>
      </div>

      {/* THE INTERACTIVE 3D ENVELOPE */}
      <div className="w-full flex justify-center py-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative w-full max-w-md h-64 sm:h-72 cursor-pointer select-none filter drop-shadow-[0_25px_50px_rgba(255,105,180,0.25)]"
        >
          {/* Base Envelope Body (Soft Blush & Rose Gradient) */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#ffccd5] via-[#ffb3c1] to-[#ff8fab] p-0.5 shadow-2xl border border-pink-100/70 overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none" />

            {/* Subtle Polka-Dot Texture */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ff4d6d_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Ribbon Accent */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-pink-400/50 via-rose-400/80 to-pink-400/50 shadow-sm" />
          </div>

          {/* Envelope Pocket Cutout */}
          <div className="absolute inset-x-3 bottom-3 h-44 rounded-2xl bg-gradient-to-b from-[#fff0f3] to-[#ffe5ec] shadow-inner border border-pink-200/60" />

          {/* Top Flap (Triangular Folding Illusion) */}
          <div
            className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#fff5f7] to-[#ffd1dc] rounded-t-3xl border-b border-pink-300/40 shadow-md"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />

          {/* WAX SEAL (Centered) */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 shadow-[0_8px_25px_rgba(225,29,72,0.6)] border-2 border-rose-300/60 flex items-center justify-center z-10 group"
          >
            <div className="w-12 h-12 rounded-full border border-rose-400/50 flex items-center justify-center bg-rose-700/40">
              <Heart className="w-6 h-6 text-pink-100 fill-pink-200 drop-shadow" />
            </div>
            <span className="sr-only">Open Letter</span>
          </motion.div>

          {/* Helper Tag */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-pink-950/80 backdrop-blur-md border border-pink-400/40 text-[11px] font-semibold text-pink-200 shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-pink-300" />
            <span>Tap seal to open letter</span>
          </div>
        </motion.div>
      </div>

      {/* FULLSCREEN UNFOLDED LETTER MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] rounded-3xl bg-[#fdfbf7] p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-pink-200/80 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="Close Letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative Letter Header */}
              <div className="text-center pb-4 border-b border-pink-200/60 mb-6">
                <span className="text-2xl">🌸</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-pink-900 mt-1">
                  {BIRTHDAY_CONFIG.letter.title}
                </h3>
                <p className="font-hand text-lg text-pink-700/80 mt-0.5">
                  {BIRTHDAY_CONFIG.letter.subtitle}
                </p>
              </div>

              {/* Handwritten Letter Body */}
              <div className="font-hand text-xl sm:text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap px-2">
                {BIRTHDAY_CONFIG.letter.body}
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-4 border-t border-pink-200/60 flex flex-col items-end px-2">
                <span className="font-hand text-xl text-gray-600">
                  {BIRTHDAY_CONFIG.letter.signoff}
                </span>
                <span className="font-serif font-bold text-lg text-pink-900 mt-1">
                  Always & Forever ✨
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
