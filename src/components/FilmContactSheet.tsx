"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Film, Heart } from "lucide-react";
import { BIRTHDAY_CONFIG, PhotoMemory } from "@/data/config";
import PhotoLightbox from "./PhotoLightbox";

const ARCHIVE_CATEGORIES = [
  { id: "all", label: "All Frames 🌸" },
  { id: "aesthetic", label: "Editorial & Fits ✨" },
  { id: "core", label: "Core Moments 💖" },
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
    <div className="w-full">
      <PhotoLightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {/* Editorial Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h2 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.06em]">
          The 35mm Archives
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-2 leading-relaxed">
          &ldquo;Every frame captures your beauty, your laughter, and the quiet moments I cherish most.&rdquo;
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {ARCHIVE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2 rounded-full text-xs font-raleway font-bold uppercase tracking-[0.15em] transition-all shadow-xs ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-[#d97d93] to-[#c95874] text-white shadow-md scale-105"
                : "bg-white text-[#7d7265] hover:text-[#241e16] border border-[#d97d93]/30"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 35MM CONTACT SHEET */}
      <div className="p-6 sm:p-10 rounded-3xl editorial-card border border-[#d97d93]/30 shadow-xs relative">
        <div className="flex justify-between items-center text-xs font-mono text-[#7d7265] mb-6 border-b border-[#d97d93]/20 pb-3">
          <span>KODAK PORTRA 400 • 35MM EXP 16</span>
          <span className="text-[#d4af37] font-bold">HARLEEN 4 LIFE</span>
          <span>ISO 400 • FEB 16</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((photo, idx) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedPhoto(photo)}
              className="group cursor-pointer select-none bg-white p-3.5 rounded-2xl border border-[#d97d93]/25 shadow-xs hover:shadow-lg transition-all"
            >
              {/* Frame Metadata */}
              <div className="flex justify-between items-center text-[10px] text-[#7d7265] font-mono mb-2 px-1">
                <span>FRAME #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                <span className="text-[#c95874] font-semibold">16 FEB</span>
              </div>

              {/* Photo Box */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#fdfaf5] border border-[#d97d93]/20 flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.caption || "Harleen"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#241e16]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="font-forum text-sm font-normal text-white drop-shadow-sm">
                    {photo.caption}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <div className="mt-3 px-1">
                <p className="font-forum text-base text-[#241e16] font-normal leading-snug">
                  {photo.caption}
                </p>
                {photo.date && (
                  <span className="text-[11px] text-[#7d7265] font-raleway tracking-wider uppercase block mt-0.5">
                    {photo.date}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
