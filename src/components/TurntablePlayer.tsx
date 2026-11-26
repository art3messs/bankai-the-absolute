"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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
  Disc3,
} from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";
import { COPY } from "@/data/copy";

interface TurntablePlayerProps {
  autoPlayTrigger?: boolean;
}

const WAVEFORM_BARS = [0.35, 0.72, 0.55, 0.95, 0.65, 0.85, 0.45, 0.92, 0.75, 0.52, 0.88, 0.6, 0.42, 0.78];

const emptySubscribe = () => () => {};

export default function TurntablePlayer({ autoPlayTrigger }: TurntablePlayerProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
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
        .then(() => {
          setIsPlaying(true);
          setShowTapForMusic(false);
        })
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
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleStartAudio = () => {
      if (!audioRef.current) return;
      setAudioError(null);
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
  }, []);

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

  // Body scroll lock for Spotify modal
  useEffect(() => {
    if (!isSpotifyModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSpotifyModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSpotifyModalOpen]);

  const spotifyEmbedSrc = `https://open.spotify.com/embed/playlist/${BIRTHDAY_CONFIG.spotifyPlaylistId || "06Aj93NfdzlxVX8Sw1dlXK"}?utm_source=generator&theme=0`;

  return (
    <section id="sound" className="relative z-10 max-w-4xl mx-auto px-4 py-7 sm:py-10 flex flex-col items-center text-center">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onPlay={() => {
          setIsPlaying(true);
          setShowTapForMusic(false);
          setAudioError(null);
        }}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={() => {
          if (!audioRef.current) return;
          const dur = audioRef.current.duration || 0;
          if (dur > 0) setDurationFormatted(formatTime(dur));
        }}
        onError={() => {
          setIsPlaying(false);
          setAudioError("Could not load audio track");
        }}
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

      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.music.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.music.subtitle}&rdquo;
      </p>

      {/* Atelier Vinyl Turntable Console */}
      <div className="w-full max-w-xl mt-7 p-6 sm:p-8 rounded-[28px] paper-card relative overflow-hidden flex flex-col items-center">
        {/* Top Deck Status */}
        <div className="w-full flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] text-mauve mb-5">
          <span className="flex items-center gap-2 font-semibold text-strawberry">
            <Disc3 className={`w-3.5 h-3.5 text-gold ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span>Harleen Vinyl • 33 RPM</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-gold-light/35 border border-gold/30 text-ink/80 text-[10px]">
            {isPlaying ? "Now Spinning" : "Ready"}
          </span>
        </div>

        {/* TURNTABLE PLATTER + ANIMATED BRUSHED GOLD TONEARM */}
        <div className="relative w-full max-w-[280px] aspect-square rounded-[26px] bg-gradient-to-br from-[#FBF4EB] via-[#F6E8DD] to-[#EFD8CE] p-5 border border-gold/40 shadow-[inset_0_2px_8px_rgba(43,21,36,0.08),0_18px_40px_rgba(43,21,36,0.1)] flex items-center justify-center">
          {/* Metallic Corner Screws */}
          <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gold/50" />
          <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gold/50" />
          <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gold/50" />

          {/* Brushed Gold Pivoting Tonearm */}
          <motion.div
            animate={{ rotate: isPlaying ? 23 : 0 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
            className="absolute top-3.5 right-4 w-5 h-36 origin-top-right z-30 pointer-events-none"
          >
            {/* Gimbal Base */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9B721F] via-[#F6E5B6] to-[#C89B3C] shadow-md border border-[#A67D24] ml-auto -mr-1.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-ink/80" />
            </div>
            {/* Arm Shaft */}
            <div className="w-[3px] h-24 bg-gradient-to-b from-[#F6E5B6] via-[#C89B3C] to-[#9B721F] mx-auto shadow-xs" />
            {/* Crimson Head Shell */}
            <div className="w-3.5 h-6 bg-gradient-to-b from-strawberry to-[#8F153D] border border-gold-light/70 rounded-xs mx-auto shadow-sm" />
          </motion.div>

          {/* Glowing Aura Underneath Vinyl When Spinning */}
          {isPlaying && (
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-strawberry/20 blur-xl pointer-events-none animate-pulse"
            />
          )}

          {/* ROTATING VINYL RECORD WITH REALISTIC RADIAL GROOVES */}
          <div
            onClick={togglePlay}
            className={`relative w-full h-full rounded-full shadow-[0_18px_38px_rgba(18,8,15,0.45)] border-[5px] border-[#1A1219] flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.015] ${
              isPlaying ? "animate-vinyl" : ""
            }`}
            style={{
              backgroundImage:
                "radial-gradient(circle, #181119 26%, #2C2131 27%, #171018 32%, #291E2F 37%, #171018 42%, #2A1F31 47%, #171018 52%, #2A1F31 58%, #171018 65%, #2D2234 74%, #130D14 100%)",
            }}
            title={isPlaying ? "Tap to pause" : "Tap to spin & play"}
          >
            {/* Spinning Iridescent Conic Reflection Sheen */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full pointer-events-none opacity-45"
              style={{
                background:
                  "conic-gradient(from 40deg, transparent 0deg, rgba(255,248,235,0.2) 38deg, transparent 85deg, transparent 180deg, rgba(244,185,201,0.18) 218deg, transparent 270deg)",
              }}
            />

            {/* Gold-Framed Center Album Label */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden p-0.5 shadow-xl border-2 border-gold bg-paper flex items-center justify-center">
              <Image
                src={currentTrack.cover}
                alt={currentTrack.title}
                fill
                sizes="96px"
                className="object-cover filter brightness-95"
              />
              <div className="absolute w-3.5 h-3.5 rounded-full bg-[#181119] border-2 border-gold shadow-inner" />
            </div>
          </div>
        </div>

        {/* Acoustic Waveform Ribbon */}
        <div className="flex items-end justify-center gap-1.5 h-6 mt-5" aria-hidden="true">
          {WAVEFORM_BARS.map((heightRatio, idx) => (
            <span
              key={idx}
              className="w-1 rounded-full bg-gradient-to-t from-strawberry to-gold origin-bottom transition-opacity duration-300"
              style={{
                height: `${Math.round(heightRatio * 22)}px`,
                opacity: isPlaying ? 0.9 : 0.25,
                animation: isPlaying ? `eqPulse ${0.65 + (idx % 4) * 0.14}s ease-in-out ${idx * 0.06}s infinite` : "none",
              }}
            />
          ))}
        </div>

        {/* Track Title & Lyric Note */}
        <div className="w-full text-center mt-3">
          <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
            {currentTrack.title} • {currentTrack.artist}
          </h3>
          <p className="font-hand text-2xl text-strawberry/90 mt-1">
            &ldquo;{currentTrack.quote}&rdquo;
          </p>
        </div>

        {/* Scrub Bar */}
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
          <div className="flex justify-between items-center text-xs text-mauve mt-1.5 font-mono">
            <span>{currentTimeFormatted}</span>
            <span>{durationFormatted !== "0:00" ? durationFormatted : currentTrack.duration}</span>
          </div>
          {audioError && (
            <p role="alert" className="text-xs text-strawberry text-center mt-1">
              {audioError}
            </p>
          )}
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={toggleMute}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-paper border border-gold/30 hover:border-strawberry/50 text-ink/80 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-strawberry" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="px-7 py-3 min-h-[44px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper font-sans font-semibold text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(212,40,90,0.3)] border border-gold-light/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-paper" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-paper ml-0.5" />
                <span>Spin &amp; Play</span>
              </>
            )}
          </button>
        </div>

        {/* Spotify Mixtape Drawer Row */}
        <div className="w-full mt-6 pt-5 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-strawberry/15 to-gold-light/35 border border-gold/25 text-strawberry flex items-center justify-center shrink-0">
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
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("harleen:pause-music"));
                setIsSpotifyModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2 min-h-[40px] rounded-full bg-paper border border-gold/35 hover:border-strawberry text-ink text-xs font-sans font-semibold transition-colors text-center cursor-pointer"
            >
              {COPY.music.openSpotifyButton}
            </button>
            <a
              href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-paper border border-gold/35 hover:border-strawberry text-ink transition-colors cursor-pointer"
              title="Open Spotify playlist"
              aria-label="Open Spotify playlist in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Spotify Embed Modal (Portalled above all sections) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isSpotifyModalOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={COPY.music.playlistCardTitle}
                onClick={() => setIsSpotifyModalOpen(false)}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/65 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg paper-card rounded-3xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gold/20 mb-4">
                    <h4 className="font-serif text-xl text-ink font-normal">
                      {COPY.music.playlistCardTitle}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsSpotifyModalOpen(false)}
                      aria-label="Close Spotify player"
                      className="w-9 h-9 rounded-full hover:bg-mauve/10 flex items-center justify-center text-ink cursor-pointer"
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
          </AnimatePresence>,
          document.body
        )}

      {/* Autoplay Fallback Pill */}
      <AnimatePresence>
        {showTapForMusic && !isPlaying && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
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
            className="fixed bottom-5 right-5 z-40 px-4 py-2.5 min-h-[44px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper text-xs font-sans font-semibold shadow-xl border border-gold-light/40 flex items-center gap-2 cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 animate-pulse" />
            <span>Tap for music</span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
