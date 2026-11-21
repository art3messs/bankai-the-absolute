"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Play, Sparkles, Heart, Video, Camera, Award } from "lucide-react";
import { MEDIA_CATALOG, MediaItem } from "@/data/mediaCatalog";
import PhotoLightbox from "./PhotoLightbox";

type CategoryFilter = "all" | "harleen 4 life" | "popaaa moments" | "sick in ethnic" | "little pogo" | "aesthick nails" | "videos";

interface FilterOption {
  id: CategoryFilter;
  label: string;
  badge: string;
  count: number;
}

export default function FilmContactSheet() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Compute counts
  const filters: FilterOption[] = [
    { id: "all", label: "All Archives", badge: "✨", count: MEDIA_CATALOG.length },
    { id: "harleen 4 life", label: "Harleen 4 Life", badge: "👑", count: MEDIA_CATALOG.filter((m) => m.category === "harleen 4 life").length },
    { id: "popaaa moments", label: "Popaaa Moments", badge: "😂", count: MEDIA_CATALOG.filter((m) => m.category === "popaaa moments").length },
    { id: "sick in ethnic", label: "Sick in Ethnic", badge: "💃", count: MEDIA_CATALOG.filter((m) => m.category === "sick in ethnic").length },
    { id: "little pogo", label: "Little Pogo", badge: "🎈", count: MEDIA_CATALOG.filter((m) => m.category === "little pogo").length },
    { id: "aesthick nails", label: "Aesthick Nails", badge: "💅", count: MEDIA_CATALOG.filter((m) => m.category === "aesthick nails").length },
    { id: "videos", label: "Motion Clips", badge: "🎬", count: MEDIA_CATALOG.filter((m) => m.type === "video").length },
  ];

  const filteredItems: MediaItem[] = MEDIA_CATALOG.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "videos") return item.type === "video";
    return item.category === activeFilter;
  });

  const selectedItem: MediaItem | null =
    selectedIndex !== null && filteredItems[selectedIndex]
      ? filteredItems[selectedIndex]
      : null;

  return (
    <div className="w-full">
      {/* Interactive Modal Lightbox */}
      <PhotoLightbox
        item={selectedItem}
        items={filteredItems}
        currentIndex={selectedIndex ?? 0}
        onNavigate={(idx) => setSelectedIndex(idx)}
        onClose={() => setSelectedIndex(null)}
      />

      {/* Editorial Header */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
          The 35mm Archives
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-2 leading-relaxed">
          &ldquo;Every photo and film captures your laughter, your beauty, and the pure joy of you.&rdquo;
        </p>

        {/* Stats Pill Bar */}
        <div className="inline-flex items-center gap-3 mt-4 px-4 py-1.5 rounded-full bg-white/80 border border-[#d97d93]/25 shadow-xs text-xs font-mono text-[#7d7265]">
          <span className="text-[#c95874] font-semibold">35 ASSETS</span>
          <span>•</span>
          <span>25 STILLS</span>
          <span>•</span>
          <span className="text-[#d4af37] font-semibold">10 CINEMATIC FILMS</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
        {filters.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setSelectedIndex(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-raleway font-bold uppercase tracking-[0.14em] transition-all shadow-xs cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] text-white shadow-md scale-105"
                  : "bg-white text-[#7d7265] hover:text-[#241e16] hover:bg-[#fff9f6] border border-[#d97d93]/30"
              }`}
            >
              <span>{tab.badge}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? "bg-white/25 text-white" : "bg-[#fdfaf5] text-[#7d7265]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 35MM CONTACT SHEET / VINTAGE PHOTO REEL CONTAINER */}
      <div className="p-5 sm:p-8 md:p-10 rounded-3xl editorial-card border border-[#d97d93]/30 shadow-xs relative">
        {/* Film Top Perforations and Header Bar */}
        <div className="flex justify-between items-center text-xs font-mono text-[#7d7265] mb-6 border-b border-[#d97d93]/20 pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-3.5 h-3.5 text-[#d97d93]" />
            <span className="font-semibold tracking-wider">KODAK PORTRA 400 • ARCHIVE ROLL</span>
          </div>
          <span className="text-[#d4af37] font-bold tracking-widest hidden sm:inline">HARLEEN 4 LIFE</span>
          <span>EXP 35 • ISO 400</span>
        </div>

        {/* Responsive Grid with Staggered Framer-Motion Scroll Reveal */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              // Subtle vintage rotation angle
              const rotateDeg = ((idx % 5) - 2) * 0.8;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.88, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                    delay: (idx % 6) * 0.05,
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedIndex(idx)}
                  className="group cursor-pointer select-none bg-white p-3.5 rounded-2xl border border-[#d97d93]/25 shadow-xs hover:shadow-xl transition-all duration-300 relative flex flex-col"
                  style={{ transform: `rotate(${rotateDeg}deg)` }}
                >
                  {/* Frame Metadata Bar */}
                  <div className="flex justify-between items-center text-[10px] text-[#7d7265] font-mono mb-2 px-1">
                    <span className="font-semibold">
                      FRAME #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="text-[#c95874] font-semibold tracking-wider capitalize">
                      {item.category}
                    </span>
                  </div>

                  {/* Media Visual Frame */}
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#1f1a16] border border-[#d97d93]/20 flex items-center justify-center">
                    {item.type === "video" ? (
                      <>
                        <img
                          src={item.poster || item.src}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Video Play Badge Indicator */}
                        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/30 text-white text-[10px] font-mono flex items-center gap-1 shadow-sm">
                          <Play className="w-2.5 h-2.5 fill-white text-white" />
                          <span>MOTION</span>
                        </div>

                        {/* Center Hover Play Button */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-[#241e16] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 fill-[#241e16] text-[#241e16] ml-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {/* Gradient Overlay for Caption Preview */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241e16]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="font-signature text-lg text-white drop-shadow-sm leading-snug">
                        {item.caption}
                      </p>
                    </div>
                  </div>

                  {/* Card Title & Description */}
                  <div className="mt-3 px-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-forum text-base sm:text-lg text-[#241e16] font-normal leading-snug line-clamp-1 group-hover:text-[#c95874] transition-colors">
                        {item.title}
                      </h3>
                      <p className="font-signature text-base text-[#7d7265] mt-0.5 line-clamp-1">
                        {item.caption}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#d97d93]/15 text-[10px] font-raleway text-[#7d7265] uppercase tracking-wider">
                      <span>{item.type === "video" ? "Tap to Play" : "View Photo"}</span>
                      <Heart className="w-3 h-3 text-[#d97d93] group-hover:text-[#c95874] group-hover:fill-[#c95874] transition-all" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Film Bottom Footer */}
        <div className="mt-10 pt-4 border-t border-[#d97d93]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#7d7265]">
          <div className="flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ORIGINAL ARCHIVE COLLECTION • 35 ITEMS</span>
          </div>
          <span className="text-[#c95874] font-signature text-lg">
            &ldquo;You are my whole universe, Harleen&rdquo;
          </span>
          <span>16 FEBRUARY 2026</span>
        </div>
      </div>
    </div>
  );
}
