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
    <div className="editorial-card p-6 sm:p-8 rounded-3xl max-w-lg w-full flex flex-col items-center select-none shadow-xs border border-[#d97d93]/30 relative overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={BIRTHDAY_CONFIG.music.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* TURNTABLE DECK */}
      <div className="relative w-full aspect-square max-w-[280px] bg-white rounded-3xl p-4 shadow-sm border border-[#d97d93]/20 flex items-center justify-center">
        {/* Tonearm */}
        <motion.div
          animate={{ rotate: isPlaying ? 22 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-4 right-5 w-4 h-36 origin-top-right z-30 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#b8860b] shadow-md border border-[#d4af37] ml-auto -mr-2" />
          <div className="w-1 h-28 bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] mx-auto shadow-xs" />
          <div className="w-3.5 h-6 bg-[#c95874] border border-[#d4af37] rounded-xs mx-auto shadow-xs" />
        </motion.div>

        {/* VINYL RECORD */}
        <div
          onClick={togglePlay}
          className={`relative w-full h-full rounded-full bg-[#18131d] shadow-xl border-4 border-[#241e16] flex items-center justify-center cursor-pointer group transition-transform ${
            isPlaying ? "animate-vinyl" : ""
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, #1a1420 28%, #281f33 29%, #1a1420 34%, #281f33 38%, #1a1420 43%, #281f33 48%, #1a1420 55%, #2a2036 60%, #1a1420 65%, #2a2036 75%, #16111b 100%)`,
          }}
          title={isPlaying ? "Pause vinyl" : "Spin vinyl"}
        >
          {/* Sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Center Label */}
          <div className="w-24 h-24 rounded-full bg-[#fdfaf5] p-0.5 shadow-inner flex flex-col items-center justify-center text-center border-2 border-[#d4af37]">
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-1 shadow-inner">
              <span className="text-[7px] uppercase tracking-[0.25em] text-[#7d7265] font-bold">
                CAS • 33 RPM
              </span>
              <span className="font-forum text-xs font-bold text-[#c95874] tracking-wider uppercase mt-0.5 leading-tight">
                harleen 4 life
              </span>
              <span className="text-[9px] text-[#7d7265] font-signature mt-0.5">
                the only one I adore
              </span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#241e16] border border-[#d4af37] mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="w-full text-center mt-5">
        <h4 className="font-forum text-xl uppercase tracking-wider text-[#241e16]">
          K. • Cigarettes After Sex
        </h4>
        <p className="font-signature text-2xl text-[#7d7265] mt-1">
          &ldquo;Remember when I started crying to you...&rdquo;
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-4 px-2">
        <div className="w-full bg-[#f2ccd6]/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
          <div
            className="bg-gradient-to-r from-[#d97d93] to-[#d4af37] h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-[#7d7265] mt-1 font-mono">
          <span>{currentTimeFormatted}</span>
          <span>{durationFormatted}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-neutral-100 text-[#7d7265] transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={togglePlay}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] hover:opacity-95 text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              <span>Listen</span>
            </>
          )}
        </button>

        <a
          href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-neutral-100 text-[#7d7265] transition-colors"
          title="Open Track on Spotify"
        >
          <Disc3 className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
