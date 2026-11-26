"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { BIRTHDAY_CONFIG } from "@/data/config";
import { COPY } from "@/data/copy";
import StartGate from "@/components/StartGate";
import SparklesBackground from "@/components/SparklesBackground";
import Hero3D from "@/components/Hero3D";
import BirthdayCakeCeremony from "@/components/BirthdayCakeCeremony";
import PhotoScrollReveal from "@/components/PhotoScrollReveal";
import TurntablePlayer from "@/components/TurntablePlayer";
import SixteenReasons from "@/components/SixteenReasons";
import ThemedGalleries from "@/components/ThemedGalleries";
import ArchivalLetter from "@/components/ArchivalLetter";
import MidnightVault from "@/components/MidnightVault";
import GuestbookWall from "@/components/GuestbookWall";
import { Disc3, ChevronDown, ArrowUp, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const jumpRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onMusicStatus = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying: boolean }>;
      if (typeof customEvent.detail?.isPlaying === "boolean") {
        setIsMusicPlaying(customEvent.detail.isPlaying);
      }
    };
    window.addEventListener("harleen:music-status", onMusicStatus);
    return () => window.removeEventListener("harleen:music-status", onMusicStatus);
  }, []);

  useEffect(() => {
    if (!isJumpOpen) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target as Node)) {
        setIsJumpOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsJumpOpen(false);
    };
    window.addEventListener("mousedown", onOutsideClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onOutsideClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isJumpOpen]);

  const navLinks = [
    { href: "#cake", label: COPY.header.sections.cake },
    { href: "#reveal", label: COPY.header.sections.reveal },
    { href: "#sound", label: COPY.header.sections.music },
    { href: "#reasons", label: COPY.header.sections.reasons },
    { href: "#memories", label: COPY.header.sections.memories },
    { href: "#letter", label: COPY.header.sections.letter },
    { href: "#vault", label: COPY.header.sections.vault },
    { href: "#notes", label: COPY.header.sections.writeBack },
  ];

  return (
    <main className="relative min-h-screen text-ink overflow-x-hidden font-sans">
      <SparklesBackground />

      {/* Start Gate Portal */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Frosted Velvet Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 bg-paper/80 backdrop-blur-xl border-b border-gold/25 shadow-[0_6px_28px_rgba(43,21,36,0.06)]">
        {/* Golden Reading Progress Filament */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: smoothProgress }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-strawberry via-gold to-strawberry"
        />

        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group cursor-pointer bg-transparent border-0 p-0"
            aria-label="Scroll to top"
          >
            <span className="font-hand text-3xl sm:text-4xl text-foil leading-none pt-0.5">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Compact Jump To Navigation */}
            <div className="relative" ref={jumpRef}>
              <button
                type="button"
                onClick={() => setIsJumpOpen((prev) => !prev)}
                aria-expanded={isJumpOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full bg-paper/95 border border-gold/30 text-ink text-xs font-sans font-medium shadow-xs hover:border-strawberry/45 transition-all cursor-pointer"
              >
                <span>{COPY.header.jumpToButton}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-strawberry transition-transform duration-200 ${
                    isJumpOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isJumpOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 mt-2 w-44 bg-paper/98 backdrop-blur-xl rounded-2xl border border-gold/30 shadow-[0_20px_45px_rgba(43,21,36,0.16)] py-1.5 z-50 flex flex-col text-left"
                  >
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setIsJumpOpen(false)}
                        className="px-4 py-2 text-xs font-sans text-ink hover:bg-strawberry/8 hover:text-strawberry transition-colors flex items-center justify-between"
                      >
                        <span>{link.label}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Audio Toggle with Live Equalizer */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("harleen:toggle-music"));
              }}
              className={`flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-full border text-xs font-sans transition-all cursor-pointer shadow-xs ${
                isMusicPlaying
                  ? "bg-strawberry text-paper border-strawberry shadow-[0_4px_16px_rgba(212,40,90,0.28)]"
                  : "bg-paper/95 text-ink border-gold/30 hover:border-strawberry/45"
              }`}
              title={isMusicPlaying ? "Tap to pause music" : "Tap to play music"}
              aria-label={isMusicPlaying ? "Pause soundtrack" : "Play soundtrack"}
            >
              <Disc3
                className={`w-3.5 h-3.5 shrink-0 ${
                  isMusicPlaying ? "animate-spin text-paper" : "text-strawberry"
                }`}
                style={{ animationDuration: "6s" }}
              />
              {isMusicPlaying && (
                <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span
                      key={i}
                      className="w-[2px] h-full rounded-full bg-paper/90 origin-bottom"
                      style={{
                        animation: `eqPulse 0.85s ease-in-out ${delay}s infinite`,
                      }}
                    />
                  ))}
                </span>
              )}
              <span className="text-[11px] font-medium hidden sm:inline">
                {isMusicPlaying ? COPY.header.audioTitle : "Sound off"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience */}
      <Hero3D />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <BirthdayCakeCeremony recipientName={BIRTHDAY_CONFIG.recipientName} />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <PhotoScrollReveal />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <TurntablePlayer autoPlayTrigger={hasStarted} />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <SixteenReasons />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <ThemedGalleries />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <ArchivalLetter />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <MidnightVault />

      <div className="max-w-3xl mx-auto px-8">
        <div className="editorial-rule" />
      </div>

      <GuestbookWall />

      {/* Velvet Keepsake Footer */}
      <footer className="relative z-10 mt-10 py-14 text-center border-t border-gold/25 bg-gradient-to-b from-paper/55 to-paper/85 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center">
          <span className="font-hand text-5xl sm:text-6xl text-foil leading-none mb-2">
            {COPY.footer.name}
          </span>
          <p className="font-sans text-xs text-mauve tracking-wide">
            {COPY.footer.tagline}
          </p>
          <p className="font-hand text-2xl sm:text-3xl text-ink/85 mt-3">
            &ldquo;{COPY.footer.quote}&rdquo;
          </p>
          <div className="text-[10px] font-sans text-mauve uppercase tracking-[0.2em] mt-5">
            <span>{COPY.footer.soundtrack}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                confetti({
                  particleCount: 95,
                  spread: 110,
                  origin: { y: 0.85 },
                  colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#F6E5B6", "#FFF9FA"],
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/35 text-xs font-sans font-semibold hover:brightness-110 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span>Celebrate again</span>
            </button>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-paper border border-gold/30 text-xs font-sans text-ink/80 hover:text-strawberry hover:border-strawberry/40 transition-all shadow-xs cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-strawberry" />
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
