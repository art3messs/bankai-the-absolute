"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowDown, Heart, Eye, Crown, Film } from "lucide-react";

export default function PhotoScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth transforms based on scroll
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.94, 0.88]);
  const clipProgress = useTransform(scrollYProgress, [0.1, 0.75], ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [0.35, 0.1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const revealScale = useTransform(scrollYProgress, [0.3, 0.85], [0.92, 1]);
  const revealOpacity = useTransform(scrollYProgress, [0.25, 0.6], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative z-20 w-full min-h-[220vh] bg-[#fdfaf5] py-10"
    >
      {/* Sticky Stage */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 flex flex-col items-center justify-center">
        {/* Section Header Eyebrow */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d97d93]/35 shadow-xs text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.25em] text-[#c95874] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>INTERACTIVE SCROLL-TO-REVEAL STAGE</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
          <h2 className="font-forum text-2xl sm:text-4xl text-[#241e16] uppercase tracking-[0.06em]">
            Scroll Down On Her Portrait
          </h2>
          <p className="font-signature text-xl sm:text-2xl text-[#7d7265] mt-1">
            &ldquo;As you scroll, the layers of her world unveil before your eyes.&rdquo;
          </p>
        </div>

        {/* The Interactive Scroll-Driven Dual-Layer Photo Container */}
        <div className="relative w-full max-w-2xl aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden border-2 border-[#d97d93]/40 shadow-[0_25px_70px_rgba(36,30,22,0.14)] bg-stone-900 select-none">
          {/* LAYER 2 (Revealed Underneath on Scroll): The Warm Hug & Pucchi Smile */}
          <motion.div
            style={{ scale: revealScale, opacity: revealOpacity }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src="/media/harleen-warm-hug.jpg"
              alt="Harleen Warm Hug"
              className="w-full h-full object-cover object-center filter brightness-[1.03]"
            />
            {/* Romantic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-6 inset-x-6 sm:inset-x-10 text-white flex flex-col items-center text-center">
              <span className="text-[10px] sm:text-xs font-raleway font-bold tracking-[0.3em] uppercase text-amber-200 mb-1">
                ✦ UNVEILED: PURE PEACE & WARMTH ✦
              </span>
              <h3 className="font-signature text-3xl sm:text-5xl text-rose-200">
                Where My Heart Resides
              </h3>
              <p className="font-raleway text-xs sm:text-sm text-stone-200 mt-2 max-w-md leading-relaxed">
                The sweetest soul, my safest haven, and the girl who makes every day worth living. Harleen 4 Life.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase">
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Keep Scrolling To Explore Her Themed Archives</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>
          </motion.div>

          {/* LAYER 1 (Top Cover: Royal Tiara & Polka Glam): Wipes away on scroll */}
          <motion.div
            style={{
              clipPath: clipProgress,
              scale,
            }}
            className="absolute inset-0 w-full h-full z-10"
          >
            <img
              src="/media/ethnic-dragonfly-tiara.jpg"
              alt="Harleen Royal Tiara"
              className="w-full h-full object-cover object-center filter brightness-[1.02]"
            />

            {/* Ambient Darkening */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-black"
            />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-raleway uppercase tracking-widest font-semibold">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>CHAPTER TRANSITION • SCROLL TO UNVEIL</span>
            </div>

            {/* Center / Bottom Scroll Prompt */}
            <motion.div
              style={{ y: textY, opacity: textOpacity }}
              className="absolute bottom-6 inset-x-6 sm:inset-x-10 text-white flex flex-col items-center text-center"
            >
              <span className="font-signature text-4xl sm:text-6xl text-rose-200 drop-shadow-md">
                Royal Elegance
              </span>
              <p className="font-forum text-sm sm:text-lg uppercase tracking-[0.16em] text-white/90 mt-1">
                Scroll down to peel back the curtain
              </p>

              {/* Glowing Downward Scroll Indicator */}
              <div className="mt-4 flex flex-col items-center gap-1">
                <div className="px-5 py-2.5 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/40 shadow-xl flex items-center gap-2 text-white text-xs font-raleway font-bold tracking-[0.2em] uppercase">
                  <span>Scroll Down Directly On Photo</span>
                  <ArrowDown className="w-4 h-4 text-amber-200 animate-bounce" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
