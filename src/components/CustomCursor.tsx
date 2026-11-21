"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface TrailItem {
  id: number;
  x: number;
  y: number;
  char: string;
  size: number;
  color: string;
}

let counter = 0;

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<TrailItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const lastSpawn = useRef(0);
  const lastCoord = useRef({ x: -100, y: -100 });

  // Spring physics for smooth ambient halo
  const springConfig = { damping: 24, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show on desktop / pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    const sparkleChars = ["♥", "✦", "✨", "✧", "🤍"];
    const colors = ["#d4af37", "#f43f5e", "#ff758f", "#fbbf24", "#ffffff"];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastCoord.current.x, e.clientY - lastCoord.current.y);

      // Spawn ethereal stardust trail
      if (now - lastSpawn.current > 40 && dist > 10) {
        lastSpawn.current = now;
        lastCoord.current = { x: e.clientX, y: e.clientY };

        counter++;
        const newTrail: TrailItem = {
          id: counter,
          x: e.clientX + (Math.random() * 8 - 4),
          y: e.clientY + (Math.random() * 8 - 4),
          char: sparkleChars[Math.floor(Math.random() * sparkleChars.length)],
          size: Math.floor(Math.random() * 6) + 11,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setTrails((prev) => [...prev.slice(-12), newTrail]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track clickable / interactive hover elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInput = !!target.closest("input, textarea");
      if (isInput) {
        setIsHovered(false);
        return;
      }
      const isInteractive = !!target.closest(
        'button, a, [role="button"], video, img, .cursor-pointer'
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  // Clean old trail items
  useEffect(() => {
    if (trails.length === 0) return;
    const timer = setTimeout(() => {
      setTrails((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [trails]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Floating Fairy Dust Trails */}
      {trails.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0.9, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.2, y: 18 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 font-bold pointer-events-none drop-shadow-sm select-none"
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            fontSize: `${t.size}px`,
            color: t.color,
          }}
        >
          {t.char}
        </motion.div>
      ))}

      {/* Outer Magnetic Ambient Halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center transition-all duration-150"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 48 : isClicking ? 20 : 32,
          height: isHovered ? 48 : isClicking ? 20 : 32,
          backgroundColor: isHovered
            ? "rgba(212, 175, 55, 0.15)"
            : "rgba(244, 63, 94, 0.08)",
          borderColor: isHovered
            ? "rgba(212, 175, 55, 0.85)"
            : "rgba(217, 125, 147, 0.5)",
          borderWidth: isHovered ? "1.5px" : "1px",
          boxShadow: isHovered
            ? "0 0 20px rgba(212, 175, 55, 0.4)"
            : "0 0 10px rgba(217, 125, 147, 0.25)",
        }}
      />

      {/* Main Cursor Core: Glowing Rose Heart / Pin */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.75 : isHovered ? 1.3 : 1,
            rotate: isHovered ? 12 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative flex items-center justify-center"
        >
          {isHovered ? (
            <span className="text-sm drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
              ✨
            </span>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#c95874] via-[#f43f5e] to-[#d4af37] shadow-[0_0_10px_#f43f5e]" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
