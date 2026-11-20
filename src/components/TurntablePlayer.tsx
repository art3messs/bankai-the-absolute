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
    <div className="editorial-card p-5 sm:p-6 rounded-3xl max-w-lg w-full flex flex-col items-center select-none shadow-2xl relative overflow-hidden border border-rose-300/20">
      {/* Ambient Turntable Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-[70px] pointer-events-none" />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={BIRTHDAY_CONFIG.music.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Turntable Deck */}
      <div className="relative w-full aspect-square max-w-[280px] bg-gradient-to-b from-[#18121f] to-[#0c0910] rounded-3xl p-4 shadow-2xl border border-white/10 flex items-center justify-center">
        {/* Tonearm (Pivots when playing) */}
        <motion.div
          animate={{ rotate: isPlaying ? 24 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-4 right-5 w-4 h-36 origin-top-right z-30 pointer-events-none"
        >
          {/* Pivot Base */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-200 to-amber-400 shadow-md border border-amber-300/60 ml-auto -mr-2" />
          {/* Arm Bar */}
          <div className="w-1.5 h-28 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300 mx-auto shadow-md" />
          {/* Cartridge / Head */}
          <div className="w-3.5 h-6 bg-rose-900 border border-amber-300/80 rounded-sm mx-auto shadow-md" />
        </motion.div>

        {/* VINYL RECORD */}
        <div
          onClick={togglePlay}
          className={`relative w-full h-full rounded-full bg-[#0d0b0f] shadow-2xl border-4 border-black/80 flex items-center justify-center cursor-pointer group transition-transform ${
            isPlaying ? "animate-vinyl" : ""
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, #0e0c12 28%, #14101a 29%, #0e0c12 34%, #14101a 38%, #0e0c12 43%, #14101a 48%, #0e0c12 55%, #181320 60%, #0e0c12 65%, #181320 75%, #0a080d 100%)`,
          }}
          title={isPlaying ? "Pause vinyl" : "Spin vinyl"}
        >
          {/* Vinyl Grooves Sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

          {/* Dusty Rose Center Label */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#d48b9f] via-[#e5a2b3] to-[#f4c2ce] p-0.5 shadow-inner flex flex-col items-center justify-center text-center border border-amber-200/40">
            <div className="w-full h-full rounded-full bg-[#1c1219]/90 flex flex-col items-center justify-center p-1.5">
              <span className="text-[9px] uppercase tracking-widest text-amber-200 font-bold">
                CAS • 33 RPM
              </span>
              <span className="font-serif font-black text-rose-200 text-sm tracking-wider">
                K.
              </span>
              <span className="text-[8px] text-rose-300/80 tracking-tight font-sans">
                For Harleen 🤍
              </span>
              {/* Spindle hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-black border border-amber-300/60 mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Track Info & Lyric Line */}
      <div className="w-full text-center mt-5">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <h4 className="font-serif text-lg font-bold text-white tracking-wide">
            K. • Cigarettes After Sex
          </h4>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        </div>
        <p className="font-hand text-lg text-rose-200/80 mt-0.5 italic">
          &ldquo;Remember when I started crying to you...&rdquo;
        </p>
      </div>

      {/* Scrubber & Duration */}
      <div className="w-full mt-4 px-2">
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden cursor-pointer">
          <div
            className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-rose-200/60 mt-1 font-mono">
          <span>{currentTimeFormatted}</span>
          <span>{durationFormatted}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-white/10 text-rose-200/80 hover:text-white transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={togglePlay}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(253,224,71,0.4)] active:scale-95 transition-all flex items-center gap-2"
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
          className="p-2 rounded-full hover:bg-white/10 text-rose-200/80 hover:text-white transition-colors"
          title="Open Track on Spotify"
        >
          <Disc3 className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
