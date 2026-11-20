"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, Sparkles, Volume2 } from "lucide-react";

interface BirthdayCakeProps {
  recipientName: string;
}

export default function BirthdayCake({ recipientName }: BirthdayCakeProps) {
  const [candlesOut, setCandlesOut] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [puffParticles, setPuffParticles] = useState<{ id: number; left: number }[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play a soft magic chime using Web Audio API on blowout
  const playWishChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.9);
      });
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const blowOutCandles = () => {
    if (candlesOut) return;
    setCandlesOut(true);
    playWishChime();

    // Trigger rising smoke puffs
    const puffs = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
    }));
    setPuffParticles(puffs);

    // Confetti shower
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
    });

    // Cleanup mic after blowout
    stopMic();
  };

  const relightCandles = () => {
    setCandlesOut(false);
    setPuffParticles([]);
  };

  // Microphone detection for blowing on screen
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

      const checkBlow = () => {
        analyser.getByteFrequencyData(dataArray);

        // Calculate average amplitude of low-to-mid frequencies (typical of wind / blowing into a mic)
        let sum = 0;
        const binsToCheck = 30;
        for (let i = 0; i < binsToCheck; i++) {
          sum += dataArray[i];
        }
        const avg = sum / binsToCheck;

        // Blowing into a mic produces sustained wind noise > threshold
        if (avg > 75) {
          highVolumeStreak++;
          if (highVolumeStreak >= 4) {
            blowOutCandles();
            return;
          }
        } else {
          highVolumeStreak = Math.max(0, highVolumeStreak - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch {
      setMicError("Microphone access denied. You can still tap to blow!");
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
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
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-3xl relative overflow-hidden max-w-md w-full mx-auto">
      {/* Decorative Title Badge */}
      <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-xs font-semibold tracking-wider uppercase">
        <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: "6s" }} />
        <span>Harleen&apos;s Birthday Cake</span>
        <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" style={{ animationDuration: "6s" }} />
      </div>

      {/* The 3D CSS Cake */}
      <div
        onClick={candlesOut ? relightCandles : blowOutCandles}
        className="relative cursor-pointer select-none group my-4"
        title={candlesOut ? "Click to relight candles!" : "Click or blow to extinguish!"}
      >
        {/* CANDLES CONTAINER */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-8 z-20 pointer-events-none">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              {/* FLAME */}
              <AnimatePresence>
                {!candlesOut && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 0.95, 1.15, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 0.4 + idx * 0.1 }}
                    className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full blur-[1px] shadow-[0_0_15px_rgba(255,165,0,0.9)] -mb-1"
                  />
                )}
              </AnimatePresence>

              {/* CANDLE BODY */}
              <div className="w-3 h-10 bg-gradient-to-r from-pink-100 via-white to-pink-200 rounded-sm shadow-md border-x border-pink-300/40 relative">
                {/* Spiral Pink Stripes */}
                <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#ff4d6d_0px,#ff4d6d_2px,transparent_2px,transparent_6px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* SMOKE PARTICLES */}
        <AnimatePresence>
          {candlesOut &&
            puffParticles.map((puff) => (
              <motion.div
                key={puff.id}
                initial={{ opacity: 0.8, y: -20, scale: 0.8 }}
                animate={{ opacity: 0, y: -80, scale: 2 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="absolute w-5 h-5 rounded-full bg-white/40 blur-sm pointer-events-none"
                style={{ left: `${puff.left}%`, top: "-30px" }}
              />
            ))}
        </AnimatePresence>

        {/* TOP TIER (Strawberry Frosting & Dripping Glaze) */}
        <div className="relative w-52 h-20 bg-gradient-to-b from-pink-300 via-pink-400 to-rose-400 rounded-t-3xl shadow-lg border-t-2 border-pink-100/60 overflow-hidden flex items-center justify-center">
          {/* Glaze Drops */}
          <div className="absolute top-0 inset-x-0 h-4 bg-pink-100/70 rounded-full blur-[1px]" />
          
          {/* Sprinkles */}
          <span className="absolute top-3 left-6 w-1.5 h-1.5 rounded-full bg-amber-200" />
          <span className="absolute top-5 right-8 w-1.5 h-1.5 rounded-full bg-rose-200" />
          <span className="absolute top-8 left-12 w-2 h-1 rounded-sm bg-yellow-200 rotate-45" />
          <span className="absolute top-6 right-16 w-2 h-1 rounded-sm bg-fuchsia-300 -rotate-12" />

          {/* Name Plate */}
          <div className="px-4 py-1 rounded-xl bg-white/90 backdrop-blur-md shadow-md border border-pink-200 text-center z-10 transform group-hover:scale-105 transition-transform">
            <span className="font-serif font-bold text-pink-700 text-base tracking-wide">
              {recipientName}
            </span>
          </div>
        </div>

        {/* BOTTOM TIER (Vanilla & Velvet Cake) */}
        <div className="w-64 h-24 -mt-2 bg-gradient-to-b from-pink-400 via-rose-400 to-rose-500 rounded-b-3xl shadow-2xl border-t border-pink-200/40 relative flex items-center justify-center">
          {/* Middle Cream Layer */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-2 bg-pink-100/80 shadow-inner" />

          {/* Golden Stand / Plate */}
          <div className="absolute -bottom-3 inset-x-0 mx-auto w-72 h-3 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-full shadow-lg border border-yellow-300/60" />
        </div>
      </div>

      {/* WISH STATUS & MESSAGE */}
      <div className="h-14 flex items-center justify-center mt-3 text-center">
        {candlesOut ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-pink-200 via-rose-100 to-amber-200 bg-clip-text text-transparent font-serif drop-shadow-md">
              ✨ Make a wish, Harleen! ✨
            </span>
            <span className="text-xs text-pink-300/80 mt-1">Tap the cake anytime to relight it 🕯️</span>
          </motion.div>
        ) : (
          <p className="text-sm text-pink-200/90 font-medium">
            Tap the cake or blow into your mic to extinguish the candles!
          </p>
        )}
      </div>

      {/* INTERACTIVE MIC CONTROLS */}
      <div className="mt-2 flex items-center gap-3">
        {!candlesOut && (
          <button
            onClick={micActive ? stopMic : startMic}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-md ${
              micActive
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{micActive ? "Listening for your breath... Blow!" : "Enable Mic Blow 🎙️"}</span>
          </button>
        )}
      </div>

      {micError && <p className="text-xs text-rose-300 mt-2 text-center">{micError}</p>}
    </div>
  );
}
