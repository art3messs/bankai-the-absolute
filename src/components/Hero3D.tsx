"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";
import { COPY } from "@/data/copy";
import { getBirthdayDetails, getCountdownBreakdown, CountdownBreakdown } from "@/data/config";

const emptySubscribe = () => () => {};

export default function Hero3D() {
  const staticDetails = getBirthdayDetails();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [countdown, setCountdown] = useState<CountdownBreakdown | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const heartIdRef = useRef(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 24, stiffness: 200, mass: 0.55 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["10%", "90%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,248,235,0.38) 0%, rgba(255,255,255,0) 62%)`;

  useEffect(() => {
    const sync = () => setCountdown(getCountdownBreakdown(new Date()));
    const initTimer = setTimeout(sync, 0);
    const interval = setInterval(sync, 1000);
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePortraitTap = () => {
    setTapCount((c) => c + 1);
    const id = ++heartIdRef.current;
    const xOffset = (id % 2 === 0 ? 1 : -1) * (12 + ((id * 13) % 34));
    setFloatingHearts((prev) => [...prev.slice(-6), { id, x: xOffset }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1050);

    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.42 },
      colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#F6E5B6", "#FFF9FA"],
    });
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const activeDetails = countdown || staticDetails;

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-14 pb-8 sm:pb-12 flex flex-col items-center text-center">
      {/* Ambient Rose & Champagne Spotlight Behind Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 w-80 h-80 sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-br from-strawberry/20 via-gold-light/30 to-transparent blur-3xl -z-10"
      />

      {/* 3D Museum-Framed Portrait Showcase */}
      <div style={{ perspective: 1100 }} className="w-full max-w-sm sm:max-w-md mb-7 flex justify-center">
        <motion.div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handlePortraitTap}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePortraitTap();
            }
          }}
          className="relative w-full paper-card p-3 sm:p-4 rounded-[28px] cursor-pointer group transition-shadow hover:shadow-[0_28px_65px_rgba(212,40,90,0.18)]"
          title="Tap portrait for a celebratory burst"
        >
          {/* Champagne Gold Corner Brackets */}
          <div className="pointer-events-none absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-gold/55 rounded-tl-lg" />
          <div className="pointer-events-none absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-gold/55 rounded-br-lg" />

          {/* Embossed Turning Age Medallion Seal */}
          <div
            style={{ transform: "translateZ(45px)" }}
            className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#A97B23] via-[#DFB75B] to-[#FFF2BE] p-[2px] shadow-[0_10px_25px_rgba(43,21,36,0.22)] flex items-center justify-center group-hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full border border-ink/20 flex flex-col items-center justify-center text-ink">
              <span className="font-serif text-lg sm:text-xl leading-none font-bold">
                {activeDetails.turningAge}
              </span>
              <span className="font-sans text-[8px] uppercase tracking-widest font-bold opacity-80">
                Years
              </span>
            </div>
          </div>

          <div
            className="relative aspect-[3/4] w-full rounded-[20px] overflow-hidden bg-mauve/10 shadow-inner"
            style={{ transform: "translateZ(20px)" }}
          >
            <Image
              src="/media/harleen-red-feather-dress.jpg"
              alt="Harleen in red feather dress"
              fill
              priority
              sizes="(max-width: 640px) 90vw, 448px"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: glareBg }}
            />
            {/* Iridescent Diagonal Foil Shimmer Sweep on Hover */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Heart Bursts on Tap */}
          <AnimatePresence>
            {floatingHearts.map((heart) => (
              <motion.span
                key={heart.id}
                aria-hidden="true"
                initial={{ opacity: 0.95, y: 0, x: 0, scale: 0.7 }}
                animate={{ opacity: 0, y: -95, x: heart.x, scale: 1.45 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.95, ease: "easeOut" }}
                className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 z-30 text-lg text-strawberry drop-shadow"
              >
                🤍
              </motion.span>
            ))}
          </AnimatePresence>

          <div className="mt-3.5 pb-1 text-center" style={{ transform: "translateZ(30px)" }}>
            <p className="font-hand text-3xl sm:text-4xl text-foil leading-none">
              {COPY.hero.badge}
            </p>
            <span className="font-sans text-[11px] text-mauve uppercase tracking-[0.2em] block mt-1">
              {tapCount > 0 ? `✦ Adored x${tapCount} • ${COPY.hero.photoLabel}` : COPY.hero.photoLabel}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Name Display */}
      <h1 className="font-serif text-5xl sm:text-7xl text-foil tracking-tight font-normal pb-1">
        {COPY.hero.name}
      </h1>

      {/* Turning Age Pill */}
      <div className="mt-2 inline-flex items-center gap-2 bg-paper/95 px-4 py-1.5 rounded-full border border-gold/35 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        <span className="font-sans font-semibold text-strawberry text-sm">
          Turning {activeDetails.turningAge}
        </span>
      </div>

      {/* Live Champagne Countdown Tiles (SSR-deterministic before client sync) */}
      {mounted && countdown ? (
        countdown.isBirthdayToday ? (
          <p className="mt-3 text-strawberry font-semibold text-sm sm:text-base font-sans tracking-wide">
            🎉 Today is {countdown.formattedDate} — Happy {countdown.turningAge}th Birthday, Pucchi! 🎂✨
          </p>
        ) : (
          <div className="mt-3.5 flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {[
                { val: String(countdown.days), label: "Days" },
                { val: pad(countdown.hours), label: "Hrs" },
                { val: pad(countdown.minutes), label: "Min" },
                { val: pad(countdown.seconds), label: "Sec" },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="min-w-[52px] sm:min-w-[60px] px-2.5 py-1.5 rounded-xl bg-paper/95 border border-gold/30 shadow-xs flex flex-col items-center"
                >
                  <span className="font-serif text-base sm:text-lg text-ink leading-tight tabular-nums">
                    {unit.val}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-mauve font-semibold">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[11px] font-sans text-mauve tracking-wide">
              Until {countdown.formattedDate}
            </span>
          </div>
        )
      ) : (
        <p className="mt-3 text-ink/85 text-sm sm:text-base font-sans tracking-wide">
          Counting down to {staticDetails.formattedDate}
        </p>
      )}

      {/* Intimate Quote */}
      <blockquote className="mt-5 text-ink/90 text-base sm:text-lg max-w-xl font-sans leading-relaxed italic">
        &ldquo;{COPY.hero.quote}&rdquo;
      </blockquote>
    </section>
  );
}
