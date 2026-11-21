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
import SpotifyMixtape from "@/components/SpotifyMixtape";
import SixteenReasons from "@/components/SixteenReasons";
import { Sparkles, Film, Mail, Lock, MessageSquare, Disc3, Heart, Award, ArrowDown } from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#fdfaf5] text-[#241e16] overflow-x-hidden selection:bg-rose-200 selection:text-rose-950 font-raleway">
      {/* Luminous Dreamy Atmosphere & Particle Confetti */}
      <SparklesBackground />

      {/* Cinematic Start Gate ("K." by Cigarettes After Sex) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Top Editorial Masthead (like lovealways.earth) */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-[#fdfaf5]/85 backdrop-blur-xl border-b border-[#d97d93]/20 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-raleway tracking-[0.25em] text-[#7d7265] uppercase font-bold hidden sm:inline">
              ISSUE N° 16 • FEB 2026
            </span>
            <span className="text-[#d97d93] hidden sm:inline">|</span>
            <span className="font-signature text-2xl sm:text-3xl text-[#c95874] drop-shadow-xs">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-[#d97d93]/30 text-xs text-[#241e16] font-raleway font-semibold">
            <Disc3 className="w-3.5 h-3.5 text-[#c95874] animate-spin" style={{ animationDuration: "8s" }} />
            <span className="tracking-wider uppercase text-[10px] sm:text-xs">
              CAS — K. • 33 RPM
            </span>
          </div>
        </div>
      </header>

      {/* CHAPTER I: THE GENESIS / THE HORIZON */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-20 flex flex-col items-center text-center">
        {/* Chapter Indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#d97d93]/30 shadow-xs text-[#c95874] text-[10px] sm:text-[11px] font-raleway font-bold tracking-[0.3em] uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>CHAPTER I • THE GENESIS</span>
          <Heart className="w-3.5 h-3.5 text-[#c95874] fill-[#c95874]" />
        </div>

        {/* Grand Signature Calligraphy */}
        <span className="font-signature text-6xl sm:text-8xl md:text-9xl text-[#c95874] leading-none drop-shadow-sm select-none">
          Harleen
        </span>

        {/* Antique Roman Serif Headline */}
        <h1 className="font-forum text-4xl sm:text-6xl md:text-7xl uppercase tracking-[0.08em] text-[#241e16] font-normal mt-4 leading-tight">
          The Only One I Adore
        </h1>

        {/* Delicate Poetic Subtitle */}
        <p className="font-signature text-2xl sm:text-4xl text-[#7d7265] max-w-2xl mt-4 leading-relaxed">
          &ldquo;In all of space and time, seeing you happy is my favorite thing in life.&rdquo;
        </p>

        {/* Editorial Dividing Rule */}
        <div className="w-48 editorial-rule my-10" />

        {/* Table of Contents / Chapter Index Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
          <a
            href="#sound"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Disc3 className="w-3 h-3 text-[#d4af37]" />
            <span>01. The Sound</span>
          </a>

          <a
            href="#reasons"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Award className="w-3 h-3 text-[#d4af37]" />
            <span>02. 16 Reasons</span>
          </a>

          <a
            href="#ritual"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>03. The Ritual</span>
          </a>

          <a
            href="#memories"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Film className="w-3 h-3 text-[#d4af37]" />
            <span>04. 35mm Archives</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Mail className="w-3 h-3 text-[#d4af37]" />
            <span>05. Sealed Letter</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <Lock className="w-3 h-3 text-[#d4af37]" />
            <span>06. Secret Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pearl hover:bg-white border border-[#d97d93]/30 text-[#241e16] text-[10px] sm:text-xs font-raleway font-bold uppercase tracking-[0.18em] transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            <MessageSquare className="w-3 h-3 text-[#d4af37]" />
            <span>07. Notes Wall</span>
          </a>
        </div>

        {/* Gentle Scroll Prompt */}
        <div className="flex flex-col items-center gap-1.5 mt-16 text-[#7d7265]/70 text-[10px] font-raleway tracking-[0.25em] uppercase">
          <span>Scroll to begin story</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#c95874]" />
        </div>
      </section>

      {/* CHAPTER II: THE SOUND (TURNTABLE & MIXTAPE) */}
      <section id="sound" className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col items-center">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER II • THE VINYL CHAMBER
          </span>
          <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
            Cigarettes After Sex &amp; Our Mixtape
          </h2>
          <p className="font-signature text-2xl text-[#7d7265] mt-2">
            &ldquo;Spinning 33 RPM • Harleen 4 Life&rdquo;
          </p>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-6">
          <TurntablePlayer autoPlayTrigger={hasStarted} />
          <SpotifyMixtape />
        </div>
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER III: THE 16 REASONS (FEB 16 SPECIAL) */}
      <section id="reasons" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER III • THE CHRONICLES
          </span>
        </div>
        <SixteenReasons />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER IV: THE MIDNIGHT RITUAL (CANDLE & MOON) */}
      <section id="ritual" className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER IV • THE MIDNIGHT RITUAL
          </span>
          <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
            The Candle &amp; Lunar Alignment
          </h2>
          <p className="font-signature text-2xl text-[#7d7265] mt-2">
            &ldquo;Extinguish the flame with your breath to reveal your February 16 wish&rdquo;
          </p>
        </div>
        <MidnightRitual recipientName={BIRTHDAY_CONFIG.recipientName} />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER V: THE ARCHIVES (35MM CONTACT SHEET) */}
      <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER V • THE ARCHIVES
          </span>
        </div>
        <FilmContactSheet />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VI: THE LOVE LETTER */}
      <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VI • INTIMATE EPISTLE
          </span>
        </div>
        <ArchivalLetter />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VII: THE SECRET VAULT */}
      <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VII • CONFIDENTIAL ARCHIVE
          </span>
        </div>
        <MidnightVault />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VIII: THE NOTES WALL */}
      <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VIII • REMINDERS FOR YOUR HEART
          </span>
        </div>
        <GuestbookWall />
      </section>

      {/* THE COLOPHON / EDITORIAL FOOTER */}
      <footer className="relative z-10 py-24 text-center border-t border-[#d97d93]/20 bg-[#ffffff]">
        <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
          <span className="font-signature text-4xl sm:text-5xl text-[#c95874] mb-2">
            Harleen
          </span>
          <p className="font-forum text-xl font-normal text-[#241e16] tracking-[0.15em] uppercase">
            FEBRUARY 16 • HARLEEN 4 LIFE
          </p>
          <div className="w-16 editorial-rule my-4" />
          <p className="font-signature text-2xl text-[#7d7265]">
            &ldquo;You are the only person I adore. Always and forever.&rdquo;
          </p>
          <div className="flex items-center gap-2 text-[10px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] mt-6">
            <span>SOUNDTRACK: CAS &ldquo;K.&rdquo;</span>
            <span>•</span>
            <span>COLLECTION 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
