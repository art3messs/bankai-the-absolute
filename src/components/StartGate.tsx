"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Disc3, Heart, Headphones, ArrowDown, Star } from "lucide-react";
import confetti from "canvas-confetti";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const [isUnveiling, setIsUnveiling] = useState(false);

  // 3D Tilt physics for the portrait
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Floating rose petals for the romantic entrance
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 5.5) + (Math.sin(i) * 3),
    delay: (i * 0.45) % 6,
    duration: 6 + ((i * 0.7) % 5),
    size: 14 + ((i * 3) % 12),
  }));

  const handleTriggerStart = () => {
    if (isUnveiling) return;
    setIsUnveiling(true);

    // Synchronously unlock and trigger audio playback on user gesture (bypasses mobile Safari audio blocks)
    window.dispatchEvent(new CustomEvent("harleen:start-audio"));

    // Rose & champagne gold particle shower
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#db2777", "#ec4899", "#fbbf24", "#fef08a", "#ffffff"],
    });

    setTimeout(() => {
      onStart();
    }, 650);
  };

  // Lock body scroll while StartGate is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Scroll or swipe down anywhere on screen to unveil
  useEffect(() => {
    if (!isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 15) {
        handleTriggerStart();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (startY - e.touches[0].clientY > 25) {
        handleTriggerStart();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen, isUnveiling]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            transition: { duration: 0.75, ease: "easeInOut" },
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome Gate for Harleen's Birthday"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden"
          style={{
            background: "radial-gradient(circle at 50% 35%, #4a044e 0%, #2b0630 45%, #140217 100%)",
          }}
        >
          {/* ROMANTIC DRIFTING ROSE PETALS */}
          {petals.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -50, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0, 0.75, 0.85, 0],
                rotate: [0, 180, 360],
                x: [0, Math.sin(p.id) * 35, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute pointer-events-none select-none text-rose-300/40"
              style={{
                left: `${p.x}%`,
                fontSize: `${p.size}px`,
              }}
            >
              🌸
            </motion.div>
          ))}

          {/* Central Editorial Cinema Stage with 3D Perspective */}
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{
              scale: isUnveiling ? 1.05 : 1,
              y: isUnveiling ? -30 : 0,
              opacity: isUnveiling ? 0 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
            style={{ perspective: 1000 }}
          >
            {/* Top Serial / Issue Metadata */}
            <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase text-amber-200/90 font-semibold mb-4 bg-white/10 px-4 py-1.5 rounded-full border border-amber-300/30 backdrop-blur-md shadow-md">
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>ISSUE N° 16 • 16TH FEBRUARY</span>
              <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
            </div>

            {/* GRAND ARCHED LUXURY 3D PORTRAIT WITH MOUSE TILT */}
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleTriggerStart}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[3/4] max-w-[320px] rounded-[2.5rem] p-2 bg-gradient-to-b from-[#fbbf24]/50 via-[#ec4899]/30 to-[#4a044e]/60 border border-[#fbbf24]/40 shadow-[0_30px_70px_rgba(74,4,78,0.7)] cursor-pointer group transition-all"
            >
              <div
                className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-black/60 shadow-inner"
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
              >
                <img
                  src="/media/harleen-red-feather-dress.jpg"
                  alt="Harleen"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[1.02] contrast-[1.02]"
                />

                {/* Dynamic Specular Sheen across glass in 3D */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-35 transition-opacity duration-300 z-20"
                  style={{
                    background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 65%)`,
                  }}
                />

                {/* Subtle Cinematic Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#140217]/90 via-transparent to-black/30 pointer-events-none" />

                {/* Top Badge: Soundtrack Pill in 3D */}
                <div
                  className="absolute top-3.5 inset-x-3.5 flex items-center justify-between text-xs text-white z-10"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                    <Disc3 className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
                    <span className="text-[10px] tracking-wider uppercase font-medium">CAS • K.</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-rose-600/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                    HARLEEN 4 LIFE
                  </div>
                </div>

                {/* Bottom Typography on Portrait in 3D Space */}
                <div
                  className="absolute bottom-5 inset-x-4 flex flex-col items-center text-center text-white z-10"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <span className="font-signature text-5xl sm:text-6xl text-rose-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {recipientName}
                  </span>
                  <p className="font-forum text-sm sm:text-base uppercase tracking-[0.16em] text-amber-100 mt-1 font-light drop-shadow-md">
                    The Sweetest Soul In My Universe
                  </p>

                  {/* Pulsing Scroll Indicator */}
                  <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/40 shadow-lg text-white text-[10px] font-raleway font-bold uppercase tracking-[0.2em] group-hover:bg-white/40 transition-all">
                    <ArrowDown className="w-3.5 h-3.5 text-amber-200 animate-bounce" />
                    <span>Scroll Down On Photo To Enter</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tap To Enter Button Alternative */}
            <button
              onClick={handleTriggerStart}
              className="mt-6 px-8 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-[#db2777] via-[#ec4899] to-[#fbbf24] text-white font-raleway font-bold text-xs uppercase tracking-[0.22em] shadow-[0_10px_35px_rgba(219,39,119,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer z-10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Step Into Your Universe ✦</span>
            </button>

            {/* Soundtrack Notice */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-rose-200/70 mt-4 tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>Cigarettes After Sex — &ldquo;K.&rdquo;</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
