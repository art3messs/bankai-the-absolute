"use client";

import React, { useEffect, useState, useRef, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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

const emptySubscribe = () => () => {};

export default function PhotoLightbox({
  item,
  photo,
  items = [],
  currentIndex = 0,
  onNavigate,
  onClose,
}: PhotoLightboxProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
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
  const touchStartX = useRef<number | null>(null);

  // Body scroll lock & Escape / Arrow navigation
  useEffect(() => {
    if (!currentMedia) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const videoEl = videoRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onNavigate && items.length > 0) {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight" && onNavigate && items.length > 0) {
        onNavigate((currentIndex + 1) % items.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (videoEl) {
        videoEl.pause();
      }
    };
  }, [currentMedia, currentIndex, items, onNavigate, onClose]);

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
    const newHearts = Array.from({ length: 7 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 70,
      y: -Math.random() * 90 - 20,
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.slice(newHearts.length));
    }, 1200);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple || !onNavigate) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const diff = touchStartX.current - endX;
    touchStartX.current = null;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        onNavigate((currentIndex + 1) % items.length);
      } else {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
    }
  };

  const captionData = currentMedia ? CAPTIONS[currentMedia.id] : null;
  const displayCaption =
    captionData?.line && !captionData.line.startsWith("TODO:")
      ? captionData.line
      : currentMedia?.caption;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {currentMedia && (
        <motion.div
          key="photo-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label={currentMedia.title || "Photo lightbox"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-ink/80 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative max-w-4xl w-full m-auto my-auto max-h-[calc(100dvh-2rem)] paper-card p-4 sm:p-6 rounded-[28px] shadow-2xl flex flex-col items-center overflow-hidden"
          >
            {/* Top Bar */}
            <div className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-gold/20 mb-3 text-xs">
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

              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-mauve/10 hover:bg-mauve/20 text-ink flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                title="Close (Esc)"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Showcase */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] max-h-[60vh] rounded-2xl overflow-hidden bg-stone-950 border border-gold/25 flex items-center justify-center">
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

                  {!isPlaying && (
                    <div
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-paper/20 backdrop-blur-md border border-paper/40 flex items-center justify-center shadow-lg">
                        <Play className="w-7 h-7 text-paper fill-paper ml-1" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="px-3 py-1.5 min-h-[36px] rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs flex items-center gap-1.5 border border-white/20 shadow-md cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-green-300" />}
                      <span className="text-[10px] font-sans">{isMuted ? "MUTED" : "SOUND ON"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md cursor-pointer"
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />}
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

              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate((currentIndex - 1 + items.length) % items.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-paper/90 hover:bg-paper backdrop-blur-md text-ink flex items-center justify-center border border-gold/30 shadow-md cursor-pointer transition-transform hover:scale-105"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate((currentIndex + 1) % items.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-paper/90 hover:bg-paper backdrop-blur-md text-ink flex items-center justify-center border border-gold/30 shadow-md cursor-pointer transition-transform hover:scale-105"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Caption Footer */}
            <div className="relative z-10 w-full mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
              <div className="space-y-1 max-w-lg text-left">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider bg-strawberry/10 text-strawberry border border-gold/25">
                  {currentMedia.category}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-ink font-normal leading-tight">
                  {currentMedia.title}
                </h3>
                {displayCaption && (
                  <p className="font-hand text-xl text-mauve leading-snug">
                    &ldquo;{displayCaption}&rdquo;
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={spawnHearts}
                className="relative px-5 py-2.5 min-h-[42px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 border border-gold-light/35 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-paper animate-pulse" />
                <span>Send Pucchi 🤍</span>

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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
