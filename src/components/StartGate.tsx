"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Disc3, Heart, Headphones, ChevronDown, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const [isUnveiling, setIsUnveiling] = useState(false);

  const handleTriggerStart = () => {
    if (isUnveiling) return;
    setIsUnveiling(true);

    confetti({
      particleCount: 100,
      spread: 95,
      origin: { y: 0.55 },
      colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
    });

    setTimeout(() => {
      onStart();
    }, 600);
  };

  // Scroll / Swipe down listener to unveil the website
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 18) {
        handleTriggerStart();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (startY - e.touches[0].clientY > 25) {
        handleTriggerStart();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen, isUnveiling]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#fdfaf5] select-none overflow-hidden"
        >
          {/* Subtle Atmospheric Glows */}
          <div className="absolute w-[40rem] h-[40rem] bg-rose-200/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute w-[32rem] h-[32rem] bg-amber-100/45 rounded-full blur-[120px] pointer-events-none -bottom-10" />

          {/* Central Editorial Cover */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{
              scale: isUnveiling ? 1.05 : 1,
              y: isUnveiling ? -40 : 0,
              opacity: isUnveiling ? 0 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg flex flex-col items-center"
          >
            {/* Top Serial / Issue Metadata */}
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] font-semibold mb-4">
              <span>SPECIAL ISSUE</span>
              <span className="text-[#d97d93]">•</span>
              <span>16TH FEBRUARY</span>
              <span className="text-[#d97d93]">•</span>
              <span>HARLEEN 4 LIFE</span>
            </div>

            {/* FEATURED COVER PORTRAIT WITH SCROLL-TO-UNVEIL INTERACTION */}
            <div
              onClick={handleTriggerStart}
              className="relative w-full max-w-sm rounded-3xl p-3 bg-white/90 border border-[#d97d93]/35 shadow-[0_20px_50px_rgba(201,88,116,0.18)] cursor-pointer group transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-inner bg-stone-900">
                <img
                  src="/media/harleen-red-feather-dress.jpg"
                  alt="Harleen in Red Feathers"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[1.02] contrast-[1.02]"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25 pointer-events-none" />

                {/* Top Cover Floating Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                    <Disc3 className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: "8s" }} />
                    <span className="text-[10px] tracking-wider uppercase font-medium">CAS • K.</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/80 backdrop-blur-md text-white font-bold text-[10px] tracking-wider uppercase">
                    <Heart className="w-3 h-3 fill-white" />
                    <span>PUCCHI EDITION</span>
                  </div>
                </div>

                {/* Bottom Cover Typography */}
                <div className="absolute bottom-5 inset-x-5 flex flex-col items-center text-center text-white">
                  <span className="font-signature text-4xl sm:text-5xl text-rose-200 drop-shadow-md">
                    {recipientName}
                  </span>
                  <p className="font-forum text-base sm:text-lg uppercase tracking-[0.14em] text-white/95 mt-1 font-light">
                    The Center Of My Universe
                  </p>

                  {/* Dynamic Scroll Prompt on Photo */}
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 shadow-lg text-white text-[11px] font-raleway font-bold uppercase tracking-[0.2em] group-hover:bg-white/35 transition-all">
                    <ArrowDown className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                    <span>Scroll Down On Photo To Enter</span>
                  </div>
                </div>
              </div>

              {/* Golden Filigree Corners */}
              <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/70 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]/70 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]/70 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/70 rounded-br-sm pointer-events-none" />
            </div>

            {/* Click-to-Enter Alternative Button */}
            <button
              onClick={handleTriggerStart}
              className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(201,88,116,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Or Tap To Unveil Website</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            {/* Soundtrack Notice */}
            <div className="flex items-center gap-2 text-[11px] font-raleway text-[#7d7265] mt-4 tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-[#d97d93]" />
              <span>Soundtrack: Cigarettes After Sex — &ldquo;K.&rdquo;</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
