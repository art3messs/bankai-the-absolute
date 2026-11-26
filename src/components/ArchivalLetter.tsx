"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";

const emptySubscribe = () => () => {};

export default function ArchivalLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const handleOpenLetter = () => {
    setIsOpen(true);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#F6E5B6", "#FFF9FA"],
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.letter.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.letter.subtitle}&rdquo;
      </p>

      {/* PARIS AIR VELLUM ENVELOPE WITH GOLDEN WAX SEAL */}
      <div className="w-full max-w-md mt-7" style={{ perspective: 1000 }}>
        <motion.div
          role="button"
          tabIndex={0}
          onClick={handleOpenLetter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpenLetter();
            }
          }}
          whileHover={{ scale: 1.02, rotateX: 3 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full h-72 sm:h-80 cursor-pointer select-none rounded-[28px] shadow-[0_28px_60px_rgba(43,21,36,0.16)] group transform-3d outline-hidden focus-visible:ring-2 focus-visible:ring-strawberry"
        >
          {/* Main Envelope Body */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#FFFDFD] via-[#FFF6F7] to-[#FCEAF0] border border-gold/40 overflow-hidden">
            {/* Air Mail Dashed Gold Heirloom Frame */}
            <div className="absolute inset-3 rounded-[20px] border border-dashed border-gold/45 pointer-events-none" />
          </div>

          {/* Vintage Postage Stamp */}
          <div className="absolute top-6 right-7 w-14 h-16 rounded-md border-2 border-dashed border-strawberry/50 bg-rose-50/90 p-1 flex flex-col items-center justify-center text-center rotate-3 shadow-xs pointer-events-none">
            <span className="text-[7px] font-mono uppercase tracking-widest text-strawberry font-bold">
              Paris Air
            </span>
            <Heart className="w-4 h-4 text-strawberry fill-strawberry my-0.5" />
            <span className="text-[7px] font-mono text-mauve">16 Feb</span>
          </div>

          {/* Envelope Flap */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#FBF4EB] to-[#F5E6DC] rounded-t-[28px] border-b border-gold/35 shadow-xs pointer-events-none" />

          {/* 3D Champagne Gold Wax Seal Medallion */}
          <div
            className="absolute top-32 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
            style={{ transform: "translateZ(40px)" }}
          >
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#A97B23] via-[#D4AF37] to-[#FFF2BE] p-1 shadow-[0_10px_25px_rgba(43,21,36,0.28)] border border-gold-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12"
              />
              <div className="w-full h-full rounded-full border border-amber-950/25 flex flex-col items-center justify-center text-amber-950 shadow-inner">
                <Heart className="w-5 h-5 text-strawberry fill-strawberry" />
                <span className="text-[7px] uppercase tracking-widest font-sans font-extrabold mt-0.5">
                  Pucchi
                </span>
              </div>
            </div>
            <span className="text-[11px] font-sans font-semibold text-strawberry mt-3 tracking-wide">
              ✦ {COPY.letter.waxSealPrompt} ✦
            </span>
          </div>

          {/* Recipient Calligraphy */}
          <div className="absolute bottom-6 inset-x-8 text-center pointer-events-none">
            <span className="font-hand text-3xl sm:text-4xl text-foil block leading-none">
              For Harleen
            </span>
            <p className="font-sans text-[10px] tracking-[0.22em] text-mauve uppercase font-semibold mt-1.5">
              16 February • Hand-Sealed With Love
            </p>
          </div>
        </motion.div>
      </div>

      {/* UNSEALED PARCHMENT LETTER MODAL (Portalled above all sections) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={COPY.letter.letterTitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-md overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.92, y: 24, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.92, y: 24, opacity: 0 }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-full my-auto max-h-[calc(100dvh-2.5rem)] overflow-y-auto bg-[#FDF9F5] rounded-[28px] border-2 border-gold/45 shadow-2xl p-6 sm:p-10 text-left text-ink"
                >
                  {/* Subtle Translucent Slow-Motion Crimson Silk Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[26px]">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/media/vid-red-silk-reveal-poster.jpg"
                      src="/media/vid-red-silk-reveal.mp4"
                      className="w-full h-full object-cover object-center opacity-15 blur-[0.5px] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FDF9F5]/92 via-[#FDF9F5]/86 to-[#FDF9F5]/94 backdrop-blur-[1px]" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="sticky top-0 float-right w-10 h-10 rounded-full bg-paper/90 hover:bg-mauve/10 text-ink border border-gold/30 flex items-center justify-center transition-colors cursor-pointer z-20"
                    title="Close letter"
                    aria-label="Close letter"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative z-10 border-b border-gold/25 pb-4 mb-6 pr-10">
                    <span className="text-xs font-sans text-mauve block mb-1">
                      {COPY.letter.letterDateSubtitle}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                      {COPY.letter.letterTitle}
                    </h3>
                  </div>

                  <div className="relative z-10 font-sans text-sm sm:text-base leading-relaxed text-ink/90 space-y-4 max-w-prose">
                    <p className="font-semibold text-ink">{COPY.letter.salutation}</p>
                    <p className="first-letter:font-serif first-letter:text-4xl first-letter:float-left first-letter:mr-2.5 first-letter:leading-none first-letter:text-strawberry">
                      {COPY.letter.paragraph1}
                    </p>
                    <p>{COPY.letter.paragraph2}</p>
                    <p>{COPY.letter.paragraph3}</p>
                    <p>{COPY.letter.paragraph4}</p>
                    <p>{COPY.letter.paragraph5}</p>
                    <p className="font-semibold text-ink">{COPY.letter.paragraph6}</p>
                    <p className="pt-2 text-strawberry font-semibold">{COPY.letter.closingGreeting}</p>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-gold/25">
                    <p className="font-sans text-xs text-mauve uppercase tracking-wider font-semibold">
                      {COPY.letter.signoff}
                    </p>
                    <span className="font-hand text-4xl sm:text-5xl text-foil block mt-1">
                      Harleen 4 Life 🤍
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
