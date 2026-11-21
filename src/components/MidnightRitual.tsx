"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, Moon, Sparkles, Compass } from "lucide-react";

interface MidnightRitualProps {
  recipientName: string;
}

export default function MidnightRitual({ recipientName }: MidnightRitualProps) {
  const [candleBlown, setCandleBlown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [smokePuffs, setSmokePuffs] = useState<{ id: number; left: number }[]>([]);

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
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
    });

    stopMic();
  };

  const relightCandle = () => {
    setCandleBlown(false);
    setSmokePuffs([]);
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

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let highVolumeStreak = 0;

      const checkBreath = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        const bins = 30;
        for (let i = 0; i < bins; i++) sum += dataArray[i];
        const avg = sum / bins;

        if (avg > 72) {
          highVolumeStreak++;
          if (highVolumeStreak >= 4) {
            blowCandle();
            return;
          }
        } else {
          highVolumeStreak = Math.max(0, highVolumeStreak - 1);
        }

        animFrameRef.current = requestAnimationFrame(checkBreath);
      };

      checkBreath();
    } catch {
      setMicError("Mic access denied. Tap the candle instead!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setMicActive(false);
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto items-stretch select-none">
      {/* 1. LUXURY GLASS CANDLE */}
      <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-[#d97d93]/30 shadow-xs relative overflow-hidden">
        {/* Glow */}
        {!candleBlown && (
          <div className="absolute top-1/4 w-44 h-44 bg-amber-300/20 rounded-full blur-[65px] animate-pulse pointer-events-none" />
        )}

        {/* Top Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#d97d93]/30 text-[10px] font-raleway font-bold text-[#c95874] tracking-widest uppercase">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>The Birthday Candle Ritual</span>
        </div>

        {/* CANDLE VESSEL */}
        <div
          onClick={candleBlown ? relightCandle : blowCandle}
          className="relative my-6 cursor-pointer group select-none"
          title={candleBlown ? "Click to relight candle" : "Click or blow to extinguish flame"}
        >
          {/* FLAME */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
            <AnimatePresence>
              {!candleBlown && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.25, 0.95, 1.15, 1],
                    opacity: 1,
                    y: [0, -2, 1, -1, 0],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.45 }}
                  className="w-4 h-9 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full blur-[0.5px] shadow-[0_0_25px_rgba(251,191,36,0.9)]"
                />
              )}
            </AnimatePresence>
            <div className="w-1 h-3 bg-neutral-800 -mt-0.5" />
          </div>

          {/* SMOKE */}
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
        <div className="h-14 flex items-center justify-center">
          {candleBlown ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <span className="font-forum text-lg sm:text-xl text-[#c95874] uppercase tracking-wider">
                ✨ Make your wish, Harleen ✨
              </span>
              <span className="text-xs text-[#7d7265] mt-0.5 font-signature text-xl">
                seeing you happy is my favorite thing in life 🕯️
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
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all mt-2 shadow-xs ${
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
      <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-[#d97d93]/30 shadow-xs relative overflow-hidden">
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
  );
}
