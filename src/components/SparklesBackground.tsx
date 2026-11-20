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

export default function SparklesBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.6 + 0.3,
    }));
    setStars(newStars);

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("input") || target.closest("textarea")) {
        return;
      }

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // 60-30-10 Confetti: Pearl White, Strawberry Pink, Champagne Gold!
      confetti({
        particleCount: 18,
        spread: 60,
        origin: { x, y },
        colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
        ticks: 180,
        gravity: 0.8,
        scalar: 0.9,
      });
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft Luminous Cloud Nebulas */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-rose-200/40 rounded-full blur-[140px] animate-dreamy" />
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-amber-100/50 rounded-full blur-[130px] animate-dreamy" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] bg-pink-100/60 rounded-full blur-[150px] animate-dreamy" style={{ animationDelay: "4s" }} />

      {/* Golden Fairy Dust Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
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
    </div>
  );
}
