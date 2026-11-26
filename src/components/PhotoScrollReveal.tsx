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
    <section id="reveal" className="relative z-10 max-w-4xl mx-auto px-4 py-7 sm:py-10 flex flex-col items-center text-center">
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(sliderPos)}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="sr-only"
        aria-label="Slide to compare warm embrace and royal emerald tiara photos"
      />

      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.photoReveal.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2 max-w-xl">
        &ldquo;{COPY.photoReveal.instruction}&rdquo;
      </p>

      {/* Exhibition Matte Outer Frame with Dual-Tone Ambient Halo */}
      <div className="relative w-full max-w-2xl mt-7 p-2.5 sm:p-3.5 rounded-[28px] paper-card shadow-[0_24px_60px_rgba(43,21,36,0.12)]">
        {/* Dynamic Left Emerald-Gold vs Right Warm-Rose Glow reactive to slider */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] blur-2xl transition-opacity duration-300"
          style={{
            opacity: 0.35 + (sliderPos / 100) * 0.45,
            background: "radial-gradient(circle at 22% 50%, rgba(200,155,60,0.45), transparent 65%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] blur-2xl transition-opacity duration-300"
          style={{
            opacity: 0.35 + ((100 - sliderPos) / 100) * 0.45,
            background: "radial-gradient(circle at 78% 50%, rgba(212,40,90,0.32), transparent 65%)",
          }}
        />
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "pan-y" }}
          className="relative w-full aspect-[4/5] sm:aspect-[16/11] rounded-[20px] overflow-hidden border border-gold/30 cursor-ew-resize select-none bg-stone-900"
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
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-black/15 pointer-events-none" />

            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 max-w-[44%] sm:max-w-none truncate px-3 py-1.5 rounded-full bg-paper/95 backdrop-blur-md border border-gold/40 text-[10px] sm:text-xs font-sans text-ink shadow-sm">
              {COPY.photoReveal.beforeLabel}
            </div>
          </div>

          {/* TOP LAYER */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              transition: isDragging ? "none" : "clip-path 380ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <Image
              src="/media/ethnic-dragonfly-tiara.jpg"
              alt="Royal emerald tiara"
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-black/15 pointer-events-none" />

            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 max-w-[44%] sm:max-w-none truncate px-3 py-1.5 rounded-full bg-paper/95 backdrop-blur-md border border-gold/40 text-[10px] sm:text-xs font-sans text-ink shadow-sm">
              {COPY.photoReveal.afterLabel}
            </div>
          </div>

          {/* LUMINOUS SLIDER SEAM + STRAWBERRY HANDLE */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold-light via-paper to-gold-light shadow-[0_0_16px_rgba(212,40,90,0.6)] pointer-events-none z-20"
            style={{
              left: `${sliderPos}%`,
              transition: isDragging ? "none" : "left 380ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-paper shadow-[0_6px_22px_rgba(43,21,36,0.28)] border-2 border-strawberry ring-2 ring-gold-light/70 flex items-center justify-center text-strawberry">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-paper/92 backdrop-blur-md border border-gold/35 text-ink text-[11px] font-sans pointer-events-none whitespace-nowrap shadow-xs">
            {COPY.photoReveal.dragHint}
          </div>
        </div>
      </div>

      {/* Quick Preset Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        {[
          { label: "Royal Emerald", val: 100 },
          { label: "50 / 50 Split", val: 50 },
          { label: "Warm Embrace", val: 0 },
        ].map((preset) => {
          const active = Math.round(sliderPos) === preset.val;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setSliderPos(preset.val)}
              className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-sans transition-all cursor-pointer ${
                active
                  ? "bg-strawberry text-paper font-semibold shadow-sm border border-gold-light/30"
                  : "bg-paper text-ink/80 border border-gold/30 hover:border-strawberry/50"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
