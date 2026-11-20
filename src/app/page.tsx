"use client";

import React, { useState } from "react";
import { BIRTHDAY_CONFIG } from "@/data/config";
import SparklesBackground from "@/components/SparklesBackground";
import StartGate from "@/components/StartGate";
import TurntablePlayer from "@/components/TurntablePlayer";
import MidnightRitual from "@/components/MidnightRitual";
import FilmContactSheet from "@/components/FilmContactSheet";
import ArchivalLetter from "@/components/ArchivalLetter";
import MidnightVault from "@/components/MidnightVault";
import GuestbookWall from "@/components/GuestbookWall";
import { Sparkles, Film, Mail, Lock, MessageSquare, Disc3, Heart } from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#fbf7f8] text-[#2e1322] overflow-x-hidden selection:bg-pink-300 selection:text-pink-950">
      {/* Luminous Dreamy Atmosphere & Particle Confetti */}
      <SparklesBackground />

      {/* Cinematic Start Gate ("K." by Cigarettes After Sex) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Top Editorial Bar */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-[#fbf7f8]/85 backdrop-blur-xl border-b border-pink-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🌸</span>
            <span className="font-serif font-black tracking-widest text-sm uppercase text-[#2e1322]">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
            <span className="text-pink-300">|</span>
            <span className="text-[11px] font-mono text-rose-600 font-bold uppercase tracking-widest hidden sm:inline">
              FEBRUARY 16 • ARCHIVE
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-pink-200 text-xs text-rose-800 font-mono font-bold">
            <Disc3 className="w-3.5 h-3.5 text-pink-500 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="truncate max-w-[140px] sm:max-w-xs">
              CAS — K.
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-20 flex flex-col items-center">
        {/* Editorial Heading */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 shadow-sm text-rose-700 text-xs font-mono font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>FEBRUARY 16 • A SPECIAL CELEBRATION</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none drop-shadow-sm">
            HARLEEN
          </h1>

          <p className="font-hand text-2xl sm:text-3xl text-rose-700 mt-4">
            &ldquo;In a world full of noise, you bring an effortless peace.&rdquo;
          </p>
        </div>

        {/* Centerpiece: Cigarettes After Sex Turntable Player */}
        <div className="w-full flex justify-center mb-16">
          <TurntablePlayer autoPlayTrigger={hasStarted} />
        </div>

        {/* The Birthday Ritual: Luxury Candle + Feb 16 Moon Dial */}
        <div className="w-full">
          <MidnightRitual recipientName={BIRTHDAY_CONFIG.recipientName} />
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
          <a
            href="#memories"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-pearl hover:bg-white border border-pink-300 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Film className="w-3.5 h-3.5 text-amber-500" />
            <span>Photo Frames</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-pearl hover:bg-white border border-pink-300 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>Love Letter</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-pearl hover:bg-white border border-pink-300 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Secret Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-pearl hover:bg-white border border-pink-300 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Wishes Wall</span>
          </a>
        </div>
      </section>

      {/* 1. Curated Photo Contact Sheet */}
      <FilmContactSheet />

      {/* 2. Archival Love Letter */}
      <ArchivalLetter />

      {/* 3. Inside-Joke Secret Vault */}
      <MidnightVault />

      {/* 4. Live Guestbook Wall */}
      <GuestbookWall />

      {/* Luminous Footer */}
      <footer className="relative z-10 py-16 text-center border-t border-pink-200 bg-white">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center">
          <span className="text-2xl mb-2">🌸</span>
          <p className="font-serif text-lg font-bold text-rose-900 tracking-widest uppercase">
            HARLEEN • FEBRUARY 16
          </p>
          <p className="font-hand text-2xl text-rose-600 mt-1">
            Soundtrack: Cigarettes After Sex — &ldquo;K.&rdquo;
          </p>
          <span className="text-xs text-gray-400 font-sans mt-3">
            Curated with all the love in the world for Harleen ✨
          </span>
        </div>
      </footer>
    </main>
  );
}
