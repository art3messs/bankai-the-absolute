"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

let globalParticleCounter = 0;

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const lastSpawnTime = useRef(0);
  const lastPos = useRef({ x: -100, y: -100 });

  // Spring physics for trailing outer ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const colors = ["#d97d93", "#d4af37", "#f2ccd6", "#e5c07b", "#ffffff"];

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

      // Throttled particle spawning: max 1 particle per 60ms, only when moved > 10px
      if (now - lastSpawnTime.current > 60 && dist > 10) {
        lastSpawnTime.current = now;
        lastPos.current = { x: clientX, y: clientY };

        globalParticleCounter++;
        const newParticle: Particle = {
          id: `p-${now.toFixed(0)}-${globalParticleCounter}`,
          x: clientX + (Math.random() * 8 - 4),
          y: clientY + (Math.random() * 8 - 4),
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setParticles((prev) => {
          const updated = prev.length > 12 ? prev.slice(-12) : prev;
          return [...updated, newParticle];
        });
      }

      // Check if hovering clickable without triggering getComputedStyle reflow
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          "button, a, input, textarea, select, [role='button'], .cursor-pointer, [data-clickable]"
        );
        setIsHovered(isClickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
    }, 200);

    return () => clearInterval(timer);
  }, [particles.length > 0]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Fairy Dust Trailing Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2, y: p.y + 14 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none blur-[0.5px]"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}

      {/* Outer Magnetic Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center shadow-[0_0_15px_rgba(217,125,147,0.25)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 48 : 30,
          height: isHovered ? 48 : 30,
          backgroundColor: isHovered ? "rgba(212, 175, 55, 0.12)" : "rgba(217, 125, 147, 0.06)",
          borderColor: isHovered ? "rgba(212, 175, 55, 0.8)" : "rgba(217, 125, 147, 0.5)",
          transition: "width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s",
        }}
      />

      {/* Center Sparkle Dot */}
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
              ? "w-2.5 h-2.5 bg-[#d4af37] shadow-[0_0_10px_#d4af37] scale-125"
              : "w-2 h-2 bg-[#d97d93] shadow-[0_0_8px_#d97d93]"
          }`}
        />
      </motion.div>
    </div>
  );
}
