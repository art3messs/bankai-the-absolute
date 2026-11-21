"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for trailing outer ring
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let particleId = 0;
    const colors = ["#d97d93", "#d4af37", "#f2ccd6", "#e5c07b", "#ffffff"];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Spawn fairy dust trailing particle occasionally
      if (Math.random() > 0.45) {
        const newParticle: Particle = {
          id: particleId++,
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setParticles((prev) => [...prev.slice(-18), newParticle]);
      }

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.closest("button") ||
          target.closest("a") ||
          target.closest(".cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer";

        setIsHovered(!!isClickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Clean up particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timeout = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timeout);
  }, [particles]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Fairy Dust Trailing Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2, y: p.y + 16 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none blur-[0.5px]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}

      {/* Outer Magnetic Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-rose-300/60 pointer-events-none flex items-center justify-center shadow-[0_0_15px_rgba(217,125,147,0.3)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          backgroundColor: isHovered ? "rgba(212, 175, 55, 0.15)" : "rgba(217, 125, 147, 0.08)",
          borderColor: isHovered ? "rgba(212, 175, 55, 0.85)" : "rgba(217, 125, 147, 0.6)",
          transition: "width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s",
        }}
      />

      {/* Center Sparkle / Glowing Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center text-[10px]"
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
              : "w-2 h-2 bg-[#d97d93] shadow-[0_0_10px_#d97d93]"
          }`}
        />
      </motion.div>
    </div>
  );
}
