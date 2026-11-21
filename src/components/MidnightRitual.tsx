"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, Moon, Sparkles, Compass, Send, CheckCircle2, Heart } from "lucide-react";

interface MidnightRitualProps {
  recipientName: string;
}

export default function MidnightRitual({ recipientName }: MidnightRitualProps) {
  const [candleBlown, setCandleBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [smokePuffs, setSmokePuffs] = useState<{ id: number; left: number }[]>([]);

  // Wish input state
  const [wishText, setWishText] = useState("");
  const [wishSent, setWishSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const playWishChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const blowCandle = () => {
    if (candleBlown) return;
    setCandleBlown(true);
    playWishChime();

    const puffs = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 46 + Math.random() * 8 - 4,
    }));
    setSmokePuffs(puffs);

    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.6 },
      colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
    });

    stopMic();
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: recipientName,
          message: wishText.trim(),
          type: "wish",
          stamp: "🕯️",
        }),
      });

      setWishSent(true);
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f43f5e", "#ff758f", "#ffffff"],
      });
    } catch {
      setWishSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startMic = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setMicActive(true);
      checkAudioLevel();
    } catch {
      setMicError("Microphone permission denied. Tap the candle instead!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
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

  const checkAudioLevel = () => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);

    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const avg = sum / data.length;

    // Threshold for blowing breath into mic
    if (avg > 42) {
      blowCandle();
      return;
    }

    animFrameRef.current = requestAnimationFrame(checkAudioLevel);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* 1. CANDLE VESSEL CARD */}
        <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-[#d97d93]/35 shadow-xs relative overflow-hidden bg-white/95">
          {/* Top Tag */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdfaf5] border border-[#d97d93]/30 text-[10px] font-raleway font-bold text-[#c95874] tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>MIDNIGHT EXTINCTION RITUAL</span>
          </div>

          {/* THE CANDLE WITH DYNAMIC FLAME & SMOKE */}
          <div
            onClick={blowCandle}
            className="my-8 relative cursor-pointer group flex flex-col items-center select-none"
            title={candleBlown ? "Wish made!" : "Blow into mic or tap flame to blow candle"}
          >
            {/* The Flame */}
            <AnimatePresence>
              {!candleBlown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: [1, 1.08, 0.96, 1] }}
                  exit={{ opacity: 0, scale: 0.1, y: -20 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="relative -mb-1 flex flex-col items-center z-20"
                >
                  {/* Outer Aura */}
                  <div className="absolute w-14 h-20 -top-4 bg-amber-400/35 rounded-full blur-xl pointer-events-none animate-pulse" />
                  {/* Main Flame Tear */}
                  <div className="w-6 h-10 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_20px_#f59e0b] filter drop-shadow-md" />
                  {/* Blue Wick Core */}
                  <div className="w-2.5 h-3 rounded-full bg-cyan-400 -mt-2 blur-[0.5px]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wick */}
            <div className="w-1 h-3 bg-stone-700 rounded-t-xs -mb-0.5 z-10" />

            {/* Smoke Puffs */}
            <AnimatePresence>
              {candleBlown &&
                smokePuffs.map((puff) => (
                  <motion.div
                    key={puff.id}
                    initial={{ opacity: 0.7, y: -10, scale: 0.8 }}
                    animate={{ opacity: 0, y: -70, scale: 2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-4 h-4 rounded-full bg-neutral-400/40 blur-sm pointer-events-none"
                    style={{ left: `${puff.left}%`, top: "-20px" }}
                  />
                ))}
            </AnimatePresence>

            {/* Glass Candle */}
            <div className="w-36 h-44 rounded-2xl bg-gradient-to-b from-white via-[#fdfaf5] to-[#f7eedf] border-t-2 border-[#d4af37] border-x border-b border-[#d97d93]/30 shadow-md p-3 flex flex-col items-center justify-between relative group-hover:scale-102 transition-transform">
              <div className="w-full h-4 bg-gradient-to-b from-[#d97d93]/20 to-transparent rounded-full" />

              {/* Label */}
              <div className="w-full p-2.5 rounded-xl bg-white shadow-xs border border-[#d97d93]/20 text-center">
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#7d7265] font-bold block">
                  N° 16 • ROSE ALABASTER
                </span>
                <span className="font-forum text-sm font-normal text-[#c95874] tracking-wider block mt-0.5 uppercase">
                  {recipientName}
                </span>
                <span className="text-[8px] text-[#7d7265] tracking-widest uppercase block mt-0.5 font-bold">
                  February 16 • Wish
                </span>
              </div>

              <div className="w-full h-2 bg-[#d97d93]/20 rounded-full" />
            </div>
          </div>

          {/* STATUS */}
          <div className="h-12 flex items-center justify-center">
            {candleBlown ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <span className="font-forum text-base sm:text-lg text-[#c95874] uppercase tracking-wider">
                  ✨ Flame Extinguished • Wish Unlocked ✨
                </span>
              </motion.div>
            ) : (
              <p className="text-xs sm:text-sm text-[#7d7265] font-raleway font-medium">
                Blow into your mic or tap the candle to extinguish the flame.
              </p>
            )}
          </div>

          {/* MIC BUTTON */}
          {!candleBlown && (
            <button
              onClick={micActive ? stopMic : startMic}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all mt-2 shadow-xs cursor-pointer ${
                micActive
                  ? "bg-[#d4af37] text-black shadow-md animate-pulse font-bold"
                  : "bg-white hover:bg-neutral-50 text-[#c95874] border border-[#d97d93]/30"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="font-raleway text-[11px] uppercase tracking-wider">
                {micActive ? "Listening for your breath... Blow!" : "Enable Mic Breath 🎙️"}
              </span>
            </button>
          )}

          {micError && <p className="text-xs text-[#c95874] mt-1">{micError}</p>}
        </div>

        {/* 2. CELESTIAL MOON & ORBIT CARD */}
        <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-[#d97d93]/30 shadow-xs relative overflow-hidden bg-white/95">
          {/* Top Tag */}
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#d4af37]/40 text-[10px] font-raleway font-bold text-[#241e16] tracking-widest uppercase">
            <Compass className="w-3 h-3 text-[#d4af37]" />
            <span>Celestial Alignment • 16th Feb</span>
          </div>

          {/* MOON PHASE DIAL */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#d4af37]/40 animate-spin" style={{ animationDuration: "40s" }} />
            <div className="absolute w-36 h-36 rounded-full border border-[#d97d93]/20" />

            {/* Glowing Pearl Moon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#fdfaf5] via-white to-[#f7eedf] shadow-[0_0_35px_rgba(212,175,55,0.25)] border-2 border-[#d4af37]/60 relative flex items-center justify-center overflow-hidden">
              <Moon className="w-9 h-9 text-[#d4af37]" />
            </div>
          </div>

          {/* Orbit Data */}
          <div className="w-full space-y-2 pt-2 border-t border-[#d97d93]/20">
            <div className="flex justify-between items-center text-[10px] text-[#7d7265] font-mono px-2">
              <span>DATE: FEB 16</span>
              <span className="text-[#d4af37] font-bold">LUNAR ORBIT</span>
              <span>HARLEEN</span>
            </div>

            <p className="font-forum text-lg text-[#241e16] uppercase tracking-wider">
              The Day The Stars Aligned For You
            </p>
            <p className="font-signature text-xl text-[#7d7265]">
              &ldquo;In all of space and time, seeing you happy is my whole world.&rdquo;
            </p>
          </div>

          {/* Milestone Badge */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-white border border-[#d4af37]/40 text-[#241e16] text-[10px] font-raleway font-bold tracking-wider uppercase">
            ✦ Another Golden Orbit Completed ✦
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE WISH NOTIFICATION POPUP BAR (APPEARS ON CANDLE BLOWN) */}
      <AnimatePresence>
        {candleBlown && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ffffff] via-[#fff9fa] to-[#fff4f6] border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(201,88,116,0.18)] text-center relative select-none"
          >
            {!wishSent ? (
              <form onSubmit={handleSendWish} className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-raleway font-bold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>BIRTHDAY WISH TRANSMISSION</span>
                </div>

                <h3 className="font-forum text-2xl sm:text-3xl uppercase tracking-wider text-[#241e16]">
                  What Is Your Heart&apos;s Wish, Harleen? 🎂
                </h3>
                <p className="font-signature text-xl text-[#7d7265] mt-1 max-w-md">
                  &ldquo;Write whatever you wish for—it will be delivered straight to my phone instantly.&rdquo;
                </p>

                <div className="w-full mt-5 relative">
                  <textarea
                    rows={3}
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Type your secret birthday wish here (e.g. what you want, where you want to go, or what's on your heart)..."
                    className="w-full p-4 rounded-2xl bg-white border border-[#d97d93]/40 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none font-raleway text-sm text-[#241e16] placeholder-[#7d7265]/60 transition-all shadow-inner resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!wishText.trim() || isSubmitting}
                  className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 fill-white" />
                  <span>{isSubmitting ? "Delivering To His Phone..." : "Send Wish To His Phone 💌"}</span>
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
                <h4 className="font-forum text-2xl uppercase tracking-wider text-[#241e16]">
                  Your Wish Has Been Delivered! 🤍
                </h4>
                <p className="font-signature text-2xl text-[#c95874] mt-2">
                  &ldquo;I received your wish on my phone. I promise to do everything in my power to make it come true. Pucchi 4 Life.&rdquo;
                </p>
                <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-[#d97d93]/30 text-xs text-[#7d7265] font-mono">
                  Delivered with love • February 16
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
