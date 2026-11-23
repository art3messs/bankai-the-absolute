"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, CheckCircle2, Flame, RotateCcw } from "lucide-react";
import { COPY } from "@/data/copy";
import { getBirthdayDetails } from "@/data/config";

interface BirthdayCakeCeremonyProps {
  recipientName: string;
}

export default function BirthdayCakeCeremony({ recipientName }: BirthdayCakeCeremonyProps) {
  const details = getBirthdayDetails();
  const ageDigits = String(details.turningAge).split("");
  const candlePositions = [45, 55];

  const [candlesOut, setCandlesOut] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [puffParticles, setPuffParticles] = useState<{ id: number; left: number }[]>([]);

  // 3D physics tilt
  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Soft musical chime on blowout
  const playWishChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.0);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const blowOutCandles = () => {
    if (candlesOut) return;
    setCandlesOut(true);
    playWishChime();

    // Rising smoke puffs from each number candle
    const puffs = candlePositions.map((pos, i) => ({
      id: i,
      left: pos,
    }));
    setPuffParticles(puffs);

    // Rose & Champagne celebration
    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.55 },
      colors: ["#db2777", "#ec4899", "#fbbf24", "#fef08a", "#ffffff"],
    });

    stopMic();
  };

  const relightCandles = () => {
    setCandlesOut(false);
    setPuffParticles([]);
  };

  const startMic = async () => {
    try {
      setMicError(null);
      // Pause background music so it does not trigger false microphone blows
      window.dispatchEvent(new CustomEvent("harleen:pause-music"));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setMicActive(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let calibrationFrames = 0;
      let baselineSum = 0;
      let baselineNoise = 18;
      let sustainedPuffFrames = 0;

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);

        // Low frequency bins (sub-500Hz: indices 1 to 5) where breath turbulence concentrates
        let lowFreqSum = 0;
        const lowBinsCount = 5;
        for (let i = 1; i <= lowBinsCount; i++) {
          lowFreqSum += dataArray[i];
        }
        const lowFreqAvg = lowFreqSum / lowBinsCount;

        // Calibrate ambient noise floor during first 30 frames (~500ms)
        if (calibrationFrames < 30) {
          baselineSum += lowFreqAvg;
          calibrationFrames++;
          if (calibrationFrames === 30) {
            baselineNoise = Math.max(15, baselineSum / 30);
          }
          animationFrameRef.current = requestAnimationFrame(checkBlow);
          return;
        }

        // Blow detection: energy exceeds baseline by 25+ sustained over 12 frames (~200ms)
        if (lowFreqAvg > baselineNoise + 25) {
          sustainedPuffFrames++;
          if (sustainedPuffFrames >= 12) {
            blowOutCandles();
            return;
          }
        } else {
          sustainedPuffFrames = Math.max(0, sustainedPuffFrames - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };
      animationFrameRef.current = requestAnimationFrame(checkBlow);
    } catch {
      setMicError("Microphone permission denied. Tap the cake instead!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicActive(false);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <section id="cake" className="relative z-10 max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center">
      {/* Heading in sentence case, no tag, no emoji */}
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.cake.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2 max-w-xl leading-relaxed">
        &ldquo;{COPY.cake.instruction}&rdquo;
      </p>

      {/* THE 3D INTERACTIVE CAKE STAGE */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-2xl mt-8 flex justify-center select-none"
      >
        <motion.div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          role="button"
          tabIndex={0}
          aria-label={
            candlesOut
              ? "Cake candles extinguished. Tap or press enter to relight."
              : "Interactive birthday cake. Tap or press enter to blow out candles."
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (candlesOut) relightCandles();
              else blowOutCandles();
            }
          }}
          className="relative w-full p-6 sm:p-10 rounded-3xl bg-paper border border-mauve/20 shadow-lg flex flex-col items-center overflow-hidden cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-strawberry"
          onClick={candlesOut ? relightCandles : blowOutCandles}
          title={candlesOut ? "Tap cake to relight candles!" : "Tap cake or blow into mic to extinguish!"}
        >
          {/* Dynamic 3D Specular Lighting Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />

          {/* 3D FLOATING CAKE CONTAINER */}
          <div
            className="relative w-full max-w-xs sm:max-w-sm aspect-square my-2 flex items-center justify-center"
            style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
          >
            {/* 3D Golden Platter Base Shadow */}
            <div
              className="absolute -bottom-2 w-3/4 h-8 bg-gradient-to-r from-transparent via-[#4a044e]/15 to-transparent rounded-full blur-md"
              style={{ transform: "translateZ(-20px) scale(1.15)" }}
            />

            {/* THE UPLOADED 3-TIER PINK CAKE PHOTO */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden p-1 flex items-center justify-center drop-shadow-[0_20px_35px_rgba(74,4,78,0.18)]">
              <Image
                src="/media/cake-pink-three-tier-high.png"
                alt="3-Tier Pink Birthday Cake"
                fill
                sizes="(max-width: 640px) 320px, 384px"
                className="object-contain filter contrast-[1.02] brightness-[1.02]"
              />

              {/* Subtle 3D Glass Sheen Edge */}
              <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
            </div>

            {/* NUMBER CANDLES (OPTION B: NUMBERS "1" AND "9") */}
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
            >
              {ageDigits.map((digit, idx) => {
                const leftPct = candlePositions[idx] ?? (idx === 0 ? 45 : 55);
                return (
                  <div
                    key={idx}
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{
                      left: `${leftPct}%`,
                      top: "14%",
                    }}
                  >
                    {/* Dancing Flame */}
                    <div className="h-6 flex items-end justify-center">
                      <AnimatePresence>
                        {!candlesOut && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: [1, 1.22, 0.94, 1.18, 1],
                              opacity: [0.95, 1, 0.9, 1, 0.95],
                              y: [0, -1.5, 0.5, -2, 0],
                            }}
                            exit={{ scale: 0, opacity: 0, y: -10 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.35 + idx * 0.08,
                              ease: "easeInOut",
                            }}
                            className="relative w-3.5 h-6 rounded-full"
                          >
                            {/* Golden Core Flame */}
                            <div className="w-full h-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full blur-[0.6px] shadow-[0_0_14px_rgba(251,191,36,0.95)]" />
                            {/* Inner Hot White Ember */}
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-white rounded-full blur-[0.4px]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Candle Wick */}
                    <div className="w-0.5 h-2 bg-ink/70 mx-auto -mt-0.5" />

                    {/* Wax Number Candle Figure */}
                    <div className="px-2.5 py-0.5 rounded-md bg-gradient-to-b from-white via-rose-50 to-rose-100 border border-strawberry/40 shadow-xs flex items-center justify-center">
                      <span className="font-serif font-bold text-strawberry text-lg sm:text-xl leading-none">
                        {digit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3D RISING SMOKE PUFFS ON BLOWOUT */}
            <div
              className="absolute inset-0 pointer-events-none z-40"
              style={{ transform: "translateZ(85px)" }}
            >
              <AnimatePresence>
                {candlesOut &&
                  puffParticles.map((puff) => (
                    <motion.div
                      key={puff.id}
                      initial={{ opacity: 0.85, y: 0, scale: 0.6 }}
                      animate={{ opacity: 0, y: -75, scale: 2.2 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: puff.id * 0.05 }}
                      className="absolute w-4 h-4 rounded-full bg-white/60 blur-xs"
                      style={{
                        left: `${puff.left}%`,
                        top: "14%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  ))}
              </AnimatePresence>
            </div>

            {/* 3D FLOATING NAMEPLATE BADGE */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-paper shadow-md border border-mauve/20 text-center pointer-events-none whitespace-nowrap"
              style={{ transform: "translateZ(80px)" }}
            >
              <span className="font-sans font-semibold text-strawberry text-xs">
                {recipientName} • Turning {details.turningAge}
              </span>
            </div>
          </div>

          {/* STATUS NOTIFICATION BAR */}
          <div
            className="h-9 mt-4 flex items-center justify-center text-center"
            style={{ transform: "translateZ(30px)" }}
          >
            {candlesOut ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-strawberry font-sans text-sm sm:text-base font-medium"
              >
                <span>{COPY.cake.wishMadeTitle} {COPY.cake.wishMadeSubtitle}</span>
              </motion.div>
            ) : (
              <p className="text-xs sm:text-sm text-ink/80 font-sans flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-strawberry animate-pulse" />
                <span>{COPY.cake.blowPrompt}</span>
              </p>
            )}
          </div>

          {/* MIC TOGGLE & RELIGHT CONTROLS */}
          <div
            className="mt-2 flex items-center gap-3 z-20"
            style={{ transform: "translateZ(40px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {!candlesOut ? (
              <button
                type="button"
                onClick={micActive ? stopMic : startMic}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                  micActive
                    ? "bg-strawberry text-paper animate-pulse"
                    : "bg-strawberry text-paper hover:opacity-95"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="font-sans">
                  {micActive ? COPY.cake.micButtonListening : COPY.cake.micButtonEnable}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={relightCandles}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-paper hover:bg-strawberry/5 text-strawberry border border-strawberry text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-strawberry" />
                <span className="font-sans">
                  {COPY.cake.relightButton}
                </span>
              </button>
            )}
          </div>

          {micError && (
            <p className="text-xs text-strawberry mt-2" style={{ transform: "translateZ(30px)" }}>
              {micError}
            </p>
          )}
        </motion.div>
      </div>

      {/* CELEBRATORY WISH MOMENT CARD */}
      <AnimatePresence>
        {candlesOut && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-xl mt-6 p-6 rounded-2xl bg-paper border border-mauve/20 shadow-sm text-center"
          >
            <div className="w-10 h-10 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-ink font-normal">
              {COPY.cake.wishMadeTitle}
            </h3>
            <p className="font-sans text-sm text-ink/80 mt-2">
              {COPY.cake.wishMadeSubtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
