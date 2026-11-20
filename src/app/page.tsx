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
import { Sparkles, Film, Mail, Lock, MessageSquare, Disc3 } from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#08060b] text-[#f4ebf0] overflow-x-hidden selection:bg-amber-300 selection:text-black">
      {/* 35mm Analog Film Grain & Cosmic Sparkles */}
      <SparklesBackground />

      {/* Cinematic Start Gate (Starts "K." by Cigarettes After Sex) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Top Editorial Bar */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-[#08060b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <span className="font-serif font-black tracking-widest text-sm uppercase text-white">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[11px] font-mono text-rose-200/60 uppercase tracking-widest hidden sm:inline">
              FEBRUARY 16 • ARCHIVE
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-amber-200/90 font-mono">
            <Disc3 className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
            <span className="truncate max-w-[140px] sm:max-w-xs">
              CAS — K.
            </span>
          </div>
        </div>
      </header>

      {/* Hero Experience */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-20 flex flex-col items-center">
        {/* Editorial Heading */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-300 text-xs font-mono tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>FEBRUARY 16 • A PRIVATE CELEBRATION</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            HARLEEN
          </h1>

          <p className="font-hand text-2xl sm:text-3xl text-rose-200/90 mt-4 italic">
            &ldquo;In a world full of noise, you bring an effortless peace.&rdquo;
          </p>
        </div>

        {/* Centerpiece: Cigarettes After Sex Turntable Player */}
        <div className="w-full flex justify-center mb-16">
          <TurntablePlayer autoPlayTrigger={hasStarted} />
        </div>

        {/* The Midnight Ritual: Luxury Candle + Feb 16 Moon Dial */}
        <div className="w-full">
          <MidnightRitual recipientName={BIRTHDAY_CONFIG.recipientName} />
        </div>

        {/* Section Navigation Anchor Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-16">
          <a
            href="#memories"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-rose-100 text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Film className="w-3.5 h-3.5 text-amber-300" />
            <span>35mm Film Frames</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-rose-100 text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Midnight Letter</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-rose-100 text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Classified Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-rose-100 text-xs font-mono uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Wishes Archive</span>
          </a>
        </div>
      </section>

      {/* 1. 35mm Film Contact Sheet */}
      <FilmContactSheet />

      {/* 2. Midnight Archival Letter */}
      <ArchivalLetter />

      {/* 3. Midnight Secret Vault */}
      <MidnightVault />

      {/* 4. Live Wishes Guestbook Wall */}
      <GuestbookWall />

      {/* Editorial Footer */}
      <footer className="relative z-10 py-16 text-center border-t border-white/5 bg-[#050407]">
        <div className="max-w-md mx-auto px-4 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
            <span className="text-amber-300 text-sm">✦</span>
          </div>
          <p className="font-serif text-lg font-bold text-white tracking-widest uppercase">
            HARLEEN • FEBRUARY 16
          </p>
          <p className="font-hand text-xl text-rose-200/80 mt-1 italic">
            Soundtrack: Cigarettes After Sex — &ldquo;K.&rdquo;
          </p>
          <span className="text-[10px] text-white/30 font-mono mt-3 uppercase tracking-widest">
            A PRIVATE KEEPSAKE • ALL RIGHTS TO HER SMILE
          </span>
        </div>
      </footer>
    </main>
  );
}
