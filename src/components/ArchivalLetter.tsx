"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Heart } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function ArchivalLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Editorial Header */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
          An Intimate Epistle
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-2 leading-relaxed">
          &ldquo;Written straight from my heart. Tap the golden wax seal to unseal.&rdquo;
        </p>
      </div>

      {/* THE ARCHIVAL ENVELOPE */}
      <div className="w-full flex justify-center py-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative w-full max-w-md h-64 sm:h-72 cursor-pointer select-none filter drop-shadow-[0_20px_45px_rgba(36,30,22,0.08)]"
        >
          {/* Main Envelope Body */}
          <div className="absolute inset-0 rounded-3xl bg-[#fdfaf5] p-0.5 shadow-xl border border-[#d97d93]/35 overflow-hidden">
            <div className="absolute inset-2.5 rounded-2xl border border-[#d4af37]/30 pointer-events-none" />
          </div>

          {/* Envelope Pocket */}
          <div className="absolute inset-x-3 bottom-3 h-44 rounded-2xl bg-white shadow-inner border border-[#d97d93]/25" />

          {/* Flap */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#fdfaf5] to-[#f7eedf] rounded-t-3xl border-b border-[#d97d93]/30 shadow-xs" />

          {/* Center Golden Wax Seal */}
          <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#f3e5ab] p-1 shadow-lg border border-[#f3e5ab] flex items-center justify-center hover:scale-110 transition-transform">
              <div className="w-full h-full rounded-full border border-amber-900/30 flex flex-col items-center justify-center text-amber-950 font-serif font-black shadow-inner">
                <Heart className="w-5 h-5 text-amber-950 fill-amber-950/40" />
                <span className="text-[7px] uppercase tracking-widest font-extrabold -mt-0.5">
                  16 FEB
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-raleway font-bold tracking-[0.25em] text-[#7d7265] mt-3">
              Tap to open
            </span>
          </div>

          {/* Recipient Letterhead */}
          <div className="absolute bottom-6 inset-x-8 text-center pointer-events-none">
            <span className="font-signature text-3xl sm:text-4xl text-[#c95874]">
              For Harleen
            </span>
            <p className="font-raleway text-[10px] tracking-[0.25em] text-[#7d7265] uppercase font-semibold mt-1">
              The Only Person I Adore
            </p>
          </div>
        </motion.div>
      </div>

      {/* POPUP LETTER MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full my-8 bg-[#fdfaf5] p-8 sm:p-14 rounded-3xl border border-[#d97d93]/35 shadow-2xl text-[#241e16]"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white hover:bg-neutral-100 text-[#241e16] border border-[#d97d93]/30 flex items-center justify-center transition-all shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8 border-b border-[#d97d93]/20 pb-6">
                <span className="text-[10px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] font-semibold block mb-2">
                  {BIRTHDAY_CONFIG.letter.subtitle}
                </span>
                <h3 className="font-forum text-2xl sm:text-3xl text-[#241e16] uppercase tracking-[0.06em]">
                  {BIRTHDAY_CONFIG.letter.title}
                </h3>
              </div>

              {/* Letter Content */}
              <div className="font-raleway text-sm sm:text-base text-[#241e16] leading-relaxed whitespace-pre-line space-y-4 max-h-[60vh] overflow-y-auto pr-3 font-medium">
                {BIRTHDAY_CONFIG.letter.body}
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-6 border-t border-[#d97d93]/20 flex flex-col items-end">
                <span className="font-signature text-3xl text-[#c95874]">
                  {BIRTHDAY_CONFIG.letter.signoff}
                </span>
                <span className="font-raleway text-[10px] tracking-[0.25em] text-[#7d7265] uppercase font-bold mt-1">
                  harleen 4 life
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
