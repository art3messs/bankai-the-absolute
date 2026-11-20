"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Disc3, Sparkles } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

interface TurntablePlayerProps {
  autoPlayTrigger?: boolean;
}

export default function TurntablePlayer({ autoPlayTrigger }: TurntablePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");
  const [durationFormatted, setDurationFormatted] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [autoPlayTrigger]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
    setCurrentTimeFormatted(formatTime(current));
    setDurationFormatted(formatTime(duration));
  };

  return (
    <div className="glass-pearl p-6 sm:p-8 rounded-3xl max-w-lg w-full flex flex-col items-center select-none shadow-2xl relative overflow-hidden border border-pink-200/80">
      {/* Background Soft Pink Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-300/20 rounded-full blur-[70px] pointer-events-none" />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={BIRTHDAY_CONFIG.music.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* TURNTABLE DECK (Pearl White with Gold Borders) */}
      <div className="relative w-full aspect-square max-w-[290px] bg-white rounded-3xl p-4 shadow-xl border-2 border-pink-100 flex items-center justify-center">
        {/* Tonearm (Polished Champagne Gold) */}
        <motion.div
          animate={{ rotate: isPlaying ? 24 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-4 right-5 w-4 h-36 origin-top-right z-30 pointer-events-none"
        >
          {/* Base */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 shadow-md border border-amber-400 ml-auto -mr-2" />
          {/* Gold Bar */}
          <div className="w-1.5 h-28 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 mx-auto shadow-sm" />
          {/* Cartridge */}
          <div className="w-3.5 h-6 bg-rose-500 border border-amber-300 rounded-sm mx-auto shadow-sm" />
        </motion.div>

        {/* VINYL RECORD */}
        <div
          onClick={togglePlay}
          className={`relative w-full h-full rounded-full bg-[#18131d] shadow-2xl border-4 border-neutral-900 flex items-center justify-center cursor-pointer group transition-transform ${
            isPlaying ? "animate-vinyl" : ""
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, #1a1420 28%, #281f33 29%, #1a1420 34%, #281f33 38%, #1a1420 43%, #281f33 48%, #1a1420 55%, #2a2036 60%, #1a1420 65%, #2a2036 75%, #16111b 100%)`,
          }}
          title={isPlaying ? "Pause vinyl" : "Spin vinyl"}
        >
          {/* Sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Strawberry Rose Center Label */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff758f] via-[#ff8fa3] to-[#ffb3c1] p-0.5 shadow-inner flex flex-col items-center justify-center text-center border-2 border-amber-200">
            <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center p-1 shadow-inner">
              <span className="text-[7.5px] uppercase tracking-widest text-amber-600 font-extrabold">
                CAS • 33 RPM
              </span>
              <span className="font-serif font-black text-rose-600 text-xs tracking-wider uppercase mt-0.5 leading-tight">
                harleen 4 life
              </span>
              <span className="text-[8.5px] text-pink-600 tracking-tight font-hand font-bold mt-0.5">
                the only one I adore 🌸
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-amber-400 mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="w-full text-center mt-5">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
          <h4 className="font-serif text-xl font-bold text-[#2e1322] tracking-wide">
            K. • Cigarettes After Sex
          </h4>
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
        <p className="font-hand text-xl text-rose-600 mt-0.5">
          &ldquo;Remember when I started crying to you...&rdquo;
        </p>
      </div>

      {/* Progress Bar with Brightener */}
      <div className="w-full mt-4 px-2">
        <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden cursor-pointer shadow-inner">
          <div
            className="bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400 h-full transition-all duration-200 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-rose-800/70 mt-1 font-mono">
          <span>{currentTimeFormatted}</span>
          <span>{durationFormatted}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-pink-100 text-rose-700 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <button
          onClick={togglePlay}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm shadow-[0_4px_20px_rgba(251,191,36,0.5)] active:scale-95 transition-all flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-black" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black ml-0.5" />
              <span>Listen</span>
            </>
          )}
        </button>

        <a
          href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-pink-100 text-rose-700 transition-colors"
          title="Open Track on Spotify"
        >
          <Disc3 className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
