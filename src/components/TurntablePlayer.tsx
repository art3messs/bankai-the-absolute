"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  SkipForward,
  SkipBack,
  Sparkles,
  Music,
  ExternalLink,
} from "lucide-react";
import { BIRTHDAY_CONFIG, SongTrack } from "@/data/config";

interface TurntablePlayerProps {
  autoPlayTrigger?: boolean;
}

export default function TurntablePlayer({ autoPlayTrigger }: TurntablePlayerProps) {
  const tracks = BIRTHDAY_CONFIG.playlist || [
    {
      id: "track-1",
      title: "K.",
      artist: "Cigarettes After Sex",
      src: "/music/track.mp3",
      cover: "/media/harleen-red-feather-dress.jpg",
      quote: "Remember when I started crying to you... Harleen 4 Life.",
      duration: "5:17",
    },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");
  const [durationFormatted, setDurationFormatted] = useState("0:00");
  const [showPlaylist, setShowPlaylist] = useState(false);
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

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
  };

  const handlePrevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
  };

  // Switch track in audio element
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.src;
    if (isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [currentTrackIndex]);

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
    <div className="editorial-card p-6 sm:p-8 rounded-3xl max-w-lg w-full flex flex-col items-center select-none shadow-sm border border-[#d97d93]/35 relative overflow-hidden bg-white/95 backdrop-blur-md">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNextTrack}
      />

      {/* Top Track Pill */}
      <div className="flex items-center justify-between w-full mb-4 px-2">
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#c95874] font-bold">
          <Disc3 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" style={{ animationDuration: "10s" }} />
          <span>HARLEEN VINYL • 33 RPM</span>
        </div>
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="text-[10px] font-raleway tracking-wider uppercase text-[#7d7265] hover:text-[#241e16] font-bold bg-[#fdfaf5] px-2.5 py-1 rounded-full border border-[#d97d93]/30 transition-all cursor-pointer"
        >
          {showPlaylist ? "Hide Tracks" : `Playlist (${tracks.length})`}
        </button>
      </div>

      {/* TURNTABLE DECK */}
      <div className="relative w-full aspect-square max-w-[270px] bg-[#fdfaf5] rounded-3xl p-4 shadow-inner border border-[#d97d93]/25 flex items-center justify-center">
        {/* Golden Tonearm with Animation */}
        <motion.div
          animate={{ rotate: isPlaying ? 24 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-4 right-5 w-4 h-36 origin-top-right z-30 pointer-events-none"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d4af37] via-[#f3e5ab] to-[#b8860b] shadow-md border border-[#d4af37] ml-auto -mr-2" />
          <div className="w-1 h-28 bg-gradient-to-b from-[#f3e5ab] via-[#d4af37] to-[#b8860b] mx-auto shadow-xs" />
          <div className="w-3.5 h-6 bg-[#c95874] border border-[#d4af37] rounded-xs mx-auto shadow-xs" />
        </motion.div>

        {/* ROTATING VINYL RECORD WITH ALBUM ART IN CENTER */}
        <div
          onClick={togglePlay}
          className={`relative w-full h-full rounded-full bg-[#18131d] shadow-2xl border-4 border-[#241e16] flex items-center justify-center cursor-pointer group transition-transform ${
            isPlaying ? "animate-vinyl" : ""
          }`}
          style={{
            backgroundImage: `radial-gradient(circle, #1a1420 28%, #281f33 29%, #1a1420 34%, #281f33 38%, #1a1420 43%, #281f33 48%, #1a1420 55%, #2a2036 60%, #1a1420 65%, #2a2036 75%, #16111b 100%)`,
          }}
          title={isPlaying ? "Click to Pause" : "Click to Play"}
        >
          {/* Vinyl Grooves Sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* CENTER LABEL WITH DYNAMIC ALBUM ART / SONG LOGO */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden p-0.5 shadow-2xl border-2 border-[#d4af37] bg-white flex items-center justify-center">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            {/* Center Spindle Hole */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-[#18131d] border-2 border-[#d4af37] shadow-inner" />
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="w-full text-center mt-5">
        <h4 className="font-forum text-xl sm:text-2xl uppercase tracking-wider text-[#241e16]">
          {currentTrack.title} • {currentTrack.artist}
        </h4>
        <p className="font-signature text-2xl text-[#c95874] mt-1">
          &ldquo;{currentTrack.quote}&rdquo;
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
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Playback Controls & Track Switcher */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4">
        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-neutral-100 text-[#7d7265] transition-colors cursor-pointer"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Previous Track */}
        <button
          onClick={handlePrevTrack}
          className="p-2.5 rounded-full hover:bg-neutral-100 text-[#241e16] border border-[#d97d93]/30 transition-transform active:scale-90 cursor-pointer"
          title="Previous Track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Main Play / Pause Button */}
        <button
          onClick={togglePlay}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] hover:opacity-95 text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              <span>Spin &amp; Play</span>
            </>
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={handleNextTrack}
          className="p-2.5 rounded-full hover:bg-neutral-100 text-[#241e16] border border-[#d97d93]/30 transition-transform active:scale-90 cursor-pointer"
          title="Next Track"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Spotify External Link */}
        <a
          href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-neutral-100 text-[#1DB954] transition-colors cursor-pointer"
          title="Open Curated Playlist on Spotify"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Expandable Track Selector */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 pt-4 border-t border-[#d97d93]/20 flex flex-col gap-2 overflow-hidden"
          >
            <span className="text-[10px] font-raleway font-bold uppercase tracking-widest text-[#7d7265] text-left">
              Select A Song To Spin On Vinyl:
            </span>
            {tracks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  currentTrackIndex === idx
                    ? "bg-rose-50 border border-rose-300 text-[#c95874] font-bold shadow-xs"
                    : "hover:bg-neutral-50 text-[#241e16]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={t.cover}
                    alt={t.title}
                    className="w-7 h-7 rounded-md object-cover border border-[#d97d93]/30"
                  />
                  <div>
                    <span className="block leading-tight">{t.title}</span>
                    <span className="text-[10px] text-[#7d7265] font-normal">{t.artist}</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#7d7265]">{t.duration}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
