"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";
import { getBirthdayDetails } from "@/data/config";

export default function Hero3D() {
  const details = getBirthdayDetails();
  const [daysCount, setDaysCount] = useState<number>(details.daysRemaining);

  useEffect(() => {
    const timer = setTimeout(() => {
      const live = getBirthdayDetails(new Date());
      setDaysCount(live.daysRemaining);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePortraitTap = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.4 },
      colors: ["#D4285A", "#F4B9C9", "#FFF9FA", "#8A5A6E"],
    });
  };

  const isBirthdayToday = daysCount === 0;

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 flex flex-col items-center text-center">
      {/* Large Framed Portrait */}
      <div className="w-full max-w-md sm:max-w-lg mb-6">
        <div
          onClick={handlePortraitTap}
          className="bg-paper p-3 sm:p-4 rounded-3xl border border-mauve/20 shadow-md cursor-pointer group hover:shadow-lg transition-shadow"
          title="Tap portrait for a sweet surprise!"
        >
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-mauve/10">
            <Image
              src="/media/harleen-red-feather-dress.jpg"
              alt="Harleen in red feather dress"
              fill
              priority
              sizes="(max-width: 640px) 90vw, 480px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="font-hand text-2xl sm:text-3xl text-mauve">
              {COPY.hero.badge}
            </p>
            <span className="font-sans text-[11px] text-mauve/70 uppercase tracking-wider block mt-0.5">
              {COPY.hero.photoLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Name, Age Badge, Date, and Countdown */}
      <h1 className="font-serif text-5xl sm:text-7xl text-ink tracking-tight font-normal">
        {COPY.hero.name}
      </h1>

      <div className="mt-3 inline-flex items-center gap-2 bg-paper px-4 py-1.5 rounded-full border border-mauve/20">
        <span className="font-sans font-semibold text-strawberry text-sm sm:text-base">
          Turning {details.turningAge}
        </span>
      </div>

      <p className="mt-3 text-ink/80 text-sm sm:text-base font-sans">
        {isBirthdayToday
          ? "🎉 Today is your special day! Happy Birthday, Pucchi! 🎂✨"
          : `${daysCount} days to ${details.formattedDate}`}
      </p>

      {/* Intimate Quote */}
      <p className="mt-6 text-ink/90 text-base sm:text-lg max-w-xl font-sans leading-relaxed">
        &ldquo;{COPY.hero.quote}&rdquo;
      </p>
    </section>
  );
}
