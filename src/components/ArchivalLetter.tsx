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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Mail className="w-3.5 h-3.5 text-amber-500" />
          <span>A Private Letter from the Heart</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#2e1322] drop-shadow-xs">
          A Letter for You, Harleen 💌
        </h2>
        <p className="font-hand text-2xl text-rose-600/90 mt-2">
          Tap the golden wax seal to unseal the letter...
        </p>
      </div>

      {/* THE ARCHIVAL ENVELOPE (Luminous Rose-Blush & Gold Accent) */}
      <div className="w-full flex justify-center py-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative w-full max-w-md h-64 sm:h-72 cursor-pointer select-none filter drop-shadow-[0_20px_45px_rgba(255,105,180,0.2)]"
        >
          {/* Main Envelope Body */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#ffccd5] via-[#ffb3c1] to-[#ff8fab] p-0.5 shadow-xl border-2 border-white overflow-hidden">
            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Inner Gold Foil Border Inset */}
            <div className="absolute inset-2.5 rounded-2xl border border-amber-300/40 pointer-events-none" />
          </div>

          {/* Envelope Pocket */}
          <div className="absolute inset-x-3 bottom-3 h-44 rounded-2xl bg-gradient-to-b from-white to-[#fff0f3] shadow-inner border border-pink-200/80" />

          {/* Flap */}
          <div
            className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#fff5f7] to-[#ffd1dc] rounded-t-3xl border-b border-pink-300/50 shadow-md"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          />

          {/* GOLD WAX MONOGRAM SEAL (H) */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-200 shadow-[0_0_30px_rgba(251,191,36,0.6)] border-2 border-white flex items-center justify-center z-10"
          >
            <div className="w-12 h-12 rounded-full border border-amber-500/40 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-400 text-neutral-900 font-serif font-black text-xl shadow-inner">
              H
            </div>
          </motion.div>

          {/* Helper Tag */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white shadow-md border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[85vh] rounded-3xl bg-[#fffefc] p-6 sm:p-10 shadow-2xl border-2 border-pink-200 overflow-y-auto text-[#2b1220]"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-800 flex items-center justify-center transition-all shadow-xs active:scale-95"
                title="Close Letter"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-5 border-b border-pink-100 mb-6">
                <span className="text-amber-500 text-xl">✦ ✦ ✦</span>
                <h3 className="font-serif text-3xl font-extrabold text-rose-900 mt-1">
                  {BIRTHDAY_CONFIG.letter.title}
                </h3>
                <p className="font-sans text-xs text-amber-700 font-bold uppercase tracking-wider mt-1">
                  {BIRTHDAY_CONFIG.letter.subtitle}
                </p>
              </div>

              <div className="font-hand text-2xl text-gray-800 leading-relaxed whitespace-pre-wrap px-2">
                {BIRTHDAY_CONFIG.letter.body}
              </div>

              <div className="mt-8 pt-5 border-t border-pink-100 flex flex-col items-end px-2">
                <span className="font-hand text-xl text-gray-600">
                  {BIRTHDAY_CONFIG.letter.signoff}
                </span>
                <span className="font-serif font-bold text-lg text-rose-800 mt-1">
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
