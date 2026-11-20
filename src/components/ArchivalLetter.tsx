"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, X, Heart } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function ArchivalLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200 text-xs font-serif tracking-wider uppercase mb-3">
          <Mail className="w-3.5 h-3.5 text-amber-300" />
          <span>A Private Archival Note</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
          A Letter Written at Midnight 🌙
        </h2>
        <p className="font-hand text-xl sm:text-2xl text-rose-200/80 mt-2 italic">
          Tap the gold seal to unseal the parchment...
        </p>
      </div>

      {/* THE ARCHIVAL ENVELOPE (Editorial Noir Charcoal with Gold Accents) */}
      <div className="w-full flex justify-center py-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative w-full max-w-md h-64 sm:h-72 cursor-pointer select-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Main Envelope Body */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#1a1422] to-[#0d0912] p-0.5 shadow-2xl border border-amber-300/30 overflow-hidden">
            {/* Shimmer line */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-200/10 to-transparent pointer-events-none" />

            {/* Gold Leaf Border Inset */}
            <div className="absolute inset-2.5 rounded-2xl border border-amber-300/20 pointer-events-none" />
          </div>

          {/* Envelope Flap Illusion */}
          <div
            className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#241c30] to-[#140e1c] rounded-t-3xl border-b border-amber-300/30 shadow-lg"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />

          {/* GOLD WAX MONOGRAM SEAL */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-200 shadow-[0_0_30px_rgba(253,224,71,0.5)] border-2 border-amber-100 flex items-center justify-center z-10"
          >
            <div className="w-12 h-12 rounded-full border border-amber-600/40 flex items-center justify-center bg-amber-400/90 text-neutral-900 font-serif font-black text-xl shadow-inner">
              H
            </div>
          </motion.div>

          {/* Helper Tag */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#120d18] border border-amber-300/40 text-[11px] font-semibold text-amber-200 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Tap gold seal to read</span>
          </div>
        </motion.div>
      </div>

      {/* FULLSCREEN LETTER PARCHMENT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] rounded-3xl bg-[#0f0c14] p-6 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] border border-amber-300/30 overflow-y-auto text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="Close Letter"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Letter Header */}
              <div className="text-center pb-5 border-b border-white/10 mb-6">
                <span className="text-amber-300 text-xl">✦ ✦ ✦</span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {BIRTHDAY_CONFIG.letter.title}
                </h3>
                <p className="font-sans text-xs text-amber-200/80 mt-1 uppercase tracking-widest font-mono">
                  {BIRTHDAY_CONFIG.letter.subtitle}
                </p>
              </div>

              {/* Letter Body */}
              <div className="font-hand text-xl sm:text-2xl text-rose-100/90 leading-relaxed whitespace-pre-wrap px-2">
                {BIRTHDAY_CONFIG.letter.body}
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-5 border-t border-white/10 flex flex-col items-end px-2">
                <span className="font-hand text-xl text-rose-300/70">
                  {BIRTHDAY_CONFIG.letter.signoff}
                </span>
                <span className="font-serif font-bold text-lg text-amber-200 mt-1">
                  Cigarettes After Sex • K. ✨
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
