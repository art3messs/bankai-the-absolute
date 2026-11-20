"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Camera, Filter } from "lucide-react";
import { BIRTHDAY_CONFIG, PhotoMemory } from "@/data/config";
import PhotoLightbox from "./PhotoLightbox";

const CATEGORIES = [
  { id: "all", label: "All Moments 🌸" },
  { id: "aesthetic", label: "Aesthetic & Fits ✨" },
  { id: "core", label: "Core Memories 💖" },
  { id: "silly", label: "Silly & Unfiltered 😂" },
] as const;

export default function PhotoGallery() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);

  // Filter memories
  const filteredPhotos =
    activeCategory === "all"
      ? BIRTHDAY_CONFIG.samplePhotos
      : BIRTHDAY_CONFIG.samplePhotos.filter(
          (p) => p.category === activeCategory
        );

  return (
    <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
      {/* Lightbox Modal */}
      <PhotoLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-xs font-semibold tracking-wider uppercase mb-3">
          <Camera className="w-3.5 h-3.5 text-pink-300" />
          <span>Curated Memory Lane</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
          Moments with Harleen 📸✨
        </h2>
        <p className="font-hand text-xl sm:text-2xl text-pink-200/90 mt-2 max-w-lg mx-auto">
          Every photo tells a story of your beauty, your laughter, and our favorite memories.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_20px_rgba(255,75,145,0.5)] scale-105"
                : "glass-panel text-pink-200 hover:bg-pink-500/20"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Draggable Polaroid Showcase (Interactive Scrapbook) */}
      <div className="mb-14">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-pink-300/80 uppercase tracking-widest">
            💡 Tip: Drag & shuffle the polaroids around!
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 p-4 min-h-[300px]">
          {BIRTHDAY_CONFIG.samplePhotos.slice(0, 4).map((photo, index) => {
            // Give each polaroid a playful tilted angle
            const rotations = [-4, 3, -2, 5];
            const rotation = rotations[index % rotations.length];

            return (
              <motion.div
                key={photo.id}
                drag
                dragConstraints={{ left: -50, right: 50, top: -40, bottom: 40 }}
                whileHover={{ scale: 1.08, zIndex: 30 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPhoto(photo)}
                className="cursor-grab active:cursor-grabbing select-none"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Vintage Polaroid Card */}
                <div className="w-56 sm:w-64 bg-[#fdf8f4] p-3 pb-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.35)] border border-pink-200/60 relative">
                  {/* Decorative Washi Tape */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-300/40 backdrop-blur-sm border-x border-pink-200/50 shadow-sm -rotate-2" />

                  {/* Photo Canvas */}
                  <div className="w-full aspect-square rounded-xl bg-pink-100/50 overflow-hidden relative border border-pink-200/40 shadow-inner flex items-center justify-center">
                    <img
                      src={photo.url}
                      alt={photo.caption || "Harleen Polaroid"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector(".polaroid-fallback") as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }
                      }}
                    />
                    <div className="polaroid-fallback hidden flex-col items-center justify-center p-4 text-center">
                      <Heart className="w-8 h-8 text-pink-400 fill-pink-300 animate-pulse mb-1" />
                      <span className="font-serif text-sm font-bold text-pink-900">
                        {photo.caption}
                      </span>
                    </div>
                  </div>

                  {/* Handwritten Caption */}
                  <div className="mt-3 px-1 text-center">
                    <p className="font-hand text-xl font-bold text-gray-800 leading-snug">
                      {photo.caption || "Harleen ✨"}
                    </p>
                    {photo.date && (
                      <span className="text-[11px] font-sans text-gray-500 font-medium">
                        {photo.date}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Masonry / Grid for Additional Curated Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedPhoto(photo)}
            className="glass-panel p-3 rounded-2xl cursor-pointer group shadow-lg border border-pink-300/25 overflow-hidden"
          >
            <div className="w-full aspect-[4/5] rounded-xl bg-pink-950/40 overflow-hidden relative shadow-inner flex items-center justify-center">
              <img
                src={photo.url}
                alt={photo.caption || "Memory"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector(".grid-fallback") as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }
                }}
              />
              <div className="grid-fallback hidden flex-col items-center justify-center p-4 text-center">
                <Sparkles className="w-8 h-8 text-pink-300 mb-2" />
                <span className="font-serif font-bold text-sm text-pink-100">
                  {photo.caption}
                </span>
                <span className="text-xs text-pink-300/70 mt-1 capitalize">
                  {photo.category}
                </span>
              </div>

              {/* Overlay hover tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="font-serif text-sm font-semibold text-white drop-shadow-md">
                  {photo.caption}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
