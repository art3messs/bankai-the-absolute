"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Film, Sparkles, Heart } from "lucide-react";
import { BIRTHDAY_CONFIG, PhotoMemory } from "@/data/config";
import PhotoLightbox from "./PhotoLightbox";

const ARCHIVE_CATEGORIES = [
  { id: "all", label: "All Frames 🎞️" },
  { id: "aesthetic", label: "Editorial & Fits ✨" },
  { id: "core", label: "Late Night Talks 🌙" },
  { id: "silly", label: "Unfiltered Laughs 😂" },
] as const;

export default function FilmContactSheet() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMemory | null>(null);

  const filtered =
    activeCategory === "all"
      ? BIRTHDAY_CONFIG.samplePhotos
      : BIRTHDAY_CONFIG.samplePhotos.filter((p) => p.category === activeCategory);

  return (
    <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      {/* Lightbox Modal */}
      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200 text-xs font-serif tracking-wider uppercase mb-3">
          <Film className="w-3.5 h-3.5 text-amber-300" />
          <span>35mm Archival Contact Sheet</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent drop-shadow-md">
          Captured Moments with Harleen
        </h2>
        <p className="font-hand text-xl sm:text-2xl text-rose-200/80 mt-2 max-w-lg mx-auto italic">
          Like scenes from a slow, beautiful film you never want to finish watching...
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {ARCHIVE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-amber-300 to-amber-200 text-black font-extrabold shadow-[0_0_20px_rgba(253,224,71,0.4)] scale-105"
                : "bg-white/5 hover:bg-white/10 text-rose-200 border border-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 35MM FILM STRIP CONTAINER */}
      <div className="p-4 sm:p-8 rounded-3xl bg-[#0b080e] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Sprocket Holes Bar Top */}
        <div className="flex justify-between items-center gap-2 overflow-hidden mb-4 opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm bg-neutral-800 border border-neutral-700 shrink-0" />
          ))}
        </div>

        {/* Film Frames Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-2">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer select-none bg-[#130f18] p-3 rounded-2xl border border-rose-300/20 shadow-xl relative overflow-hidden"
            >
              {/* Frame Label Metadata */}
              <div className="flex justify-between items-center text-[10px] text-amber-300/80 font-mono mb-2 px-1">
                <span>KODAK • PORTRA 400</span>
                <span>EXP #{idx + 1}</span>
              </div>

              {/* Photo Area */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.caption || "Harleen Memory"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector(".film-fallback") as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }
                  }}
                />

                <div className="film-fallback hidden flex-col items-center justify-center p-6 text-center">
                  <Heart className="w-8 h-8 text-rose-300 fill-rose-400/30 mb-2 animate-pulse" />
                  <p className="font-serif text-sm font-bold text-white">
                    {photo.caption}
                  </p>
                  <span className="text-[10px] text-amber-200/80 mt-1 uppercase tracking-wider font-mono">
                    Frame Ready for Photo
                  </span>
                </div>

                {/* Darkroom Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="font-serif text-sm font-medium text-white drop-shadow">
                    {photo.caption}
                  </p>
                </div>
              </div>

              {/* Caption Underneath */}
              <div className="mt-3 px-1">
                <p className="font-hand text-lg text-rose-100 font-bold">
                  {photo.caption}
                </p>
                {photo.date && (
                  <span className="text-[10px] text-white/50 font-mono">
                    {photo.date}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sprocket Holes Bar Bottom */}
        <div className="flex justify-between items-center gap-2 overflow-hidden mt-6 opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-4 h-6 rounded-sm bg-neutral-800 border border-neutral-700 shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
