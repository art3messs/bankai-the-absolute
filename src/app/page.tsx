"use client";

import React, { useState, useEffect } from "react";
import { BIRTHDAY_CONFIG } from "@/data/config";
import { COPY } from "@/data/copy";
import StartGate from "@/components/StartGate";
import Hero3D from "@/components/Hero3D";
import BirthdayCakeCeremony from "@/components/BirthdayCakeCeremony";
import PhotoScrollReveal from "@/components/PhotoScrollReveal";
import TurntablePlayer from "@/components/TurntablePlayer";
import SixteenReasons from "@/components/SixteenReasons";
import ThemedGalleries from "@/components/ThemedGalleries";
import ArchivalLetter from "@/components/ArchivalLetter";
import MidnightVault from "@/components/MidnightVault";
import GuestbookWall from "@/components/GuestbookWall";
import { Disc3, ChevronDown } from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

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
    <main className="relative min-h-screen text-ink overflow-x-hidden font-sans bg-box-pink">
      {/* Start Gate Portal */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 py-3 bg-paper/90 backdrop-blur-md border-b border-mauve/15">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-hand text-2xl sm:text-3xl text-ink">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Small Jump To Navigation */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsJumpOpen(!isJumpOpen)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-paper border border-mauve/25 text-ink text-xs font-sans font-medium hover:bg-mauve/5 transition-colors cursor-pointer"
              >
                <span>{COPY.header.jumpToButton}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isJumpOpen ? "rotate-180" : ""}`} />
              </button>

              {isJumpOpen && (
                <div
                  onClick={() => setIsJumpOpen(false)}
                  className="absolute right-0 mt-2 w-40 bg-paper rounded-2xl border border-mauve/20 shadow-xl py-1 z-50 flex flex-col text-left"
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-xs font-sans text-ink hover:bg-mauve/10 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Audio Toggle Indicator */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("harleen:toggle-music"));
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-mauve/20 text-xs text-ink font-sans hover:bg-mauve/5 transition-colors cursor-pointer"
              title={isMusicPlaying ? "Tap to pause music" : "Tap to play music"}
              aria-label={isMusicPlaying ? "Pause soundtrack" : "Play soundtrack"}
            >
              <Disc3
                className={`w-3.5 h-3.5 text-strawberry ${
                  isMusicPlaying ? "animate-spin" : "opacity-60"
                }`}
                style={{ animationDuration: "8s" }}
              />
              <span className="text-[11px] font-medium hidden sm:inline">
                {isMusicPlaying ? COPY.header.audioTitle : "Sound off"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Sections */}
      <Hero3D />

      <BirthdayCakeCeremony recipientName={BIRTHDAY_CONFIG.recipientName} />

      <PhotoScrollReveal />

      <TurntablePlayer autoPlayTrigger={hasStarted} />

      <SixteenReasons />

      <ThemedGalleries />

      <ArchivalLetter />

      <MidnightVault />

      <GuestbookWall />

      {/* Footer */}
      <footer className="relative z-10 py-16 text-center border-t border-mauve/20 bg-paper/60">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center">
          <span className="font-hand text-4xl sm:text-5xl text-ink mb-1">
            {COPY.footer.name}
          </span>
          <p className="font-sans text-xs text-mauve">
            {COPY.footer.tagline}
          </p>
          <p className="font-hand text-2xl text-ink/80 mt-3">
            &ldquo;{COPY.footer.quote}&rdquo;
          </p>
          <div className="text-[10px] font-sans text-mauve uppercase tracking-widest mt-6">
            <span>{COPY.footer.soundtrack}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
