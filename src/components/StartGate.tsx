"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Headphones, ArrowDown } from "lucide-react";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";

interface StartGateProps {
  onStart: () => void;
  isOpen: boolean;
  recipientName: string;
}

export default function StartGate({ onStart, isOpen, recipientName }: StartGateProps) {
  const [isUnveiling, setIsUnveiling] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const hasTriggeredRef = useRef(false);
  const gateRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Exact motion values specified
  const zoomProgress = useMotionValue(0);
  const zoomProgressRef = useRef(0);
  const easedZoomProgress = useSpring(zoomProgress, { damping: 28, stiffness: 115, mass: 0.8 });
  const portraitScale = useTransform(easedZoomProgress, [0, 0.2, 0.65, 1], [1, 1.18, 2.7, 5.5]);
  const gateOpacity = useTransform(easedZoomProgress, [0.75, 1], [1, 0]);

  // 3D Tilt physics for portrait card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
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

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = setTimeout(() => {
      setPrefersReducedMotion(mq.matches);
    }, 0);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      clearTimeout(timer);
      mq.removeEventListener("change", handler);
    };
  }, []);

  // Floating rose petals for the romantic entrance (stopped when reduced motion)
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 5.5) + (Math.sin(i) * 3),
    delay: (i * 0.45) % 6,
    duration: 6 + ((i * 0.7) % 5),
    size: 14 + ((i * 3) % 12),
  }));

  // Idempotent start handler
  const handleTriggerStart = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsUnveiling(true);

    // Call play() directly on audio element if available
    try {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        audioEl.play().catch(() => {});
      }
    } catch {}

    // Synchronously dispatch audio start for TurntablePlayer
    window.dispatchEvent(new CustomEvent("harleen:start-audio"));

    // Drive zoom to completion
    zoomProgressRef.current = 1;
    zoomProgress.set(1);

    // Rose & champagne gold particle shower
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.55 },
      colors: ["#db2777", "#ec4899", "#fbbf24", "#fef08a", "#ffffff"],
    });

    setTimeout(() => {
      onStart();
    }, 600);
  }, [onStart, zoomProgress]);

  // Lock html/body scroll while gate is open, and scrollTo(0,0) when it closes
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, 0);
    };
  }, [isOpen]);

  // Touch handling: non-passive listener to prevent rubber-banding; one swipe moves zoom a clear amount
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const gateEl = gateRef.current;
    if (!gateEl) return;

    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;
      if (diffY > 6) {
        e.preventDefault(); // Prevents browser rubber-banding
        const progress = Math.min(1, Math.max(0, zoomProgressRef.current + (diffY / 220)));
        zoomProgressRef.current = progress;
        zoomProgress.set(progress);
        if (progress >= 0.85) {
          handleTriggerStart();
        }
      }
    };

    gateEl.addEventListener("touchstart", onTouchStart, { passive: true });
    gateEl.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      gateEl.removeEventListener("touchstart", onTouchStart);
      gateEl.removeEventListener("touchmove", onTouchMove);
    };
  }, [isOpen, prefersReducedMotion, handleTriggerStart, zoomProgress]);

  // Wheel handling: scroll moves zoom smoothly
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const gateEl = gateRef.current;
    if (!gateEl) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 6) {
        e.preventDefault();
        const delta = Math.min(0.35, e.deltaY / 250);
        const progress = Math.min(1, Math.max(0, zoomProgressRef.current + delta));
        zoomProgressRef.current = progress;
        zoomProgress.set(progress);
        if (progress >= 0.85) {
          handleTriggerStart();
        }
      }
    };

    gateEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      gateEl.removeEventListener("wheel", onWheel);
    };
  }, [isOpen, prefersReducedMotion, handleTriggerStart, zoomProgress]);

  // Keyboard navigation: Space, arrows and PageDown drive zoom. Enter starts. Tab reaches Enter button.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (prefersReducedMotion) {
        if (e.key === "Enter" || e.key === " ") {
          handleTriggerStart();
        }
        return;
      }

      if (e.key === " " || e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const step = (e.key === "PageDown" || e.key === " ") ? 0.35 : 0.2;
        const progress = Math.min(1, Math.max(0, zoomProgressRef.current + step));
        zoomProgressRef.current = progress;
        zoomProgress.set(progress);
        if (progress >= 0.85) {
          handleTriggerStart();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleTriggerStart();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, prefersReducedMotion, handleTriggerStart, zoomProgress]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={gateRef}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.65, ease: "easeInOut" },
          }}
          style={{
            background: "radial-gradient(circle at 50% 35%, #4a044e 0%, #2b0630 45%, #140217 100%)",
            opacity: prefersReducedMotion ? 1 : gateOpacity,
            touchAction: "none",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Welcome Gate for Harleen's Birthday"
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden touch-none ${
            isUnveiling ? "pointer-events-none" : ""
          }`}
        >
          {/* Quick Enter Button in Top-Right Corner */}
          <button
            type="button"
            tabIndex={0}
            onClick={handleTriggerStart}
            aria-label="Enter site"
            className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-mono font-bold uppercase tracking-wider border border-white/30 shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-white"
          >
            <span>Enter Site</span>
            <ArrowDown className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {/* ROMANTIC DRIFTING ROSE PETALS (Disabled for reduced motion) */}
          {!prefersReducedMotion &&
            petals.map((p) => (
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
          <div
            className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
            style={{ perspective: 1000 }}
          >
            {/* Outer portrait motion.div using scale: portraitScale */}
            <motion.div
              ref={cardRef}
              role="button"
              tabIndex={0}
              aria-label="Portrait of Harleen. Click or press Enter to step into the site"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleTriggerStart}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTriggerStart();
                }
              }}
              style={{
                scale: prefersReducedMotion ? 1 : portraitScale,
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-[3/4] max-w-[300px] rounded-[2rem] p-1.5 bg-white/10 border border-white/20 shadow-2xl cursor-pointer group transition-all outline-hidden focus:ring-2 focus:ring-strawberry/50"
            >
              <div
                className="relative w-full h-full rounded-[1.8rem] overflow-hidden bg-black/60 shadow-inner"
                style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/media/harleen-red-feather-dress.jpg"
                  alt="Harleen"
                  fill
                  sizes="300px"
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                <div
                  className="absolute bottom-5 inset-x-4 flex flex-col items-center text-center text-white z-10"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <span className="font-hand text-4xl sm:text-5xl text-paper">
                    {recipientName}
                  </span>
                  <p className="font-sans text-xs text-paper/80 mt-1">
                    {COPY.startGate.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Tap To Enter Button */}
            <button
              type="button"
              tabIndex={0}
              onClick={handleTriggerStart}
              aria-label="Step into your world"
              className="mt-6 px-8 py-3 min-h-[44px] rounded-full bg-strawberry text-paper font-sans font-semibold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer z-10 focus:outline-hidden focus:ring-2 focus:ring-white"
            >
              <span>{COPY.startGate.enterButton}</span>
            </button>

            {/* Soundtrack Notice */}
            <div className="flex items-center gap-2 text-xs font-sans text-paper/70 mt-3 tracking-wide">
              <Headphones className="w-3.5 h-3.5 text-strawberry" />
              <span>{COPY.startGate.audioHint}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
