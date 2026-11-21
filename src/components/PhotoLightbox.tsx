"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { MediaItem } from "@/data/mediaCatalog";

interface PhotoLightboxProps {
  item?: MediaItem | null;
  photo?: any | null; // backward compatibility
  items?: MediaItem[];
  currentIndex?: number;
  onNavigate?: (index: number) => void;
  onClose: () => void;
}

export default function PhotoLightbox({
  item,
  photo,
  items = [],
  currentIndex = 0,
  onNavigate,
  onClose,
}: PhotoLightboxProps) {
  // Normalize current item
  const currentMedia: MediaItem | null = item || (photo ? {
    id: photo.id || "legacy",
    src: photo.url || "",
    type: "image",
    category: photo.category || "harleen 4 life",
    title: photo.caption || "Special Moment",
    caption: photo.caption || "",
    aspectRatio: "portrait",
  } : null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape & Arrow keys for navigation
  useEffect(() => {
    if (!currentMedia) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onNavigate && items.length > 0) {
        const prevIdx = (currentIndex - 1 + items.length) % items.length;
        onNavigate(prevIdx);
      } else if (e.key === "ArrowRight" && onNavigate && items.length > 0) {
        const nextIdx = (currentIndex + 1) % items.length;
        onNavigate(nextIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMedia, currentIndex, items, onNavigate, onClose]);

  // Reset video state on item switch
  useEffect(() => {
    if (currentMedia?.type === "video") {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay policy might require mute
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [currentMedia?.id]);

  if (!currentMedia) return null;

  const hasMultiple = items.length > 1;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const spawnHearts = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: -Math.random() * 80 - 20,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.slice(newHearts.length));
    }, 1200);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "harleen 4 life":
        return "bg-rose-500/20 text-rose-300 border-rose-400/40";
      case "popaaa moments":
        return "bg-amber-500/20 text-amber-300 border-amber-400/40";
      case "sick in ethnic":
        return "bg-purple-500/20 text-purple-300 border-purple-400/40";
      case "little pogo":
        return "bg-pink-400/20 text-pink-200 border-pink-300/40";
      case "aesthick nails":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";
      default:
        return "bg-white/20 text-white border-white/30";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl select-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 25 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full bg-[#1c1713]/95 text-[#fdfaf5] rounded-3xl p-4 sm:p-7 border border-[#d4af37]/30 shadow-[0_0_80px_rgba(217,125,147,0.25)] flex flex-col items-center overflow-hidden"
        >
          {/* Subtle Golden Vignette Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#c95874]/20 via-[#d4af37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Top Control Bar */}
          <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#d4af37] font-semibold uppercase tracking-wider text-[11px]">
                {currentMedia.type === "video" ? "CINEMATIC MOTION • 35MM" : "KODAK PORTRA • STILL"}
              </span>
              {hasMultiple && (
                <span className="text-[#a89f91] font-mono text-[10px]">
                  ({currentIndex + 1} / {items.length})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 border border-white/15"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Media Showcase Container */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[65vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center group">
            {currentMedia.type === "video" ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={currentMedia.src}
                  poster={currentMedia.poster || undefined}
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  className="w-full h-full object-contain"
                  onClick={togglePlay}
                />

                {/* Video Play/Pause Overlay Indicator */}
                {!isPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Floating Video Controls in Bottom Right */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs flex items-center gap-1.5 border border-white/20 shadow-md transition-all active:scale-95"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-green-300" />}
                    <span className="text-[11px] font-mono">{isMuted ? "MUTED" : "SOUND ON"}</span>
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />}
                  </button>
                </div>
              </div>
            ) : (
              <img
                src={currentMedia.src}
                alt={currentMedia.title}
                className="w-full h-full object-contain"
              />
            )}

            {/* Navigation Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={() => onNavigate && onNavigate((currentIndex - 1 + items.length) % items.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                  title="Previous (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => onNavigate && onNavigate((currentIndex + 1) % items.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
                  title="Next (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Caption & Metadata Footer */}
          <div className="relative z-10 w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
            <div className="space-y-1 max-w-lg">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-raleway font-bold uppercase tracking-wider border ${getCategoryColor(currentMedia.category)}`}>
                  {currentMedia.category}
                </span>
                <span className="text-[11px] text-[#d4af37] font-mono">
                  {currentMedia.type === "video" ? "MOTION CLIP" : "ARCHIVAL PHOTOGRAPH"}
                </span>
              </div>
              <h3 className="font-forum text-xl sm:text-2xl text-[#fdfaf5] font-normal leading-tight">
                {currentMedia.title}
              </h3>
              <p className="font-signature text-xl text-[#d97d93] leading-snug">
                {currentMedia.caption}
              </p>
            </div>

            {/* Love Heart Action */}
            <div className="relative flex items-center gap-3">
              <button
                onClick={spawnHearts}
                className="relative px-4 py-2 rounded-full bg-gradient-to-r from-[#d97d93] to-[#c95874] text-white text-xs font-raleway font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Heart className="w-4 h-4 fill-white animate-pulse" />
                <span>Send Love</span>

                {/* Floating Click Hearts */}
                {hearts.map((h) => (
                  <motion.span
                    key={h.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, x: h.x, y: h.y, scale: 1.5 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute text-rose-300 pointer-events-none text-base"
                  >
                    ♥
                  </motion.span>
                ))}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
