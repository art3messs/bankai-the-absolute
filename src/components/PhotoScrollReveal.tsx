"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { COPY } from "@/data/copy";

export default function PhotoScrollReveal() {
  const [sliderPos, setSliderPos] = useState(50);
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
    <section id="reveal" className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(sliderPos)}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="sr-only"
        aria-label="Slide to compare warm embrace and royal emerald tiara photos"
      />

      {/* Heading in sentence case, no tag */}
      <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
        {COPY.photoReveal.heading}
      </h2>
      <p className="font-hand text-2xl text-ink/80 mt-2">
        &ldquo;{COPY.photoReveal.instruction}&rdquo;
      </p>

      {/* Interactive Photo Wipe Card */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "pan-y" }}
        className="relative w-full max-w-2xl aspect-[4/5] sm:aspect-[16/11] mt-6 rounded-2xl overflow-hidden border border-mauve/20 shadow-md cursor-ew-resize select-none bg-stone-900"
      >
        {/* UNDER LAYER */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/media/harleen-warm-hug.jpg"
            alt="Warm embrace"
            fill
            sizes="(max-width: 640px) 100vw, 672px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-paper/95 border border-mauve/20 text-xs font-sans text-ink">
            {COPY.photoReveal.beforeLabel}
          </div>
        </div>

        {/* TOP LAYER (Clipped by slider position) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <Image
            src="/media/ethnic-dragonfly-tiara.jpg"
            alt="Royal emerald tiara"
            fill
            sizes="(max-width: 640px) 100vw, 672px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-paper/95 border border-mauve/20 text-xs font-sans text-ink">
            {COPY.photoReveal.afterLabel}
          </div>
        </div>

        {/* SLIDER DIVIDER BAR (Strawberry & White) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-paper shadow-sm pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Strawberry circular handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-paper shadow-md border-2 border-strawberry flex items-center justify-center text-strawberry">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>

        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-paper/90 border border-mauve/20 text-ink text-[11px] font-sans pointer-events-none">
          {COPY.photoReveal.dragHint}
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button
          type="button"
          onClick={() => setSliderPos(0)}
          className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
            sliderPos === 0
              ? "bg-strawberry text-paper font-semibold shadow-xs"
              : "bg-paper text-ink/75 border border-mauve/20 hover:border-mauve/50"
          }`}
        >
          Warm Embrace
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(50)}
          className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
            sliderPos === 50
              ? "bg-strawberry text-paper font-semibold shadow-xs"
              : "bg-paper text-ink/75 border border-mauve/20 hover:border-mauve/50"
          }`}
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPos(100)}
          className={`px-3 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
            sliderPos === 100
              ? "bg-strawberry text-paper font-semibold shadow-xs"
              : "bg-paper text-ink/75 border border-mauve/20 hover:border-mauve/50"
          }`}
        >
          Royal Emerald
        </button>
      </div>
    </section>
  );
}
