"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { Headphones, ArrowDown, Sparkles } from "lucide-react";
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

  // Scroll-driven portal zoom motion values
  const zoomProgress = useMotionValue(0);
  const zoomProgressRef = useRef(0);
  const easedZoomProgress = useSpring(zoomProgress, { damping: 28, stiffness: 115, mass: 0.8 });
  const portraitScale = useTransform(easedZoomProgress, [0, 0.2, 0.65, 1], [1, 1.18, 2.7, 5.5]);
  const gateOpacity = useTransform(easedZoomProgress, [0.78, 1], [1, 0]);
  const haloScale = useTransform(easedZoomProgress, [0, 1], [1, 1.8]);
  const ringDashOffset = useTransform(easedZoomProgress, [0, 1], [138, 0]);

  // 3D tilt + specular sheen physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const sheenX = useTransform(mouseX, [-0.5, 0.5], ["15%", "85%"]);
  const sheenY = useTransform(mouseY, [-0.5, 0.5], ["15%", "85%"]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,245,220,0.28) 0%, rgba(255,255,255,0) 60%)`;

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

  const petals = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.round((i * 6.1 + Math.sin(i) * 2.5) * 100) / 100,
    delay: (i * 0.45) % 6,
    duration: 7 + ((i * 0.7) % 5),
    size: 13 + ((i * 3) % 10),
  }));

  const cosmosStars = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.round(((i * 37.3 + 11) % 96) * 10) / 10,
    y: Math.round(((i * 53.7 + 7) % 94) * 10) / 10,
    size: 1.5 + (i % 3),
    delay: (i * 0.35) % 3,
    duration: 2.2 + (i % 4) * 0.6,
  }));

  const handleTriggerStart = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsUnveiling(true);

    try {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        audioEl.play().catch(() => {});
      }
    } catch {}

    window.dispatchEvent(new CustomEvent("harleen:start-audio"));

    zoomProgressRef.current = 1;
    zoomProgress.set(1);

    confetti({
      particleCount: 95,
      spread: 95,
      origin: { y: 0.52 },
      colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#F6E5B6", "#FFFFFF"],
    });

    setTimeout(() => {
      onStart();
    }, 620);
  }, [onStart, zoomProgress]);

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

  // Touch swipe up advances zoom smoothly via incremental prevTouchY
  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const gateEl = gateRef.current;
    if (!gateEl) return;

    let prevTouchY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevTouchY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaY = prevTouchY - currentY;
      prevTouchY = currentY;
      e.preventDefault();
      if (deltaY > 0) {
        const progress = Math.min(1, Math.max(0, zoomProgressRef.current + deltaY / 190));
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

  useEffect(() => {
    if (!isOpen || prefersReducedMotion) return;
    const gateEl = gateRef.current;
    if (!gateEl) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 4) {
        const delta = Math.min(0.32, e.deltaY / 260);
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

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (prefersReducedMotion) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTriggerStart();
        }
        return;
      }

      if (e.key === " " || e.key === "ArrowDown" || e.key === "PageDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const step = e.key === "PageDown" || e.key === " " ? 0.35 : 0.22;
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
            scale: 1.06,
            transition: { duration: 0.65, ease: "easeInOut" },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 38%, #58074D 0%, #2C062D 45%, #120214 100%)",
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
          {/* Ambient Orbital Gold Rings & Rose Glow */}
          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              style={{ scale: haloScale }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full bg-strawberry/20 blur-[110px]" />
              <div
                className="absolute w-[390px] h-[390px] sm:w-[520px] sm:h-[520px] rounded-full border border-gold-light/15 animate-spin"
                style={{ animationDuration: "42s" }}
              />
              <div
                className="absolute w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-box-pink/20 animate-spin"
                style={{ animationDuration: "28s", animationDirection: "reverse" }}
              />
            </motion.div>
          )}

          {/* Top-Right Accessible Enter Button */}
          <button
            type="button"
            tabIndex={0}
            onClick={handleTriggerStart}
            aria-label="Enter site"
            className="absolute top-4 right-4 z-50 flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-paper text-xs font-sans font-semibold uppercase tracking-wider border border-gold-light/35 shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-gold-light"
          >
            <span>Enter Site</span>
            <ArrowDown className="w-3.5 h-3.5 text-gold-light" />
          </button>

          {/* Twinkling Gold Nocturnal Stars */}
          {!prefersReducedMotion &&
            cosmosStars.map((star) => (
              <motion.span
                key={`cosmos-${star.id}`}
                aria-hidden="true"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.18, 0.9, 0.25] }}
                transition={{
                  repeat: Infinity,
                  duration: star.duration,
                  delay: star.delay,
                  ease: "easeInOut",
                }}
                className="absolute rounded-full bg-gold-light pointer-events-none shadow-[0_0_8px_rgba(246,229,182,0.85)]"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
              />
            ))}

          {/* Floating Rose Petals */}
          {!prefersReducedMotion &&
            petals.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: -50, opacity: 0, rotate: 0 }}
                animate={{
                  y: ["0vh", "110vh"],
                  opacity: [0, 0.7, 0.8, 0],
                  rotate: [0, 180, 360],
                  x: [0, Math.sin(p.id) * 32, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute pointer-events-none select-none text-box-pink/40"
                style={{
                  left: `${p.x}%`,
                  fontSize: `${p.size}px`,
                }}
              >
                🌸
              </motion.div>
            ))}

          {/* Central Editorial Cinema Portal with 3D Perspective */}
          <div
            className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
            style={{ perspective: 1100 }}
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
              className="relative w-full aspect-[3/4] max-w-[270px] sm:max-w-[300px] rounded-[2rem] p-2 bg-gradient-to-br from-gold-light/40 via-white/15 to-strawberry/35 border border-gold-light/45 shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer group transition-shadow outline-hidden focus:ring-2 focus:ring-gold-light"
            >
              {/* Filigree Corner Accents */}
              <div className="pointer-events-none absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold-light/80 rounded-tl-xl" />
              <div className="pointer-events-none absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold-light/80 rounded-br-xl" />

              <div
                className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-black/70 shadow-inner"
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

                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: sheenBg }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#160219]/90 via-transparent to-black/25 pointer-events-none" />

                <div
                  className="absolute bottom-5 inset-x-4 flex flex-col items-center text-center text-white z-10"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <span className="font-hand text-5xl sm:text-6xl text-gold-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] leading-none">
                    {recipientName}
                  </span>
                  <p className="font-sans text-xs text-paper/85 mt-1.5 leading-relaxed">
                    {COPY.startGate.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Enter CTA + Scroll Progress Ring */}
            <div className="mt-5 flex items-center gap-3 z-10">
              {!prefersReducedMotion && (
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="2.5"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="22"
                      fill="none"
                      stroke="#F6E5B6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="138"
                      style={{ strokeDashoffset: ringDashOffset }}
                    />
                  </svg>
                  <Sparkles className="w-4 h-4 text-gold-light absolute" />
                </div>
              )}

              <button
                type="button"
                tabIndex={0}
                onClick={handleTriggerStart}
                aria-label="Step into your world"
                className="px-7 py-3 min-h-[44px] rounded-full bg-gradient-to-r from-strawberry via-[#E1386C] to-strawberry text-paper font-sans font-semibold text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(212,40,90,0.45)] border border-gold-light/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
              >
                <span>{COPY.startGate.enterButton}</span>
              </button>
            </div>

            {!prefersReducedMotion && (
              <p className="text-[11px] font-sans text-gold-light/75 mt-2.5 tracking-wide">
                {COPY.startGate.swipeHint}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs font-sans text-paper/65 mt-1.5 tracking-wide">
              <Headphones className="w-3.5 h-3.5 text-box-pink" />
              <span>{COPY.startGate.audioHint}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
