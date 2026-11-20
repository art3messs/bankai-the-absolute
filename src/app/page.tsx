"use client";

import React, { useState } from "react";
import { BIRTHDAY_CONFIG } from "@/data/config";
import SparklesBackground from "@/components/SparklesBackground";
import StartGate from "@/components/StartGate";
import BirthdayCake from "@/components/BirthdayCake";
import CalendarCard from "@/components/CalendarCard";
import MusicPlayer from "@/components/MusicPlayer";
import { Heart, Sparkles, Image as ImageIcon, Mail, Lock, MessageSquare } from "lucide-react";

export default function HomePage() {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#1c0612] via-[#14050d] to-[#0a0207] overflow-x-hidden">
      {/* Dynamic Starfield & Global Confetti Clicker */}
      <SparklesBackground />

      {/* Cinematic Start Gate (Tap to Enter & Start Music) */}
      <StartGate
        isOpen={!hasStarted}
        onStart={() => setHasStarted(true)}
        recipientName={BIRTHDAY_CONFIG.recipientName}
      />

      {/* Floating Top Header & Music Player */}
      <header className="sticky top-0 z-40 px-4 py-3 bg-[#14050d]/60 backdrop-blur-md border-b border-pink-500/15">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-serif font-extrabold text-base md:text-lg bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
              {BIRTHDAY_CONFIG.recipientName}&apos;s Birthday Universe
            </span>
          </div>

          {/* Music Player */}
          <MusicPlayer autoPlayTrigger={hasStarted} />
        </div>
      </header>

      {/* Hero Celebration Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-16 flex flex-col items-center">
        {/* Celebration Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>February 16 • Special Celebration</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_10px_35px_rgba(255,105,180,0.35)] leading-tight tracking-tight">
            Happy Birthday {BIRTHDAY_CONFIG.recipientName} <span className="inline-block animate-bounce">💖</span>
          </h1>

          <p className="font-hand text-2xl md:text-3xl text-pink-200/90 mt-2 max-w-xl mx-auto drop-shadow-md">
            Wishing the sweetest, prettiest, and most iconic girl the happiest day!
          </p>
        </div>

        {/* Interactive Cake & Calendar Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center w-full max-w-4xl">
          {/* Interactive Strawberry Cake */}
          <div className="flex justify-center w-full">
            <BirthdayCake recipientName={BIRTHDAY_CONFIG.recipientName} />
          </div>

          {/* February 16 Calendar Card */}
          <div className="flex justify-center w-full">
            <CalendarCard />
          </div>
        </div>

        {/* Section Quick Jump Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
          <a
            href="#memories"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-pink-500/20 text-pink-200 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md border border-pink-400/30"
          >
            <ImageIcon className="w-4 h-4 text-pink-300" />
            <span>Photo Memories</span>
          </a>

          <a
            href="#letter"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-pink-500/20 text-pink-200 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md border border-pink-400/30"
          >
            <Mail className="w-4 h-4 text-pink-300" />
            <span>Open Love Letter</span>
          </a>

          <a
            href="#vault"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-pink-500/20 text-pink-200 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md border border-pink-400/30"
          >
            <Lock className="w-4 h-4 text-pink-300" />
            <span>Secret Vault</span>
          </a>

          <a
            href="#guestbook"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-pink-500/20 text-pink-200 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md border border-pink-400/30"
          >
            <MessageSquare className="w-4 h-4 text-pink-300" />
            <span>Wishes & Guestbook</span>
          </a>
        </div>
      </section>
    </main>
  );
}
