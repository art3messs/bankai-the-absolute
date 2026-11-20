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
    // Generate stars for the pink galaxy background
    const newStars: Star[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(newStars);

    // Global click listener for romantic confetti burst
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't burst if clicking directly on buttons or inputs to avoid distraction
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("input") || target.closest("textarea")) {
        return;
      }

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      confetti({
        particleCount: 18,
        spread: 60,
        origin: { x, y },
        colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
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
      {/* Ambient Pink Nebulas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pink-pulse" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-rose-500/15 rounded-full blur-[140px] animate-pink-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[130px] animate-pink-pulse" style={{ animationDelay: "1s" }} />

      {/* Twinkling Starfield */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-pink-100 shadow-[0_0_8px_rgba(255,192,203,0.8)]"
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
