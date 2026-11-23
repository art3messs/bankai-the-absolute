"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";

export default function ArchivalLetter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenLetter = () => {
    setIsOpen(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.5 },
      colors: ["#D4285A", "#F4B9C9", "#FFF9FA", "#8A5A6E"],
    });
  };

  return (
    <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-10 flex flex-col items-center text-center">
      {/* Header in sentence case */}
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.letter.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.letter.subtitle}&rdquo;
      </p>

      {/* ENVELOPE CARD */}
      <div className="w-full max-w-md mt-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenLetter}
          className="relative w-full h-64 sm:h-72 cursor-pointer select-none rounded-3xl bg-paper p-6 border border-mauve/25 shadow-md flex flex-col justify-between items-center group"
        >
          <div className="w-full flex justify-between items-center text-xs font-sans text-mauve">
            <span>For Harleen</span>
            <span>16 February</span>
          </div>

          {/* Strawberry Wax Seal Button */}
          <div className="w-16 h-16 rounded-full bg-strawberry text-paper flex flex-col items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-paper" />
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider mt-0.5">
              Pucchi
            </span>
          </div>

          <span className="text-xs font-sans text-strawberry font-semibold">
            {COPY.letter.waxSealPrompt}
          </span>
        </motion.div>
      </div>

      {/* LETTER MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-xl w-full max-h-[calc(100dvh-3rem)] overflow-y-auto bg-paper rounded-3xl border border-mauve/20 shadow-2xl p-6 sm:p-10 text-left text-ink"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full hover:bg-mauve/10 text-ink flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-mauve/15 pb-4 mb-6">
                <span className="text-xs font-sans text-mauve block mb-1">
                  {COPY.letter.letterDateSubtitle}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                  {COPY.letter.letterTitle}
                </h3>
              </div>

              {/* Letter Body: Left-aligned, lines under 70 characters */}
              <div className="font-sans text-sm sm:text-base leading-relaxed text-ink/90 space-y-4 max-w-prose">
                <p>{COPY.letter.salutation}</p>
                <p>{COPY.letter.paragraph1}</p>
                <p>{COPY.letter.paragraph2}</p>
                <p>{COPY.letter.paragraph3}</p>
                <p>{COPY.letter.paragraph4}</p>
                <p>{COPY.letter.paragraph5}</p>
                <p className="font-semibold text-ink">{COPY.letter.paragraph6}</p>
                <p className="pt-2 text-strawberry font-semibold">{COPY.letter.closingGreeting}</p>
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-6 border-t border-mauve/15">
                <p className="font-sans text-xs text-mauve uppercase tracking-wider font-semibold">
                  {COPY.letter.signoff}
                </p>
                <span className="font-hand text-3xl sm:text-4xl text-ink block mt-1">
                  Harleen 4 Life 🤍
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
