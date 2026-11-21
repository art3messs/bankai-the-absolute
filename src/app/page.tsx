"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BIRTHDAY_CONFIG } from "@/data/config";
import SparklesBackground from "@/components/SparklesBackground";
import StartGate from "@/components/StartGate";
import TurntablePlayer from "@/components/TurntablePlayer";
import BirthdayCakeCeremony from "@/components/BirthdayCakeCeremony";
import Hero3D from "@/components/Hero3D";
import PhotoScrollReveal from "@/components/PhotoScrollReveal";
import ThemedGalleries from "@/components/ThemedGalleries";
import ArchivalLetter from "@/components/ArchivalLetter";
import MidnightVault from "@/components/MidnightVault";
import GuestbookWall from "@/components/GuestbookWall";
import WebsiteReview from "@/components/WebsiteReview";
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
  Cake,
} from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-[#fdfaf5] text-[#241e16] overflow-x-hidden selection:bg-rose-200 selection:text-rose-950 font-raleway">
      {/* Scroll-driven Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Floating Ambient Interactive Stickers */}
      <ScrollyStickers />

      {/* Luminous Dreamy Atmosphere, Drifting Rose Petals & Golden Stardust */}
      <SparklesBackground />

      {/* Cinematic Start Gate ("K." by Cigarettes After Sex & Scroll on Photo Reveal) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Top Editorial Masthead */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-[#fdfaf5]/85 backdrop-blur-xl border-b border-[#d97d93]/20 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-raleway tracking-[0.25em] text-[#7d7265] uppercase font-bold hidden sm:inline">
              SPECIAL ISSUE N° 16 • FEB 2026
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

      {/* CHAPTER I: 3D INTERACTIVE HERO STAGE WITH DUAL PORTRAITS */}
      <Hero3D />

      {/* CHAPTER II: GRAND 3D BIRTHDAY CAKE & INSTANT WISH CEREMONY */}
      <BirthdayCakeCeremony recipientName={BIRTHDAY_CONFIG.recipientName} />

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

      {/* CHAPTER III: INTERACTIVE DUAL-LAYER SCROLL PHOTO REVEAL */}
      <div id="scroll-reveal">
        <PhotoScrollReveal />
      </div>

      {/* CHAPTER IV: THE SOUND (TURNTABLE & MIXTAPE) */}
      <section id="sound" className="relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-10">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER IV • THE VINYL CHAMBER
          </span>
          <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
            Cigarettes After Sex &amp; Our Mixtape
          </h2>
          <p className="font-signature text-2xl text-[#7d7265] mt-2">
            &ldquo;Spinning 33 RPM • Harleen 4 Life • Pucchi&rdquo;
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

      {/* CHAPTER V: THE 16 REASONS (FEB 16 SPECIAL) */}
      <section id="reasons" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER V • THE CHRONICLES
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

      {/* CHAPTER VI: THE ARCHIVES (5 CURATED THEMED WORLDS WITH ALL 35 MEDIA ASSETS) */}
      <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <ThemedGalleries />
      </section>

      {/* POPPING SCROLL CAPSULE #4: HARLEEN 4 LIFE */}
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

      {/* CHAPTER VII: THE ARCHIVAL LETTER */}
      <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VII • INTIMATE EPISTLE
          </span>
        </div>
        <ArchivalLetter />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER VIII: THE SECRET VAULT ("pucchi") */}
      <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER VIII • CONFIDENTIAL ARCHIVE
          </span>
        </div>
        <MidnightVault />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER IX: THE NOTES WALL */}
      <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <span className="text-[10px] sm:text-[11px] font-raleway tracking-[0.3em] uppercase text-[#c95874] font-bold block mb-2">
            CHAPTER IX • REMINDERS FOR YOUR HEART
          </span>
        </div>
        <GuestbookWall />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule" />

      {/* CHAPTER X: HER REVIEW & REACTION */}
      <WebsiteReview />

      {/* THE COLOPHON / EDITORIAL FOOTER */}
      <footer className="relative z-10 py-24 text-center border-t border-[#d97d93]/20 bg-[#ffffff]">
        <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
          <span className="font-signature text-4xl sm:text-5xl text-[#c95874] mb-2">
            Harleen
          </span>
          <p className="font-forum text-xl font-normal text-[#241e16] tracking-[0.15em] uppercase">
            FEBRUARY 16 • HARLEEN 4 LIFE • PUCCHI
          </p>
          <div className="w-16 editorial-rule my-4" />
          <p className="font-signature text-2xl text-[#7d7265]">
            &ldquo;You are my entire universe. Today, tomorrow, and always.&rdquo;
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
