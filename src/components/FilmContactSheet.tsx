"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Film, Sparkles, Heart } from "lucide-react";
import { BIRTHDAY_CONFIG, PhotoMemory } from "@/data/config";
import PhotoLightbox from "./PhotoLightbox";

const ARCHIVE_CATEGORIES = [
  { id: "all", label: "All Moments 🌸" },
  { id: "aesthetic", label: "Editorial & Fits ✨" },
  { id: "core", label: "Core Memories 💖" },
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
      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Film className="w-3.5 h-3.5 text-amber-500" />
          <span>Curated Archival Gallery</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-black text-[#2e1322] drop-shadow-xs">
          Captured Moments with Harleen 📸✨
        </h2>
        <p className="font-hand text-2xl text-rose-600/90 mt-2 max-w-lg mx-auto">
          Every picture tells a story of your beauty, your laughter, and our favorite memories.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {ARCHIVE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold shadow-[0_4px_18px_rgba(255,105,180,0.4)] scale-105"
                : "glass-pearl text-rose-900 hover:bg-pink-100/60"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* CONTACT SHEET CARDS */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white shadow-xl border border-pink-100 relative">
        <div className="flex justify-between items-center text-xs font-mono text-gray-400 mb-6 border-b border-pink-100 pb-3">
          <span>ARCHIVAL ROLL • 35MM EXP 16</span>
          <span className="text-amber-500 font-bold">HARLEEN CELEBRATION</span>
          <span>ISO 400</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer select-none bg-[#fffafc] p-3 rounded-2xl border border-pink-200/80 shadow-md hover:shadow-xl transition-all"
            >
              {/* Metadata */}
              <div className="flex justify-between items-center text-[10px] text-amber-700 font-mono mb-2 px-1">
                <span>FRAME #{idx + 1}</span>
                <span>FEBRUARY 16</span>
              </div>

              {/* Photo Box */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-pink-50 border border-pink-100 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.caption || "Harleen"}
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
                  <Heart className="w-8 h-8 text-rose-400 fill-rose-200 mb-2 animate-pulse" />
                  <p className="font-serif text-sm font-bold text-gray-800">
                    {photo.caption}
                  </p>
                  <span className="text-[10px] text-rose-500 mt-1 uppercase font-mono font-bold">
                    Frame Ready for Photo
                  </span>
                </div>

                {/* Hover Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="font-serif text-sm font-semibold text-white drop-shadow">
                    {photo.caption}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3 px-1">
                <p className="font-hand text-xl text-gray-800 font-bold leading-tight">
                  {photo.caption}
                </p>
                {photo.date && (
                  <span className="text-[11px] text-gray-400 font-sans">
                    {photo.date}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
