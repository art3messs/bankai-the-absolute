"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, Sparkles, Send, CheckCircle2, Heart, Star, Cake, Flame, RotateCcw } from "lucide-react";

interface BirthdayCakeCeremonyProps {
  recipientName: string;
}

export default function BirthdayCakeCeremony({ recipientName }: BirthdayCakeCeremonyProps) {
  const [candlesOut, setCandlesOut] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [puffParticles, setPuffParticles] = useState<{ id: number; left: number }[]>([]);

  // Wish form state
  const [wishText, setWishText] = useState("");
  const [wishSent, setWishSent] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate stored state post-mount to avoid SSR markup mismatch
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedWishSent = localStorage.getItem("harleen_wish_sent") === "true";
        if (storedWishSent) {
          setTimeout(() => {
            setCandlesOut(true);
            setWishSent(true);
          }, 0);
        }
      }
    } catch (err) {
      console.warn("Storage access unavailable:", err);
    }
  }, []);

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

  // 5 candle positions on the cake image (percentage along width)
  const candlePositions = [41.2, 45.9, 50.7, 55.4, 60.1];

  const blowOutCandles = () => {
    if (candlesOut) return;
    setCandlesOut(true);
    playWishChime();

    // Rising smoke puffs from each of the 5 candle positions
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

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setWishError(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipientName,
          message: wishText.trim(),
          type: "wish",
          stamp: "🎂",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to deliver wish. Please try again.");
      }

      setWishSent(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("harleen_wish_sent", "true");
        }
      } catch (err) {
        console.warn("Could not save wish state to localStorage:", err);
      }
      confetti({
        particleCount: 100,
        spread: 95,
        origin: { y: 0.65 },
        colors: ["#db2777", "#fbbf24", "#f472b6", "#ffffff"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not deliver your wish right now. Please try again.";
      setWishError(msg);
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="cake" className="relative z-10 max-w-4xl mx-auto px-4 py-10 flex flex-col items-center text-center">
      {/* Chapter Tag */}
      <div className="girly-tag mb-3">
        <Cake className="w-3.5 h-3.5 text-[#fbbf24]" />
        <span>CHAPTER II • THE BIRTHDAY CAKE &amp; WISH CEREMONY</span>
        <Sparkles className="w-3.5 h-3.5 text-[#ec4899]" />
      </div>

      <h2 className="font-forum text-3xl sm:text-5xl text-[#831843] uppercase tracking-[0.06em]">
        Blow Out The Candles, Harleen 🎂
      </h2>
      <p className="font-signature text-2xl sm:text-3xl text-[#9d174d] mt-2 leading-relaxed">
        &ldquo;Tilt the 3D stage with your touch or mouse. Blow into your mic or tap the flames to make your 16th February wish.&rdquo;
      </p>

      {/* THE 3D INTERACTIVE CAKE STAGE (PERSPECTIVE + GYRO/MOUSE TILT) */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-2xl mt-6 flex justify-center select-none"
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
          className="relative w-full p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-white via-[#fdf2f8] to-[#fce7f3] border-3 border-[#f472b6]/50 shadow-[0_30px_70px_rgba(236,72,153,0.22)] flex flex-col items-center overflow-hidden cursor-pointer group"
          onClick={candlesOut ? relightCandles : blowOutCandles}
          title={candlesOut ? "Tap cake to relight candles!" : "Tap cake or blow into mic to extinguish!"}
        >
          {/* Dynamic 3D Specular Lighting Glare */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />

          {/* Floating Cute Emojis & Stickers */}
          <div className="absolute top-4 left-6 text-2xl animate-bounce pointer-events-none" style={{ animationDuration: "3s" }}>
            🍓
          </div>
          <div className="absolute top-6 right-6 text-2xl animate-bounce pointer-events-none" style={{ animationDuration: "3.5s" }}>
            ✨
          </div>
          <div className="absolute bottom-6 left-8 text-xl animate-pulse pointer-events-none">
            💖
          </div>
          <div className="absolute bottom-8 right-8 text-xl animate-pulse pointer-events-none">
            🌸
          </div>

          {/* Ambient 3D Depth Nebula in Background */}
          <div
            className="absolute -top-10 -right-10 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"
            style={{ transform: "translateZ(-40px)" }}
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
              <img
                src="/media/cake-pink-three-tier-high.png"
                alt="3-Tier Pink Birthday Cake"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter contrast-[1.02] brightness-[1.02]"
              />

              {/* Subtle 3D Glass Sheen Edge */}
              <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
            </div>

            {/* 5 REAL 3D ANIMATED FLICKERING GOLDEN CANDLE FLAMES */}
            <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
            >
              {candlePositions.map((leftPct, idx) => (
                <div
                  key={idx}
                  className="absolute -translate-x-1/2 flex flex-col items-center"
                  style={{
                    left: `${leftPct}%`,
                    top: "22%",
                  }}
                >
                  <AnimatePresence>
                    {!candlesOut && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: [1, 1.25, 0.92, 1.2, 1],
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
              ))}
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
                        top: "20%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  ))}
              </AnimatePresence>
            </div>

            {/* 3D FLOATING NAMEPLATE BADGE */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-[#db2777]/35 text-center pointer-events-none"
              style={{ transform: "translateZ(80px)" }}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3 text-[#fbbf24]" />
                <span className="font-forum font-bold text-[#4a044e] tracking-wider uppercase text-[11px] sm:text-xs">
                  {recipientName} • 16
                </span>
                <Heart className="w-3 h-3 text-[#db2777] fill-[#db2777]" />
              </div>
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
                className="flex items-center gap-2 text-[#db2777] font-forum text-base sm:text-lg uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                <span>Flames Extinguished • Write Your Birthday Wish Below</span>
                <Sparkles className="w-4 h-4 text-[#fbbf24]" />
              </motion.div>
            ) : (
              <p className="text-xs sm:text-sm text-[#701a75] font-raleway font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Blow into your microphone or tap the cake to make your wish!</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                  micActive
                    ? "bg-[#db2777] text-white animate-pulse"
                    : "bg-white hover:bg-neutral-50 text-[#db2777] border border-[#db2777]/30"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span className="font-raleway text-[11px] uppercase tracking-wider">
                  {micActive ? "Listening for your breath... Blow!" : "Enable Mic Blow 🎙️"}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={relightCandles}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-neutral-50 text-[#701a75] border border-[#db2777]/30 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#db2777]" />
                <span className="font-raleway text-[11px] uppercase tracking-wider">
                  Relight Candles 🕯️
                </span>
              </button>
            )}
          </div>

          {micError && (
            <p className="text-xs text-rose-500 mt-2" style={{ transform: "translateZ(30px)" }}>
              {micError}
            </p>
          )}
        </motion.div>
      </div>

      {/* WISH NOTIFICATION TRANSMISSION CARD */}
      <AnimatePresence>
        {candlesOut && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full max-w-2xl mt-8 p-6 sm:p-8 rounded-3xl bg-white/95 border-3 border-[#f472b6]/60 shadow-[0_20px_50px_rgba(236,72,153,0.2)] text-center relative"
          >
            {!wishSent ? (
              <form onSubmit={handleSendWish} className="flex flex-col items-center">
                <div className="girly-tag mb-3">
                  <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
                  <span>FEBRUARY 16 BIRTHDAY WISH</span>
                </div>

                <h3 className="font-forum text-2xl sm:text-3xl uppercase tracking-wider text-[#831843]">
                  What Is Your Heart&apos;s Wish, Harleen? ✨
                </h3>
                <p className="font-signature text-2xl text-[#9d174d] mt-1 max-w-md">
                  &ldquo;Write whatever you wish for—it will be delivered straight to my phone instantly.&rdquo;
                </p>

                <div className="w-full mt-5 relative">
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={wishText}
                    onChange={(e) => {
                      setWishText(e.target.value);
                      if (wishError) setWishError(null);
                    }}
                    placeholder="Type your secret birthday wish here (anything you want in this world)..."
                    aria-label="Your birthday wish"
                    className="w-full p-4 rounded-2xl bg-[#fdf2f8] border-2 border-[#f472b6]/40 focus:border-[#ec4899] focus:ring-2 focus:ring-[#ec4899]/20 outline-none font-raleway text-sm text-[#4a044e] placeholder-[#831843]/50 transition-all shadow-inner resize-none"
                  />
                </div>

                {wishError && (
                  <p role="alert" aria-live="polite" className="text-xs text-rose-600 font-semibold mt-2">
                    {wishError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!wishText.trim() || isSubmitting}
                  className="mt-4 px-8 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-[#ec4899] via-[#db2777] to-[#fbbf24] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>{isSubmitting ? "Delivering To My Phone..." : "Send Wish To My Phone 💌"}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-forum text-2xl uppercase tracking-wider text-[#4a044e]">
                  Your Wish Has Been Delivered! 🤍
                </h4>
                <p className="font-signature text-2xl text-[#db2777] mt-2">
                  &ldquo;I received your wish on my phone. I promise to do everything in my power to make it come true for you. Harleen 4 Life.&rdquo;
                </p>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-[#fdf2f8] border border-[#db2777]/30 text-xs text-[#701a75] font-mono">
                  Delivered with all my heart • February 16
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
