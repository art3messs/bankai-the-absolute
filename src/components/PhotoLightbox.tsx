"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { MediaItem } from "@/data/mediaCatalog";
import { CAPTIONS } from "@/data/captions";

interface PhotoLightboxProps {
  item?: MediaItem | null;
  photo?: { id?: string; url?: string; caption?: string; category?: string } | null;
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
  // Normalize current item with stable memo
  const currentMedia: MediaItem | null = useMemo(() => {
    return (
      item ||
      (photo
        ? {
            id: photo.id || "legacy",
            src: photo.url || "",
            type: "image",
            category: (photo.category as MediaItem["category"]) || "harleen 4 life",
            title: photo.caption || "Special Moment",
            caption: photo.caption || "",
            aspectRatio: "portrait",
          }
        : null)
    );
  }, [item, photo]);

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

  // Reset video state on item switch and pause global music
  useEffect(() => {
    if (currentMedia?.type === "video") {
      window.dispatchEvent(new CustomEvent("harleen:pause-music"));
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [currentMedia?.id, currentMedia?.type]);

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

  const spawnHearts = () => {
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

  const captionData = currentMedia ? CAPTIONS[currentMedia.id] : null;
  const displayCaption =
    captionData?.line && !captionData.line.startsWith("TODO:")
      ? captionData.line
      : currentMedia?.caption;

  return (
    <AnimatePresence>
      {currentMedia && (
        <motion.div
          key="photo-lightbox-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full m-auto my-auto max-h-[calc(100dvh-2rem)] bg-paper text-ink rounded-3xl p-4 sm:p-6 border border-mauve/25 shadow-2xl flex flex-col items-center overflow-hidden"
          >
            {/* Top Control Bar */}
            <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-mauve/15 mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-sans text-strawberry font-semibold uppercase tracking-wider text-[11px]">
                  {currentMedia.type === "video" ? "Motion Clip" : "Photographic Still"}
                </span>
                {hasMultiple && (
                  <span className="text-mauve font-sans text-xs">
                    ({currentIndex + 1} of {items.length})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-mauve/10 hover:bg-mauve/20 text-ink flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                  title="Close (Esc)"
                  aria-label="Close lightbox"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Media Showcase Container */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[60vh] rounded-2xl overflow-hidden bg-stone-900 border border-mauve/20 flex items-center justify-center group">
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
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />

                  {/* Video Play/Pause Overlay Indicator */}
                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-paper/20 backdrop-blur-md border border-paper/40 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                        <Play className="w-7 h-7 text-paper fill-paper ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Floating Video Controls in Bottom Right */}
                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="px-3 py-1.5 min-h-[36px] rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs flex items-center gap-1.5 border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-300" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-green-300" />
                      )}
                      <span className="text-[10px] font-sans">
                        {isMuted ? "MUTED" : "SOUND ON"}
                      </span>
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={currentMedia.src}
                    alt={currentMedia.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain"
                    priority
                  />
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() =>
                      onNavigate &&
                      onNavigate((currentIndex - 1 + items.length) % items.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-paper/85 hover:bg-paper backdrop-blur-md text-ink flex items-center justify-center border border-mauve/20 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                    title="Previous (Left Arrow)"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      onNavigate && onNavigate((currentIndex + 1) % items.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-paper/85 hover:bg-paper backdrop-blur-md text-ink flex items-center justify-center border border-mauve/20 transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                    title="Next (Right Arrow)"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Caption & Metadata Footer */}
            <div className="relative z-10 w-full mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
              <div className="space-y-1 max-w-lg text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider bg-strawberry/10 text-strawberry border border-strawberry/25">
                    {currentMedia.category}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-ink font-normal leading-tight">
                  {currentMedia.title}
                </h3>
                {displayCaption && (
                  <p className="font-hand text-xl text-mauve leading-snug">
                    &ldquo;{displayCaption}&rdquo;
                  </p>
                )}
              </div>

              {/* Heart & Pucchi Action */}
              <div className="relative flex items-center gap-3">
                <button
                  onClick={spawnHearts}
                  className="relative px-4 py-2 rounded-full bg-strawberry text-paper text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-paper animate-pulse" />
                  <span>Send Pucchi 🤍</span>

                  {/* Floating Click Hearts */}
                  {hearts.map((h) => (
                    <motion.span
                      key={h.id}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, x: h.x, y: h.y, scale: 1.5 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute text-strawberry pointer-events-none text-base font-bold"
                    >
                      ♥
                    </motion.span>
                  ))}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
