"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  char?: string;
  vx?: number;
  vy?: number;
}

let globalParticleCounter = 0;

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bursts, setBursts] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const lastSpawnTime = useRef(0);
  const lastPos = useRef({ x: -100, y: -100 });

  // Spring physics for smooth outer halo
  const springConfig = { damping: 26, stiffness: 380, mass: 0.45 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const celestialColors = [
      "#d4af37", // Champagne Gold
      "#e5c07b", // Soft Gold
      "#d97d93", // Soft Blush Rose
      "#c95874", // Deep Petal
      "#ffffff", // Starlight White
    ];
    const sparkleGlyphs = ["✦", "✧", "•", "✨", "♥"];

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

      // Throttled particle trail: spawns every 45ms if moved > 8px
      if (now - lastSpawnTime.current > 45 && dist > 8) {
        lastSpawnTime.current = now;
        lastPos.current = { x: clientX, y: clientY };

        globalParticleCounter++;
        const isStar = Math.random() > 0.45;
        const newParticle: Particle = {
          id: `trail-${now.toFixed(0)}-${globalParticleCounter}`,
          x: clientX + (Math.random() * 12 - 6),
          y: clientY + (Math.random() * 12 - 6),
          size: isStar ? 12 : Math.random() * 3 + 2,
          color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
          char: isStar ? sparkleGlyphs[Math.floor(Math.random() * sparkleGlyphs.length)] : undefined,
        };

        setParticles((prev) => {
          const updated = prev.length > 16 ? prev.slice(-16) : prev;
          return [...updated, newParticle];
        });
      }

      // Detect hover on clickables without forcing getComputedStyle
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          "button, a, input, textarea, select, [role='button'], .cursor-pointer, [data-clickable]"
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      const { clientX, clientY } = e;

      // Burst of sparkling stars upon clicking
      const clickBursts: Particle[] = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 35 + 20;
        globalParticleCounter++;
        return {
          id: `burst-${Date.now()}-${globalParticleCounter}`,
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() > 0.5 ? 13 : 9,
          color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
          char: sparkleGlyphs[Math.floor(Math.random() * sparkleGlyphs.length)],
        };
      });

      setBursts((prev) => [...prev, ...clickBursts]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((p) => !clickBursts.includes(p)));
      }, 700);
    };

    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Clean up older particles gently
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setInterval(() => {
      setParticles((prev) => {
        if (prev.length <= 1) return [];
        return prev.slice(1);
      });
    }, 180);

    return () => clearInterval(timer);
  }, [particles.length > 0]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Click Burst Particles */}
      {bursts.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 1, scale: 1, x: b.x, y: b.y }}
          animate={{
            opacity: 0,
            scale: 0.2,
            x: b.x + (b.vx || 0),
            y: b.y + (b.vy || 0),
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 font-bold pointer-events-none drop-shadow-md select-none"
          style={{
            fontSize: `${b.size}px`,
            color: b.color,
          }}
        >
          {b.char || "✦"}
        </motion.div>
      ))}

      {/* Fairy Dust Trailing Particles */}
      {particles.map((p) =>
        p.char ? (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.95, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3, y: p.y + 16, rotate: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -translate-x-1/2 -translate-y-1/2 font-normal pointer-events-none select-none drop-shadow-xs"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              fontSize: `${p.size}px`,
              color: p.color,
            }}
          >
            {p.char}
          </motion.div>
        ) : (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2, y: p.y + 16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none blur-[0.4px]"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        )
      )}

      {/* Outer Magnetic Glowing Halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center transition-all duration-200"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 52 : isMouseDown ? 22 : 32,
          height: isHovered ? 52 : isMouseDown ? 22 : 32,
          backgroundColor: isHovered
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(217, 125, 147, 0.08)",
          borderColor: isHovered
            ? "rgba(212, 175, 55, 0.75)"
            : "rgba(217, 125, 147, 0.45)",
          borderWidth: "1.5px",
          boxShadow: isHovered
            ? "0 0 20px rgba(212, 175, 55, 0.35)"
            : "0 0 12px rgba(217, 125, 147, 0.2)",
        }}
      />

      {/* Center Sparkle Pin / Core */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered
              ? "w-2.5 h-2.5 bg-[#d4af37] shadow-[0_0_12px_#d4af37] scale-125"
              : isMouseDown
              ? "w-1.5 h-1.5 bg-[#c95874] scale-90"
              : "w-2 h-2 bg-[#d97d93] shadow-[0_0_8px_#d97d93]"
          }`}
        />
      </motion.div>
    </div>
  );
}
