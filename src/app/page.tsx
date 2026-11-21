"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BIRTHDAY_CONFIG } from "@/data/config";
import SparklesBackground from "@/components/SparklesBackground";
import StartGate from "@/components/StartGate";
import TurntablePlayer from "@/components/TurntablePlayer";
import MidnightRitual from "@/components/MidnightRitual";
import Hero3D from "@/components/Hero3D";
import ThemedGalleries from "@/components/ThemedGalleries";
import ArchivalLetter from "@/components/ArchivalLetter";
import MidnightVault from "@/components/MidnightVault";
import GuestbookWall from "@/components/GuestbookWall";
import SpotifyMixtape from "@/components/SpotifyMixtape";
import SixteenReasons from "@/components/SixteenReasons";
import {
  ScrollProgressBar,
  ScrollyCard,
  ScrollyStickers,
} from "@/components/ScrollyPopups";
import {
  Sparkles,
  Film,
  Mail,
  Lock,
  MessageSquare,
  Disc3,
  Heart,
  Award,
  ArrowDown,
  Camera,
  Star,
} from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#fdfaf5] text-[#241e16] overflow-x-hidden selection:bg-rose-200 selection:text-rose-950 font-raleway">
      {/* Scroll-driven Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Floating Ambient Interactive Stickers */}
      <ScrollyStickers />

      {/* Luminous Dreamy Atmosphere & Confetti Sparkles */}
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

      {/* CHAPTER I: 3D INTERACTIVE HERO STAGE */}
      <Hero3D />

      {/* POPPING SCROLL CAPSULE #1: LITTLE POGO */}
      <ScrollyCard
        popup={{
          id: "pogo-popup",
          badge: "👶 LITTLE POGO DETECTED",
          title: "Baby Fur Collar Throwback",
          subtitle: "The cutest, sweetest little human in the universe 🍼",
          image: "/media/pogo-baby-fur-smile.jpg",
          side: "left",
          rotate: -3.5,
          category: "little pogo",
          tagColor: "bg-pink-100 text-pink-700 border-pink-300",
        }}
      />

      {/* CHAPTER II: THE SOUND (TURNTABLE & MIXTAPE) */}
      <section id="sound" className="relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col items-center">
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

      {/* POPPING SCROLL CAPSULE #2: AESTHICK NAILS */}
      <ScrollyCard
        popup={{
          id: "nails-popup",
          badge: "💅 AESTHICK NAILS CHECK",
          title: "Almond Shimmer & Rings",
          subtitle: "Nail art on point • 1000/10 hands down ✨",
          image: "/media/nails-almond-rings.jpg",
          side: "right",
          rotate: 3,
          category: "aesthick nails",
          tagColor: "bg-emerald-50 text-emerald-700 border-emerald-300",
        }}
      />

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER III: THE 16 REASONS (FEB 16 SPECIAL) */}
      <section id="reasons" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER III • THE CHRONICLES
          </span>
        </div>
        <SixteenReasons />
      </section>

      {/* POPPING SCROLL CAPSULE #3: POPAAA MOMENTS */}
      <ScrollyCard
        popup={{
          id: "popaaa-popup",
          badge: "😂 POPAAA MOMENT UNLOCKED",
          title: "Squishy Cheeks & Goofy Grin",
          subtitle: "Zero filters, 100% pure joy & silly laughs 😂",
          image: "/media/popaaa-cheek-pinch.jpg",
          side: "left",
          rotate: -2.8,
          category: "popaaa moments",
          tagColor: "bg-amber-50 text-amber-700 border-amber-300",
        }}
      />

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER IV: THE MIDNIGHT RITUAL (CANDLE & MOON) */}
      <section id="ritual" className="relative z-10 max-w-5xl mx-auto px-4 py-16">
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

      {/* POPPING SCROLL CAPSULE #4: SICK IN ETHNIC */}
      <ScrollyCard
        popup={{
          id: "ethnic-popup",
          badge: "💃 SICK IN ETHNIC",
          title: "Royal Emerald Tiara & Silk",
          subtitle: "Straight out of a royal fairytale • Timeless elegance 👑",
          image: "/media/ethnic-dragonfly-tiara.jpg",
          side: "right",
          rotate: 3.2,
          category: "sick in ethnic",
          tagColor: "bg-purple-50 text-purple-700 border-purple-300",
        }}
      />

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER V: THE ARCHIVES (5 CURATED THEMED WORLDS WITH ALL 35 MEDIA ASSETS) */}
      <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <ThemedGalleries />
      </section>

      {/* POPPING SCROLL CAPSULE #5: HARLEEN 4 LIFE */}
      <ScrollyCard
        popup={{
          id: "harleen-popup",
          badge: "👑 HARLEEN 4 LIFE",
          title: "Polka Dots & Rhinestone Sparkle",
          subtitle: "My entire universe • Forever & always 💖",
          image: "/media/harleen-polka-rhinestones.jpg",
          side: "left",
          rotate: -2.5,
          category: "harleen 4 life",
          tagColor: "bg-rose-50 text-rose-700 border-rose-300",
        }}
      />

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VI: THE LOVE LETTER */}
      <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VI • INTIMATE EPISTLE
          </span>
        </div>
        <ArchivalLetter />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VII: THE SECRET VAULT */}
      <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VII • CONFIDENTIAL ARCHIVE
          </span>
        </div>
        <MidnightVault />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VIII: THE NOTES WALL */}
      <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
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
            &ldquo;You are my entire universe. Today, tomorrow, and across every lifetime.&rdquo;
          </p>
          <div className="flex items-center gap-2 text-[10px] font-raleway tracking-[0.3em] uppercase text-[#7d7265] mt-6">
            <span>SOUNDTRACK: CAS &ldquo;K.&rdquo;</span>
            <span>•</span>
            <span>35 ARCHIVE ASSETS</span>
            <span>•</span>
            <span>COLLECTION 2026</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
