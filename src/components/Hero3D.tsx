"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Disc3,
  Award,
  Film,
  Mail,
  Lock,
  MessageSquare,
  ArrowDown,
  Compass,
  Star,
  Crown,
  Flame,
} from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function Hero3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [medallionFlipped, setMedallionFlipped] = useState(false);
  const [confettiCount, setConfettiCount] = useState(0);

  // Mouse tilt physics for 3D card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);

  // Specular light reflection gradient position
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Interactive 3D Medallion click handler
  const handleMedallionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMedallionFlipped((prev) => !prev);
    setConfettiCount((c) => c + 1);

    // Burst of celestial confetti
    confetti({
      particleCount: 50,
      spread: 70,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#d97d93", "#d4af37", "#f43f5e", "#fbbf24", "#8b5cf6", "#ffffff"],
    });
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 sm:pt-20 pb-20 flex flex-col items-center text-center">
      {/* 3D Atmospheric Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-rose-400/25 via-pink-300/20 to-amber-300/25 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-bl from-purple-400/20 via-violet-300/20 to-rose-300/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "7s" }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-amber-300/20 via-rose-300/20 to-indigo-300/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s" }}
        />
      </div>

      {/* Chapter Indicator Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#d97d93]/35 shadow-md shadow-rose-950/5 text-[#c95874] text-[10px] sm:text-xs font-raleway font-bold tracking-[0.28em] uppercase mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: "12s" }} />
        <span>ISSUE 16 • AN ETERNAL ODE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        <Heart className="w-3.5 h-3.5 text-[#c95874] fill-[#c95874]" />
      </motion.div>

      {/* 3D PERSPECTIVE HERO CARD STAGE */}
      <div
        className="w-full max-w-4xl perspective-[1200px] mb-8"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-3xl p-8 sm:p-14 md:p-16 transition-shadow duration-500 overflow-hidden bg-gradient-to-br from-white/95 via-[#fff8f6]/90 to-[#fdf2f4]/85 border border-[#d97d93]/30 shadow-[0_20px_70px_rgba(201,88,116,0.12)] hover:shadow-[0_30px_90px_rgba(201,88,116,0.22)] backdrop-blur-xl"
        >
          {/* Dynamic 3D Specular Light Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 350px at ${isHovered ? "50%" : "50%"} 40%, rgba(255,255,255,0.85), transparent 70%)`,
            }}
          />

          {/* Golden Filigree Corner Accents */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-lg pointer-events-none" />

          {/* 3D Floating Interactive Birthday Medallion / Compass */}
          <div
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 cursor-pointer group"
            onClick={handleMedallionClick}
            style={{ transform: "translateZ(45px)" }}
            title="Click to flip the 3D talisman!"
          >
            <motion.div
              animate={{ rotateY: medallionFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] via-[#fbbf24] to-[#f43f5e] shadow-lg shadow-amber-500/25 flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Face: 16 */}
              <div
                className="absolute inset-0.5 rounded-full bg-white flex flex-col items-center justify-center text-center backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Crown className="w-3 h-3 text-[#d4af37]" />
                <span className="font-forum font-bold text-xs sm:text-sm text-[#241e16] leading-none">16</span>
              </div>
              {/* Back Face: Heart */}
              <div
                className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex flex-col items-center justify-center text-white backface-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
              </div>
            </motion.div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase tracking-wider text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
              {medallionFlipped ? "Forever" : "Flip Me"}
            </span>
          </div>

          {/* 3D Floating Left Badge: Date & Radiance */}
          <div
            className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#d97d93]/30 shadow-xs"
            style={{ transform: "translateZ(35px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-[#7d7265]">
              FEB 16 • RADIANCE 100%
            </span>
          </div>

          {/* LAYER 1 (Depth: 25px): Floating Ethereal Aura Rings */}
          <div
            className="relative flex flex-col items-center"
            style={{ transform: "translateZ(25px)" }}
          >
            {/* Grand Signature Calligraphy */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative select-none my-2"
            >
              <span className="font-signature text-7xl sm:text-9xl md:text-[10.5rem] bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] bg-clip-text text-transparent leading-none drop-shadow-[0_10px_25px_rgba(201,88,116,0.25)] block">
                Harleen
              </span>
              <span className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 text-[#d4af37] text-2xl sm:text-3xl animate-bounce">
                ✦
              </span>
            </motion.div>
          </div>

          {/* LAYER 2 (Depth: 55px): Grand Redesigned Headline */}
          <div
            className="relative flex flex-col items-center mt-2"
            style={{ transform: "translateZ(55px)" }}
          >
            {/* Roman Editorial Title replacing 'The Only One I Adore' */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-forum text-3xl sm:text-5xl md:text-7xl uppercase tracking-[0.06em] text-[#241e16] font-normal leading-[1.1] max-w-3xl"
            >
              An Ode To My{" "}
              <span className="relative inline-block font-medium">
                <span className="bg-gradient-to-r from-[#c95874] via-[#e11d48] to-[#d4af37] bg-clip-text text-transparent">
                  Entire Universe
                </span>
                <motion.span
                  className="absolute left-0 bottom-1 w-full h-[3px] bg-gradient-to-r from-rose-400 via-amber-300 to-violet-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </motion.h1>

            {/* Sub-headline Pill: Sixteen Celestial Years of You */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-purple-500/10 border border-[#d97d93]/35 text-[#c95874] text-xs sm:text-sm font-raleway font-bold tracking-[0.2em] uppercase"
            >
              <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
              <span>Sixteen Celestial Years of You</span>
              <Star className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            </motion.div>

            {/* Delicate Poetic Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="font-signature text-2xl sm:text-4xl text-[#6b5e51] max-w-2xl mt-5 leading-relaxed"
            >
              &ldquo;In all of space and time, across every star and lifetime, you are the sweetest poetry the universe ever wrote.&rdquo;
            </motion.p>
          </div>

          {/* LAYER 3 (Depth: 75px): 3D Shimmering Feature Badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-[#d97d93]/20"
            style={{ transform: "translateZ(75px)" }}
          >
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#d4af37]/40 shadow-xs text-xs font-raleway text-[#241e16]">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span className="font-semibold">35 Rare Archives</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-rose-300/40 shadow-xs text-xs font-raleway text-[#241e16]">
              <Heart className="w-3 h-3 text-[#f43f5e] fill-[#f43f5e]" />
              <span className="font-semibold">16 Love Chronicles</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-purple-300/40 shadow-xs text-xs font-raleway text-[#241e16]">
              <Disc3 className="w-3 h-3 text-[#8b5cf6]" />
              <span className="font-semibold">CAS &ldquo;K.&rdquo; 33 RPM</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUICK JUMP DIRECTORY / THEMED CHAPTER PORTALS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="w-full max-w-4xl flex flex-col items-center"
      >
        <span className="text-[10px] font-raleway font-bold uppercase tracking-[0.25em] text-[#7d7265] mb-3">
          ✦ DIRECT PORTAL TELEPORT ✦
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <a
            href="#memories"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-md shadow-rose-500/25 cursor-pointer"
          >
            <Film className="w-3.5 h-3.5" />
            <span>01. Curated Photo Galleries (35)</span>
          </a>

          <a
            href="#sound"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <Disc3 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>02. CAS Vinyl Chamber</span>
          </a>

          <a
            href="#reasons"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>03. 16 Reasons</span>
          </a>

          <a
            href="#ritual"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>04. Midnight Candle</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#d97d93]" />
            <span>05. Sealed Epistle</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>06. Secret Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#fff9f8] border border-[#d97d93]/35 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#c95874]" />
            <span>07. Notes Wall</span>
          </a>
        </div>
      </motion.div>

      {/* Gentle Scroll Prompt */}
      <div className="flex flex-col items-center gap-1.5 mt-14 text-[#7d7265]/70 text-[10px] font-raleway tracking-[0.25em] uppercase">
        <span>Scroll to explore her universe</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#c95874]" />
      </div>
    </section>
  );
}
