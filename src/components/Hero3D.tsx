"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Disc3,
  Award,
  Film,
  Mail,
  Lock,
  ArrowDown,
  Crown,
  Cake,
  Clock,
  Camera,
  MessageSquare,
} from "lucide-react";

export default function Hero3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [medallionFlipped, setMedallionFlipped] = useState(false);
  const [activePhoto, setActivePhoto] = useState<"feather" | "tiara">("feather");

  // Live countdown to Feb 16
  const [countdown, setCountdown] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const year = now.getFullYear();
      let bday = new Date(year, 1, 16, 0, 0, 0);
      if (now.getTime() > bday.getTime()) {
        bday = new Date(year + 1, 1, 16, 0, 0, 0);
      }
      const diff = bday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tilt physics for 3D card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["20%", "80%"]);
  const glareBackground = useMotionTemplate`radial-gradient(circle 420px at ${glareX} ${glareY}, rgba(255,255,255,0.7), transparent 70%)`;

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

    confetti({
      particleCount: 55,
      spread: 75,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ["#B0295F", "#FFD9E3", "#d4af37", "#f43f5e", "#ffffff"],
    });
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 pt-8 sm:pt-14 pb-16 flex flex-col items-center text-center overflow-hidden">
      {/* 3D Atmospheric Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-[#FFD9E3]/50 to-[#FFF8F5]/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-bl from-[#B0295F]/10 via-[#FFD9E3]/30 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* Chapter Indicator Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#FFD9E3] shadow-xs text-[#B0295F] text-[10px] sm:text-xs font-raleway font-bold tracking-[0.24em] uppercase mb-6 sm:mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: "12s" }} />
        <span>VOLUME 16 • AN UNCONDITIONAL ODE</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#B0295F] animate-ping" />
        <Heart className="w-3.5 h-3.5 text-[#B0295F] fill-[#B0295F]" />
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
          className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-10 md:p-12 transition-shadow duration-500 overflow-hidden bg-gradient-to-br from-white/98 via-[#FFF8F5]/95 to-[#FFD9E3]/25 border border-[#FFD9E3] shadow-[0_20px_60px_rgba(176,41,95,0.08)] hover:shadow-[0_25px_70px_rgba(176,41,95,0.14)] backdrop-blur-xl"
        >
          {/* Dynamic 3D Specular Light Overlay */}
          <motion.div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-45" : "opacity-25"}`}
            style={{
              background: glareBackground,
            }}
          />

          {/* Golden Filigree Corner Accents */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-5 h-5 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr pointer-events-none" />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-5 h-5 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl pointer-events-none" />
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-5 h-5 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br pointer-events-none" />

          {/* 3D Floating Interactive Talisman / Medallion */}
          <div
            className="absolute top-4 right-4 sm:top-7 sm:right-7 z-30 cursor-pointer group"
            onClick={handleMedallionClick}
            style={{ transform: "translateZ(45px)" }}
            title="Tap to flip talisman!"
          >
            <motion.div
              animate={{ rotateY: medallionFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#d4af37] via-[#FFD9E3] to-[#B0295F] shadow-md flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Face: 16 */}
              <div
                className="absolute inset-0.5 rounded-full bg-white flex flex-col items-center justify-center text-center backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <Crown className="w-3 h-3 text-[#d4af37]" />
                <span className="font-forum font-bold text-xs sm:text-sm text-[#3A1F2B] leading-none">16</span>
              </div>
              {/* Back Face: Heart / Pucchi */}
              <div
                className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-[#B0295F] to-rose-400 flex flex-col items-center justify-center text-white backface-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <Heart className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                <span className="text-[6px] sm:text-[7px] tracking-widest uppercase font-bold mt-0.5">PUCCHI</span>
              </div>
            </motion.div>
            <span className="hidden sm:block absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono uppercase tracking-wider text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
              {medallionFlipped ? "Harleen 4 Life" : "Flip Me"}
            </span>
          </div>

          {/* 3D Floating Left Badge: Hidden on < sm to eliminate 360px collision */}
          <div
            className="hidden sm:flex absolute top-7 left-7 z-30 items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#FFD9E3] shadow-xs"
            style={{ transform: "translateZ(35px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#B0295F] animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-wider text-[#3A1F2B]">
              FEB 16 • FOREVER ADORED
            </span>
          </div>

          {/* Grand Signature Calligraphy */}
          <div
            className="relative flex flex-col items-center mt-2 sm:mt-0"
            style={{ transform: "translateZ(30px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative select-none my-1 sm:my-2"
            >
              <span className="font-signature text-6xl xs:text-7xl sm:text-9xl md:text-[10rem] bg-gradient-to-r from-[#B0295F] via-[#c95874] to-[#d4af37] bg-clip-text text-transparent leading-none drop-shadow-[0_8px_20px_rgba(176,41,95,0.18)] block">
                Harleen
              </span>
              <span className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 text-[#d4af37] text-xl sm:text-3xl animate-bounce">
                ✦
              </span>
            </motion.div>
          </div>

          {/* FEATURED DUAL-PORTRAIT 3D SHOWCASE - RESPONSIVE SCALING FOR 360PX */}
          <div
            className="relative my-3 sm:my-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
            style={{ transform: "translateZ(65px)" }}
          >
            {/* Portrait 1: Red Feather Dress */}
            <div
              onClick={() => setActivePhoto("feather")}
              className={`relative w-36 xs:w-44 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden p-1 bg-white border-2 transition-all duration-300 cursor-pointer shadow-md group ${
                activePhoto === "feather"
                  ? "border-[#B0295F] shadow-[0_12px_30px_rgba(176,41,95,0.25)] scale-105"
                  : "border-[#FFD9E3] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-900">
                <img
                  src="/media/harleen-red-feather-dress.jpg"
                  alt="Harleen in Red Feather Dress"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 inset-x-2 text-center text-white">
                  <span className="text-[9px] sm:text-[10px] font-raleway font-bold uppercase tracking-wider text-rose-200 block">
                    RED CARPET QUEEN
                  </span>
                  <span className="font-forum text-[11px] sm:text-xs text-white/95">Pure Starlight</span>
                </div>
              </div>
            </div>

            {/* Center Romantic Pill */}
            <div className="flex flex-col items-center gap-0.5 my-1 sm:my-0">
              <span className="font-signature text-2xl sm:text-4xl text-[#B0295F]">
                Pucchi 🤍
              </span>
              <span className="text-[9px] font-raleway uppercase tracking-[0.22em] text-[#3A1F2B]/75 font-bold">
                My Center Of Gravity
              </span>
            </div>

            {/* Portrait 2: Emerald Tiara */}
            <div
              onClick={() => setActivePhoto("tiara")}
              className={`relative w-36 xs:w-44 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden p-1 bg-white border-2 transition-all duration-300 cursor-pointer shadow-md group ${
                activePhoto === "tiara"
                  ? "border-[#B0295F] shadow-[0_12px_30px_rgba(176,41,95,0.25)] scale-105"
                  : "border-[#FFD9E3] opacity-85 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-900">
                <img
                  src="/media/ethnic-dragonfly-tiara.jpg"
                  alt="Harleen in Emerald Tiara"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 inset-x-2 text-center text-white">
                  <span className="text-[9px] sm:text-[10px] font-raleway font-bold uppercase tracking-wider text-amber-200 block">
                    EMERALD TIARA
                  </span>
                  <span className="font-forum text-[11px] sm:text-xs text-white/95">Timeless Grace</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Headline & Poetic Lines */}
          <div
            className="relative flex flex-col items-center mt-3"
            style={{ transform: "translateZ(50px)" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-forum text-xl xs:text-2xl sm:text-4xl md:text-5xl uppercase tracking-[0.06em] text-[#3A1F2B] font-normal leading-snug max-w-2xl"
            >
              My Whole Entire{" "}
              <span className="relative inline-block font-medium">
                <span className="bg-gradient-to-r from-[#B0295F] via-[#c95874] to-[#d4af37] bg-clip-text text-transparent">
                  Universe &amp; Peace
                </span>
                <span className="absolute left-0 bottom-0.5 w-full h-[2px] bg-gradient-to-r from-[#B0295F] via-[#FFD9E3] to-[#d4af37] rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-signature text-xl xs:text-2xl sm:text-3xl text-[#B0295F] max-w-xl mt-2 leading-relaxed"
            >
              &ldquo;Across every galaxy, in every timeline and through all of life, you will always be my favorite human and safest haven.&rdquo;
            </motion.p>
          </div>

          {/* Shimmering Feature Highlights */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 pt-4 border-t border-[#FFD9E3]"
            style={{ transform: "translateZ(60px)" }}
          >
            {countdown && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#d4af37]/60 shadow-xs text-xs font-mono text-[#3A1F2B]">
                <Clock className="w-3 h-3 text-[#d4af37]" />
                <span className="font-semibold">
                  {countdown.days}d {countdown.hours}h {countdown.mins}m {countdown.secs}s
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#FFD9E3] shadow-xs text-xs font-raleway text-[#3A1F2B]">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span className="font-semibold">35 Curated Archives</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#FFD9E3] shadow-xs text-xs font-raleway text-[#3A1F2B]">
              <Heart className="w-3 h-3 text-[#B0295F] fill-[#B0295F]" />
              <span className="font-semibold">16 Reasons Why</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#FFD9E3] shadow-xs text-xs font-raleway text-[#3A1F2B]">
              <Disc3 className="w-3 h-3 text-[#B0295F]" />
              <span className="font-semibold">CAS &ldquo;K.&rdquo; Mixtape</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUICK JUMP DIRECTORY */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="w-full max-w-4xl flex flex-col items-center"
      >
        <span className="text-[10px] font-raleway font-bold uppercase tracking-[0.24em] text-[#3A1F2B]/70 mb-3">
          ✦ DIRECT PORTAL TELEPORT ✦
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <a
            href="#cake"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#B0295F] hover:bg-[#8F1D4B] text-white text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#B0295F]/25 cursor-pointer min-h-[44px]"
          >
            <Cake className="w-3.5 h-3.5 text-amber-200" />
            <span>01. Birthday Cake &amp; Wish</span>
          </a>

          <a
            href="#scroll-reveal"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Camera className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>02. Photo Reveal</span>
          </a>

          <a
            href="#sound"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Disc3 className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>03. CAS Vinyl Chamber</span>
          </a>

          <a
            href="#reasons"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Award className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>04. 16 Reasons</span>
          </a>

          <a
            href="#memories"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Film className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>05. Themed Archives</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Mail className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>06. Sealed Epistle</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Lock className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>07. Secret Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#B0295F]" />
            <span>08. Notes Wall</span>
          </a>

          <a
            href="#review"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF8F5] border-2 border-[#FFD9E3] text-[#3A1F2B] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.16em] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer min-h-[44px]"
          >
            <Heart className="w-3.5 h-3.5 text-[#B0295F] fill-[#B0295F]" />
            <span>09. Your Thoughts</span>
          </a>
        </div>
      </motion.div>

      {/* Gentle Scroll Prompt - DIRECTLY ADDRESSING HARLEEN */}
      <div className="flex flex-col items-center gap-1.5 mt-8 text-[#3A1F2B]/60 text-[10px] font-raleway tracking-[0.25em] uppercase">
        <span>Scroll down to explore your world</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#B0295F]" />
      </div>
    </section>
  );
}
