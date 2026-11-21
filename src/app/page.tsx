"use client";

import React, { useState } from "react";
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
  Mail,
  Lock,
  MessageSquare,
  Disc3,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen text-[#4a044e] overflow-x-hidden selection:bg-pink-200 selection:text-[#4a044e] font-raleway">
      {/* Scroll-driven Reading Progress Bar */}
      <ScrollProgressBar />

      {/* Floating Ambient Interactive Stickers */}
      <ScrollyStickers />

      {/* Dreamy Girly Pop Atmosphere, Floating Sparkle Orbs & Falling Rose Petals */}
      <SparklesBackground />

      {/* Cinematic Start Gate ("K." by Cigarettes After Sex & 3D Arched Portrait) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Top Editorial Masthead (Dreamy Strawberry Glass) */}
      <header className="sticky top-0 z-40 px-6 py-4 bg-white/85 backdrop-blur-xl border-b-2 border-[#f472b6]/30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-raleway tracking-[0.25em] text-[#831843] uppercase font-bold hidden sm:inline">
              SPECIAL ISSUE N° 16 • FEB 2026
            </span>
            <span className="text-[#f472b6] hidden sm:inline">|</span>
            <span className="font-signature text-2xl sm:text-3xl text-[#db2777] drop-shadow-xs">
              {BIRTHDAY_CONFIG.recipientName}
            </span>
          </div>

          <nav aria-label="Main sections" className="hidden md:flex items-center gap-4 text-xs font-semibold text-[#831843]">
            <a href="#memories" className="hover:text-[#db2777] transition-colors">Memories</a>
            <a href="#sound" className="hover:text-[#db2777] transition-colors">Music</a>
            <a href="#letter" className="hover:text-[#db2777] transition-colors">Letter</a>
            <a href="#guestbook" className="hover:text-[#db2777] transition-colors">Guestbook</a>
          </nav>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border-2 border-[#f472b6]/40 text-xs text-[#831843] font-raleway font-semibold">
            <Disc3 className="w-3.5 h-3.5 text-[#db2777] animate-spin" style={{ animationDuration: "8s" }} />
            <span className="tracking-wider uppercase text-[10px] sm:text-xs font-bold">
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
          title: "Little Pogo 🍼",
          subtitle: "The cutest, sweetest little human in the universe 🍼",
          image: "/media/pogo-baby-fur-smile.jpg",
          side: "left",
          rotate: -3.5,
          category: "little pogo",
          tagColor: "bg-pink-100 text-pink-700 border-pink-300",
        }}
      />

      {/* CHAPTER III: INTERACTIVE DUAL-LAYER PHOTO REVEAL (NO EMPTY GAP) */}
      <div id="scroll-reveal">
        <PhotoScrollReveal />
      </div>

      {/* CHAPTER IV: THE SOUND (TURNTABLE & MIXTAPE) */}
      <section id="sound" className="relative z-10 max-w-5xl mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="girly-tag mb-3">
            <Disc3 className="w-3.5 h-3.5 text-[#db2777]" />
            <span>CHAPTER IV • THE VINYL CHAMBER</span>
          </div>
          <h2 className="font-forum text-3xl sm:text-5xl text-[#831843] uppercase tracking-[0.06em]">
            Cigarettes After Sex &amp; Our Mixtape
          </h2>
          <p className="font-signature text-2xl text-[#9d174d] mt-2">
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

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

      {/* CHAPTER V: THE 16 REASONS (FEB 16 SPECIAL) */}
      <section id="reasons" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <div className="girly-tag mb-3">
            <Heart className="w-3.5 h-3.5 text-[#ec4899] fill-[#ec4899]" />
            <span>CHAPTER V • THE CHRONICLES</span>
          </div>
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

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

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

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

      {/* CHAPTER VII: THE ARCHIVAL LETTER */}
      <section id="letter" className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <div className="girly-tag mb-3">
            <Mail className="w-3.5 h-3.5 text-[#db2777]" />
            <span>CHAPTER VII • INTIMATE EPISTLE</span>
          </div>
        </div>
        <ArchivalLetter />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

      {/* CHAPTER VIII: THE SECRET VAULT ("pucchi") */}
      <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <div className="girly-tag mb-3">
            <Lock className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>CHAPTER VIII • CONFIDENTIAL ARCHIVE</span>
          </div>
        </div>
        <MidnightVault />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

      {/* CHAPTER IX: THE NOTES WALL */}
      <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-4">
          <div className="girly-tag mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#db2777]" />
            <span>CHAPTER IX • REMINDERS FOR YOUR HEART</span>
          </div>
        </div>
        <GuestbookWall />
      </section>

      <div className="max-w-2xl mx-auto editorial-rule my-6" />

      {/* CHAPTER X: YOUR REVIEW & THOUGHTS */}
      <WebsiteReview />

      {/* THE COLOPHON / EDITORIAL FOOTER (DREAMY STRAWBERRY FROSTED) */}
      <footer className="relative z-10 py-24 text-center border-t-2 border-[#f472b6]/35 bg-white/90 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 flex flex-col items-center">
          <span className="font-signature text-4xl sm:text-5xl text-[#db2777] mb-2 drop-shadow-xs">
            Harleen
          </span>
          <p className="font-forum text-xl font-normal text-[#831843] tracking-[0.15em] uppercase">
            FEBRUARY 16 • HARLEEN 4 LIFE • PUCCHI
          </p>
          <div className="w-20 editorial-rule my-4" />
          <p className="font-signature text-2xl text-[#9d174d]">
            &ldquo;You are my entire universe. Today, tomorrow, and always.&rdquo;
          </p>
          <div className="flex items-center gap-2 text-[10px] font-raleway tracking-[0.3em] uppercase text-[#831843] mt-6 font-bold">
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
