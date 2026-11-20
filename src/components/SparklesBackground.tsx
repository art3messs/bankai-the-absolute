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
    const newStars: Star[] = Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(newStars);

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("input") || target.closest("textarea")) {
        return;
      }

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Color Theory: 60% Noir, 30% Dusty Rose, 10% Champagne Gold!
      confetti({
        particleCount: 16,
        spread: 60,
        origin: { x, y },
        colors: ["#fde047", "#fef08a", "#e0a4b8", "#f4c2ce", "#ffffff"],
        ticks: 160,
        gravity: 0.8,
        scalar: 0.85,
      });
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden film-grain">
      {/* Ambient Noir & Rose Nebulas */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-rose-900/10 rounded-full blur-[160px] animate-breathe" />
      <div className="absolute top-1/2 -right-40 w-[28rem] h-[28rem] bg-amber-400/5 rounded-full blur-[140px] animate-breathe" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] bg-purple-950/20 rounded-full blur-[150px] animate-breathe" style={{ animationDelay: "4s" }} />

      {/* Gold & Starlight Specks */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-amber-100 shadow-[0_0_6px_rgba(253,224,71,0.6)]"
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
