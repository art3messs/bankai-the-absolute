"use client";

import React, { useEffect, useState } from "react";
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
  rotate: number;
  swayDistance: number;
  symbol: string;
}

export default function SparklesBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // 36 ambient twinkle stars
    const newStars: Star[] = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 1.2,
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 2.5,
      opacity: Math.random() * 0.6 + 0.35,
    }));
    setStars(newStars);

    // 22 drifting romantic rose petals & blossoms
    const symbols = ["🌸", "🌹", "✨", "🤍", "🌸"];
    const newPetals: Petal[] = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: Math.random() * 96,
      size: 14 + (i % 4) * 4,
      duration: 11 + ((i * 1.7) % 8),
      delay: ((i * 1.1) % 9),
      rotate: Math.random() * 360,
      swayDistance: 25 + (i % 3) * 15,
      symbol: symbols[i % symbols.length],
    }));
    setPetals(newPetals);

    // Global click: Romantic Rose Petal & Champagne Gold Burst
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("a")
      ) {
        return;
      }

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Dreamy Girly Pop colors: Strawberry Pink, Soft Peach, Champagne Gold & Cream
      confetti({
        particleCount: 22,
        spread: 75,
        origin: { x, y },
        colors: ["#db2777", "#ec4899", "#f472b6", "#fbbf24", "#fed7aa", "#ffffff"],
        ticks: 220,
        gravity: 0.7,
        scalar: 0.95,
        shapes: ["circle"],
      });
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dreamy Girly Pop Ambient Sparkle Orbs (from Importance_of_Cinema_in_Indian_Culture) */}
      <div className="absolute -top-28 -left-28 w-[36rem] h-[36rem] bg-[#f472b6]/25 rounded-full blur-[100px] animate-dreamy" />
      <div
        className="absolute top-1/4 -right-24 w-[34rem] h-[34rem] bg-[#fed7aa]/35 rounded-full blur-[110px] animate-dreamy"
        style={{ animationDelay: "2.5s" }}
      />
      <div
        className="absolute top-2/3 left-1/4 w-[38rem] h-[38rem] bg-[#e9d5ff]/30 rounded-full blur-[120px] animate-dreamy"
        style={{ animationDelay: "4.5s" }}
      />
      <div
        className="absolute -bottom-24 right-1/3 w-[32rem] h-[32rem] bg-[#fbcfe8]/35 rounded-full blur-[90px] animate-dreamy"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Golden Fairy Dust Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fef08a] shadow-[0_0_8px_rgba(251,191,36,0.85)]"
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

      {/* Romantic Falling Rose Petals & Stardust */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute select-none pointer-events-none text-rose-400/40"
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

      {/* Keyframe Styles for Drift & Sway */}
      <style jsx global>{`
        @keyframes fallAndSway {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.65;
          }
          50% {
            transform: translateY(50vh) translateX(30px) rotate(180deg);
            opacity: 0.7;
          }
          90% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(105vh) translateX(-25px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
