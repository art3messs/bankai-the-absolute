"use client";

import React, { useState, useRef } from "react";
import { Sparkles, Heart, ArrowLeftRight, Crown } from "lucide-react";

export default function PhotoScrollReveal() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    setSliderPos(pct);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Accessible hidden range input */}
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(sliderPos)}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="sr-only"
        aria-label="Slide to compare warm embrace and royal emerald tiara photos"
      />

      {/* Eyebrow Tag */}
      <div className="girly-tag mb-3">
        <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
        <span>INTERACTIVE DUAL-LAYER REVEAL</span>
        <Heart className="w-3.5 h-3.5 text-[#ec4899] fill-[#ec4899]" />
      </div>

      <h2 className="font-forum text-3xl sm:text-4xl text-[#3A1F2B] uppercase tracking-[0.06em]">
        Slide To Unveil Your World 🤍
      </h2>
      <p className="font-signature text-2xl text-[#B0295F] mt-1">
        &ldquo;Drag the golden handle across to switch between your royal elegance &amp; sweetest embrace.&rdquo;
      </p>

      {/* Interactive Photo Comparison Card */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "pan-y" }}
        className="relative w-full max-w-2xl aspect-[4/5] sm:aspect-[16/11] mt-6 rounded-2xl overflow-hidden border-2 border-[#FFD9E3] shadow-[0_20px_50px_rgba(176,41,95,0.12)] cursor-ew-resize select-none bg-stone-950 group"
      >
        {/* UNDER LAYER: Warm Hug & Pucchi Smile */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/media/harleen-warm-hug.jpg"
            alt="Harleen Warm Hug"
            className="w-full h-full object-cover object-center filter brightness-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a044e]/70 via-transparent to-black/20" />

          {/* Under Label */}
          <div className="absolute bottom-5 right-5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#FFD9E3] shadow-md text-xs font-bold text-[#3A1F2B] flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-[#B0295F] fill-[#B0295F]" />
            <span>Warm Embrace • Safe &amp; Cherished</span>
          </div>
        </div>

        {/* TOP LAYER: Royal Tiara (Clipped by slider position) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <img
            src="/media/ethnic-dragonfly-tiara.jpg"
            alt="Harleen Royal Tiara"
            className="w-full h-full object-cover object-center filter brightness-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a044e]/70 via-transparent to-black/20" />

          {/* Top Label */}
          <div className="absolute bottom-5 left-5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-md text-xs font-bold text-[#3A1F2B] flex items-center gap-1.5">
            <Crown className="w-3 h-3 text-[#fbbf24]" />
            <span>Royal Emerald Grace • Desi Queen</span>
          </div>
        </div>

        {/* SLIDER DIVIDER BAR */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-white via-[#fbbf24] to-white shadow-[0_0_15px_rgba(251,191,36,0.9)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Central Circular Drag Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl border-2 border-[#f472b6] flex items-center justify-center text-[#db2777]">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        {/* Tap/Slide Prompt Overlay on Initial Load */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white text-[10px] font-mono tracking-widest uppercase pointer-events-none shadow-md">
          ← Drag or move mouse to wipe →
        </div>
      </div>
    </section>
  );
}
