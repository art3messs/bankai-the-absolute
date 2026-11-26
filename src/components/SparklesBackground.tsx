"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import confetti from "canvas-confetti";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  symbol: string;
}

function pseudoRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const STARS: Star[] = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  x: pseudoRand(i * 1.31 + 2.7) * 98 + 1,
  y: pseudoRand(i * 2.73 + 5.1) * 98 + 1,
  size: pseudoRand(i * 3.17 + 1.2) * 2.2 + 1.4,
  duration: pseudoRand(i * 4.39 + 3.4) * 3 + 2.6,
  delay: pseudoRand(i * 5.91 + 0.8) * 2.5,
  opacity: pseudoRand(i * 7.13 + 6.2) * 0.45 + 0.25,
}));

const PETAL_SYMBOLS = ["🌸", "✨", "🤍", "🌹"];
const PETALS: Petal[] = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: pseudoRand(i * 2.45 + 1.7) * 94 + 2,
  size: 13 + (i % 3) * 3,
  duration: 13 + ((i * 1.9) % 8),
  delay: (i * 1.2) % 9,
  symbol: PETAL_SYMBOLS[i % PETAL_SYMBOLS.length],
}));

const emptySubscribe = () => () => {};

export default function SparklesBackground() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncTimer = setTimeout(() => setReducedMotion(mq.matches), 0);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);

    let lastClickTime = 0;
    const handleGlobalClick = (e: MouseEvent) => {
      if (mq.matches) return;
      const now = Date.now();
      if (now - lastClickTime < 350) return;
      lastClickTime = now;

      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("a") ||
        target.closest("[role='button']")
      ) {
        return;
      }

      confetti({
        particleCount: 18,
        spread: 68,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#F6E5B6", "#FFF9FA"],
        ticks: 180,
        gravity: 0.72,
        scalar: 0.88,
        shapes: ["circle"],
      });
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      clearTimeout(syncTimer);
      mq.removeEventListener("change", onChange);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Velvet Rose & Champagne Atmospheric Glows */}
      <div className="absolute -top-28 -left-28 w-[34rem] h-[34rem] bg-[#FFDEE8]/55 rounded-full blur-[100px] animate-dreamy" />
      <div
        className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] bg-[#FDE4C8]/45 rounded-full blur-[110px] animate-dreamy"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[36rem] h-[36rem] bg-[#F4B9C9]/45 rounded-full blur-[120px] animate-dreamy"
        style={{ animationDelay: "4.5s" }}
      />

      {/* Champagne Gold Dust Stars */}
      {!reducedMotion &&
        STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-gradient-to-r from-[#C89B3C] to-[#F6E5B6] shadow-[0_0_8px_rgba(200,155,60,0.65)]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

      {/* Delicate Falling Petals & Stardust */}
      {!reducedMotion &&
        PETALS.map((petal) => (
          <div
            key={petal.id}
            className="absolute select-none pointer-events-none text-strawberry/30"
            style={{
              left: `${petal.left}%`,
              fontSize: `${petal.size}px`,
              top: "-40px",
              animation: `fallAndSway ${petal.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
              animationDelay: `${petal.delay}s`,
            }}
          >
            {petal.symbol}
          </div>
        ))}

      <style jsx global>{`
        @keyframes fallAndSway {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.55;
          }
          50% {
            transform: translateY(50vh) translateX(26px) rotate(180deg);
            opacity: 0.6;
          }
          88% {
            opacity: 0.45;
          }
          100% {
            transform: translateY(105vh) translateX(-22px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
