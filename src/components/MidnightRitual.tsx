"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, Moon, Sparkles, Flame, Compass } from "lucide-react";

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

  // Play a soft magic chime using Web Audio API on blowout
  const playWishChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 ethereal chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 1.3);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const blowCandle = () => {
    if (candleBlown) return;
    setCandleBlown(true);
    playWishChime();

    // Rising smoke puffs
    const puffs = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: 45 + Math.random() * 10 - 5,
    }));
    setSmokePuffs(puffs);

    // Warm gold, rose, and amber confetti shower
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#fde047", "#fef08a", "#e0a4b8", "#f4c2ce", "#ffffff"],
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto items-stretch select-none">
      {/* 1. THE MIDNIGHT LUXURY CANDLE */}
      <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-rose-300/20 relative shadow-2xl overflow-hidden">
        {/* Subtle candlelight halo behind vessel */}
        {!candleBlown && (
          <div className="absolute top-1/4 w-40 h-40 bg-amber-400/20 rounded-full blur-[60px] animate-pulse pointer-events-none" />
        )}

        {/* Top Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-serif text-amber-200 tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>The Midnight Wish Ritual</span>
        </div>

        {/* THE CANDLE VESSEL */}
        <div
          onClick={candleBlown ? relightCandle : blowCandle}
          className="relative my-8 cursor-pointer group select-none"
          title={candleBlown ? "Click to relight candle" : "Click or blow to extinguish flame"}
        >
          {/* FLAME */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
            <AnimatePresence>
              {!candleBlown && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 0.95, 1.15, 1],
                    opacity: 1,
                    y: [0, -2, 1, -1, 0],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="w-4 h-9 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full blur-[0.5px] shadow-[0_0_25px_rgba(253,224,71,0.9)]"
                />
              )}
            </AnimatePresence>
            {/* Candle Wick */}
            <div className="w-1 h-3 bg-neutral-800 -mt-0.5" />
          </div>

          {/* SMOKE PUFFS */}
          <AnimatePresence>
            {candleBlown &&
              smokePuffs.map((puff) => (
                <motion.div
                  key={puff.id}
                  initial={{ opacity: 0.7, y: -10, scale: 0.8 }}
                  animate={{ opacity: 0, y: -70, scale: 2.2 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                  className="absolute w-4 h-4 rounded-full bg-white/30 blur-sm pointer-events-none"
                  style={{ left: `${puff.left}%`, top: "-20px" }}
                />
              ))}
          </AnimatePresence>

          {/* Candle Glass Vessel (Matte Smoked Charcoal with Gold Rim) */}
          <div className="w-36 h-44 rounded-2xl bg-gradient-to-b from-[#1e1724] to-[#120d18] border-t-2 border-amber-300/80 border-x border-b border-white/10 shadow-2xl p-3 flex flex-col items-center justify-between relative group-hover:scale-102 transition-transform">
            {/* Wax pool reflection */}
            <div className="w-full h-4 bg-gradient-to-b from-amber-200/20 to-transparent rounded-full" />

            {/* Editorial Perfumer Label */}
            <div className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-center shadow-inner">
              <span className="text-[9px] uppercase tracking-[0.25em] text-amber-300/90 font-bold block">
                N° 16 • DUSK ROSE
              </span>
              <span className="font-serif font-black text-rose-200 text-sm tracking-wider block mt-0.5">
                {recipientName}
              </span>
              <span className="text-[8px] text-white/50 tracking-widest uppercase block mt-0.5">
                February 16 • Midnight
              </span>
            </div>

            {/* Base weight */}
            <div className="w-full h-2 bg-black/40 rounded-full" />
          </div>
        </div>

        {/* WISH MESSAGE / BLOW PROMPT */}
        <div className="h-14 flex items-center justify-center">
          {candleBlown ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <span className="font-serif text-lg font-bold text-amber-200 drop-shadow">
                ✨ Make your midnight wish, Harleen ✨
              </span>
              <span className="text-[11px] text-rose-300/80 mt-0.5">
                Tap the glass anytime to relight 🕯️
              </span>
            </motion.div>
          ) : (
            <p className="text-xs text-rose-200/90 font-serif italic">
              Blow into your mic or tap the candle to extinguish the flame.
            </p>
          )}
        </div>

        {/* MIC TOGGLE BUTTON */}
        {!candleBlown && (
          <button
            onClick={micActive ? stopMic : startMic}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all mt-2 ${
              micActive
                ? "bg-amber-300 text-black shadow-[0_0_20px_rgba(253,224,71,0.6)] animate-pulse"
                : "bg-white/5 hover:bg-white/10 text-rose-200 border border-white/10"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{micActive ? "Listening for your breath... Blow!" : "Enable Mic Breath 🎙️"}</span>
          </button>
        )}

        {micError && <p className="text-[11px] text-rose-400 mt-1">{micError}</p>}
      </div>

      {/* 2. THE FEBRUARY 16 CELESTIAL MOON & ORBIT */}
      <div className="editorial-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-between text-center border border-amber-300/20 relative shadow-2xl overflow-hidden">
        {/* Top Tag */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-serif text-amber-200 tracking-wider">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>Celestial Coordinates • 16th Feb</span>
        </div>

        {/* MOON ILLUMINATION DIAL */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Outer Orbital Rings */}
          <div className="absolute w-48 h-48 rounded-full border border-dashed border-amber-300/20 animate-spin" style={{ animationDuration: "35s" }} />
          <div className="absolute w-40 h-40 rounded-full border border-white/10" />

          {/* The Glowing Moon of Feb 16 */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#1a1422] via-[#2f243a] to-[#ecd4b4] shadow-[0_0_40px_rgba(253,224,71,0.25)] border border-amber-200/40 relative flex items-center justify-center overflow-hidden">
            {/* Crater shadows */}
            <div className="absolute top-4 left-6 w-5 h-5 rounded-full bg-black/20 blur-[1px]" />
            <div className="absolute bottom-6 right-8 w-7 h-7 rounded-full bg-black/25 blur-[1px]" />
            <div className="absolute top-12 right-4 w-4 h-4 rounded-full bg-black/15 blur-[1px]" />
            <Moon className="w-8 h-8 text-amber-100/30" />
          </div>
        </div>

        {/* Orbit Data & Romantic Sign */}
        <div className="w-full space-y-2 pt-2 border-t border-white/10">
          <div className="flex justify-between items-center text-xs text-rose-200/80 px-2 font-mono">
            <span>DATE: FEB 16</span>
            <span className="text-amber-300 font-bold">LUNAR CYCLE</span>
            <span>ORBIT: 2026</span>
          </div>

          <p className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
            The Night The Stars Aligned For You.
          </p>
          <p className="font-hand text-lg text-rose-200/90 italic">
            &ldquo;In all of space and time, there is only one Harleen.&rdquo;
          </p>
        </div>

        {/* Milestone Badge */}
        <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-rose-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold">
          ✨ Another Golden Orbit Completed
        </div>
      </div>
    </div>
  );
}
