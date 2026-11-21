"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, Heart, Sparkles } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function ArchivalLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Editorial Header */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
          An Intimate Birthday Epistle
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-2 leading-relaxed">
          &ldquo;Written straight from my heart. Tap the golden wax seal to unseal.&rdquo;
        </p>
      </div>

      {/* THE ARCHIVAL LUXURY ENVELOPE (OUTSIDE) */}
      <div className="w-full flex justify-center py-4">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="relative w-full max-w-md h-72 sm:h-80 cursor-pointer select-none filter drop-shadow-[0_25px_60px_rgba(36,30,22,0.12)] group"
        >
          {/* Main Envelope Body */}
          <div className="absolute inset-0 rounded-3xl bg-[#fdfaf5] p-1 shadow-2xl border-2 border-[#d97d93]/40 overflow-hidden">
            {/* Air Mail Vintage Border Accents */}
            <div className="absolute inset-3 rounded-2xl border border-dashed border-[#d4af37]/40 pointer-events-none" />
          </div>

          {/* Postal Stamp Badge */}
          <div className="absolute top-6 right-8 w-14 h-16 rounded-md border-2 border-dashed border-[#c95874]/60 bg-rose-50/80 p-1 flex flex-col items-center justify-center text-center rotate-3 shadow-xs">
            <span className="text-[7px] font-mono uppercase tracking-widest text-[#c95874] font-bold">PARIS AIR</span>
            <Heart className="w-4 h-4 text-[#c95874] fill-[#c95874] my-0.5" />
            <span className="text-[7px] font-mono text-[#7d7265]">16 FEB</span>
          </div>

          {/* Envelope Pocket */}
          <div className="absolute inset-x-3 bottom-3 h-52 rounded-2xl bg-white shadow-inner border border-[#d97d93]/30" />

          {/* Envelope Flap */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#fdfaf5] to-[#f5ead9] rounded-t-3xl border-b border-[#d97d93]/35 shadow-sm" />

          {/* Center Golden Wax Seal */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#f3e5ab] p-1 shadow-xl border border-[#f3e5ab] flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-full h-full rounded-full border border-amber-900/30 flex flex-col items-center justify-center text-amber-950 font-serif font-black shadow-inner">
                <Heart className="w-5 h-5 text-amber-950 fill-amber-950/40" />
                <span className="text-[7px] uppercase tracking-widest font-extrabold -mt-0.5">
                  PUCCHI
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-raleway font-bold tracking-[0.25em] text-[#7d7265] mt-3 group-hover:text-[#c95874] transition-colors">
              ✦ Tap Wax Seal To Open ✦
            </span>
          </div>

          {/* Recipient Letterhead */}
          <div className="absolute bottom-6 inset-x-8 text-center pointer-events-none">
            <span className="font-signature text-3xl sm:text-4xl text-[#c95874] block">
              For Harleen
            </span>
            <p className="font-raleway text-[10px] tracking-[0.25em] text-[#7d7265] uppercase font-semibold mt-1">
              My Entire Universe • The Only One I Adore
            </p>
          </div>
        </motion.div>
      </div>

      {/* POPUP LETTER MODAL (INSIDE WITH TRANSPARENT CINEMATIC BACKGROUND) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md select-none overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full my-8 bg-[#fdfaf5] rounded-3xl border-2 border-[#d4af37]/50 shadow-2xl overflow-hidden text-[#241e16]"
            >
              {/* TRANSPARENT CINEMATIC VIDEO & PHOTO BACKGROUND */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/media/vid-red-silk-reveal-poster.jpg"
                  src="/media/vid-red-silk-reveal.mp4"
                  className="w-full h-full object-cover object-center opacity-15 filter blur-[0.5px] scale-105"
                />
                {/* Parchment Warmth Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf5]/90 via-[#fdfaf5]/85 to-[#fdfaf5]/92 backdrop-blur-[2px]" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/90 hover:bg-neutral-100 text-[#241e16] border border-[#d97d93]/30 flex items-center justify-center transition-all shadow-xs cursor-pointer z-20"
                title="Close Letter"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LETTER CONTENT (CRISP HIGH CONTRAST TYPOGRAPHY) */}
              <div className="relative z-10 p-8 sm:p-14">
                {/* Letter Header */}
                <div className="text-center mb-8 border-b border-[#d97d93]/20 pb-6">
                  <span className="text-[10px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] font-semibold block mb-2">
                    {BIRTHDAY_CONFIG.letter.subtitle}
                  </span>
                  <h3 className="font-forum text-2xl sm:text-3xl text-[#241e16] uppercase tracking-[0.06em] leading-snug">
                    {BIRTHDAY_CONFIG.letter.title}
                  </h3>
                </div>

                {/* Letter Body */}
                <div className="font-forum text-base sm:text-lg leading-relaxed text-[#241e16] whitespace-pre-line space-y-4 font-normal">
                  {BIRTHDAY_CONFIG.letter.body}
                </div>

                {/* Sign-off & Signature */}
                <div className="mt-10 pt-6 border-t border-[#d97d93]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="font-raleway text-xs text-[#7d7265] uppercase tracking-wider font-semibold">
                      {BIRTHDAY_CONFIG.letter.signoff}
                    </p>
                    <span className="font-signature text-4xl sm:text-5xl text-[#c95874] block mt-1">
                      Harleen 4 Life 🤍
                    </span>
                  </div>

                  {/* Golden Wax Watermark */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#d4af37]/40 shadow-xs text-xs font-mono text-[#d4af37]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SEALED WITH PUCCHI • 16 FEB</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
