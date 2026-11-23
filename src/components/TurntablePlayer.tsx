"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  ExternalLink,
  X,
} from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";
import { COPY } from "@/data/copy";

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

  const currentTrack = tracks[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");
  const [durationFormatted, setDurationFormatted] = useState("0:00");
  const [isSpotifyModalOpen, setIsSpotifyModalOpen] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showTapForMusic, setShowTapForMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFirstMount = useRef(true);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    setAudioError(null);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setAudioError("Tap play to start audio");
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekPct = Number(e.target.value);
    const newTime = (seekPct / 100) * (audioRef.current.duration || 1);
    audioRef.current.currentTime = newTime;
    setProgress(seekPct);
  };

  useEffect(() => {
    const handlePauseRequest = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleStartAudio = () => {
      if (!audioRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowTapForMusic(false);
        })
        .catch(() => {
          setShowTapForMusic(true);
        });
    };

    const handleToggleAudio = () => {
      if (!audioRef.current) return;
      if (audioRef.current.paused) {
        handleStartAudio();
      } else {
        handlePauseRequest();
      }
    };

    window.addEventListener("harleen:pause-music", handlePauseRequest);
    window.addEventListener("harleen:start-audio", handleStartAudio);
    window.addEventListener("harleen:toggle-music", handleToggleAudio);

    return () => {
      window.removeEventListener("harleen:pause-music", handlePauseRequest);
      window.removeEventListener("harleen:start-audio", handleStartAudio);
      window.removeEventListener("harleen:toggle-music", handleToggleAudio);
    };
  }, [isPlaying]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("harleen:music-status", { detail: { isPlaying } })
    );
  }, [isPlaying]);

  useEffect(() => {
    if (autoPlayTrigger && isFirstMount.current && audioRef.current) {
      isFirstMount.current = false;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowTapForMusic(false);
        })
        .catch(() => {
          setShowTapForMusic(true);
        });
    }
  }, [autoPlayTrigger]);

  const spotifyEmbedSrc = `https://open.spotify.com/embed/playlist/${BIRTHDAY_CONFIG.spotifyPlaylistId || "06Aj93NfdzlxVX8Sw1dlXK"}?utm_source=generator&theme=0`;

  return (
    <section id="sound" className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={() => {
          if (!audioRef.current) return;
          const cur = audioRef.current.currentTime;
          const dur = audioRef.current.duration || 1;
          setProgress((cur / dur) * 100);
          setCurrentTimeFormatted(formatTime(cur));
          setDurationFormatted(formatTime(dur));
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
      />

      {/* Heading in sentence case, no tags */}
      <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
        {COPY.music.heading}
      </h2>
      <p className="font-hand text-2xl text-ink/80 mt-2">
        &ldquo;{COPY.music.subtitle}&rdquo;
      </p>

      {/* Unified Music & Turntable Card */}
      <div className="w-full max-w-xl mt-6 p-6 sm:p-8 rounded-3xl bg-paper border border-mauve/20 shadow-md flex flex-col items-center">
        {/* VINYL RECORD */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto my-2">
          <div
            onClick={togglePlay}
            className={`relative w-full h-full rounded-full bg-stone-900 shadow-xl border-4 border-stone-800 flex items-center justify-center cursor-pointer ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{
              animationDuration: "4s",
              animationTimingFunction: "linear",
            }}
            title={isPlaying ? "Click to pause" : "Click to play"}
          >
            {/* Center label */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-paper bg-paper flex items-center justify-center">
              <Image
                src={currentTrack.cover}
                alt={currentTrack.title}
                fill
                sizes="80px"
                className="object-cover filter brightness-95"
              />
              <div className="absolute w-3 h-3 rounded-full bg-stone-900 border border-paper" />
            </div>
          </div>
        </div>

        {/* Track Title and Artist */}
        <div className="w-full text-center mt-4">
          <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
            {currentTrack.title} • {currentTrack.artist}
          </h3>
          <p className="font-hand text-xl text-mauve mt-1">
            &ldquo;{currentTrack.quote}&rdquo;
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full mt-4 px-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            aria-label="Seek track position"
            className="w-full h-1.5 bg-mauve/20 rounded-full appearance-none cursor-pointer accent-strawberry focus:outline-none"
          />
          <div className="flex justify-between items-center text-xs text-mauve mt-1 font-mono">
            <span>{currentTimeFormatted}</span>
            <span>{durationFormatted !== "0:00" ? durationFormatted : currentTrack.duration}</span>
          </div>
          {audioError && (
            <p role="alert" className="text-xs text-strawberry text-center mt-1">
              {audioError}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full hover:bg-mauve/10 text-ink/80 flex items-center justify-center transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-strawberry" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            className="px-6 py-2.5 rounded-full bg-strawberry text-paper font-sans font-semibold text-xs uppercase tracking-wider shadow-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-paper" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-paper ml-0.5" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>

        {/* MERGED SPOTIFY MIXTAPE ROW */}
        <div className="w-full mt-6 pt-5 border-t border-mauve/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-strawberry/10 text-strawberry flex items-center justify-center shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-base text-ink font-normal">
                {COPY.music.playlistCardTitle}
              </p>
              <p className="font-sans text-xs text-mauve">
                {COPY.music.playlistCardSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("harleen:pause-music"));
                setIsSpotifyModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-mauve/30 hover:bg-mauve/5 text-ink text-xs font-sans font-semibold transition-colors text-center cursor-pointer"
            >
              {COPY.music.openSpotifyButton}
            </button>
            <a
              href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-mauve/30 hover:bg-mauve/5 text-ink transition-colors cursor-pointer"
              title="Open Spotify playlist"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Spotify Modal */}
      <AnimatePresence>
        {isSpotifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-paper rounded-3xl p-6 shadow-2xl border border-mauve/20"
            >
              <div className="flex items-center justify-between pb-3 border-b border-mauve/15 mb-4">
                <h4 className="font-serif text-xl text-ink font-normal">
                  {COPY.music.playlistCardTitle}
                </h4>
                <button
                  onClick={() => setIsSpotifyModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-mauve/10 flex items-center justify-center text-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={spotifyEmbedSrc}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating "Tap for music" button when autoplay was blocked */}
      <AnimatePresence>
        {showTapForMusic && !isPlaying && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                    setShowTapForMusic(false);
                  })
                  .catch(() => {});
              }
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-strawberry text-paper font-sans text-xs font-semibold shadow-xl border border-white/30 hover:opacity-95 active:scale-95 cursor-pointer transition-all animate-bounce"
            aria-label="Tap for music"
          >
            <Music className="w-4 h-4 text-paper" />
            <span>Tap for music</span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
