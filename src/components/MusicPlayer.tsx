"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music as MusicIcon, ExternalLink } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

interface MusicPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function MusicPlayer({ autoPlayTrigger }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle playback
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy fallback
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle external autoplay trigger from start gate
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
  };

  return (
    <div className="glass-panel-glow px-4 py-2.5 rounded-2xl flex items-center gap-3.5 shadow-2xl border border-pink-300/40 select-none backdrop-blur-xl">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={BIRTHDAY_CONFIG.music.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      {/* Cassette / Disc Spinning Icon */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-400 to-fuchsia-400 p-0.5 shadow-md flex items-center justify-center">
        <div
          className={`w-full h-full rounded-[10px] bg-pink-950/80 flex items-center justify-center ${
            isPlaying ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "5s" }}
        >
          <MusicIcon className="w-5 h-5 text-pink-300" />
        </div>
      </div>

      {/* Song Details & Mini Scrubber */}
      <div className="flex flex-col min-w-[120px] max-w-[170px]">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-xs font-semibold text-pink-100 truncate">
            {BIRTHDAY_CONFIG.music.title}
          </span>
        </div>
        <span className="text-[10px] text-pink-300/80 truncate">
          {BIRTHDAY_CONFIG.music.artist}
        </span>

        {/* Progress Bar */}
        <div className="w-full bg-pink-950/50 h-1 rounded-full mt-1.5 overflow-hidden border border-pink-500/20">
          <div
            className="bg-gradient-to-r from-pink-400 to-rose-300 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        <button
          onClick={toggleMute}
          className="p-1.5 text-pink-300 hover:text-white transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Spotify Playlist Link */}
        {BIRTHDAY_CONFIG.spotifyPlaylistUrl && (
          <a
            href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-pink-300 hover:text-white transition-colors"
            title="Open Spotify Playlist"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
