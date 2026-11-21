"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Film,
  Play,
  Sparkles,
  Heart,
  Crown,
  Camera,
  LayoutGrid,
  Columns,
  Gem,
  Baby,
  Smile,
  Maximize2,
} from "lucide-react";
import { MEDIA_CATALOG, MediaItem } from "@/data/mediaCatalog";
import PhotoLightbox from "./PhotoLightbox";

type ViewMode = "thematic" | "contact-sheet";

export default function ThemedGalleries() {
  const [viewMode, setViewMode] = useState<ViewMode>("thematic");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [activePlaylist, setActivePlaylist] = useState<MediaItem[]>(MEDIA_CATALOG);

  // Group media items by category
  const harleenItems = MEDIA_CATALOG.filter((m) => m.category === "harleen 4 life");
  const ethnicItems = MEDIA_CATALOG.filter((m) => m.category === "sick in ethnic");
  const pogoItems = MEDIA_CATALOG.filter((m) => m.category === "little pogo");
  const popaaaItems = MEDIA_CATALOG.filter((m) => m.category === "popaaa moments");
  const nailsItems = MEDIA_CATALOG.filter((m) => m.category === "aesthick nails");

  const openLightbox = (item: MediaItem, playlist: MediaItem[]) => {
    const idx = playlist.findIndex((m) => m.id === item.id);
    setActivePlaylist(playlist);
    setActiveItemIndex(idx >= 0 ? idx : 0);
    setSelectedItem(item);
  };

  const handleLightboxNavigate = (newIdx: number) => {
    setActiveItemIndex(newIdx);
    setSelectedItem(activePlaylist[newIdx]);
  };

  return (
    <div className="w-full">
      {/* Lightbox Modal */}
      <PhotoLightbox
        item={selectedItem}
        items={activePlaylist}
        currentIndex={activeItemIndex}
        onNavigate={handleLightboxNavigate}
        onClose={() => setSelectedItem(null)}
      />

      {/* Main Section Header */}
      <div className="text-center mb-10 max-w-3xl mx-auto px-4">
        <div className="girly-tag mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span>CURATED VISUAL CHRONICLES</span>
          <Heart className="w-3.5 h-3.5 text-[#ec4899] fill-[#ec4899]" />
        </div>

        <h2 className="font-forum text-3xl sm:text-5xl md:text-6xl text-[#831843] uppercase tracking-[0.06em] leading-tight">
          The Five Themed Chapters
        </h2>
        <p className="font-signature text-2xl sm:text-3xl text-[#9d174d] mt-3 leading-relaxed">
          &ldquo;35 hand-picked memories, grouped by every mood of you — from royal elegance to unfiltered giggles.&rdquo;
        </p>

        {/* View Mode Toggle Bar & Jump Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="inline-flex items-center p-1 rounded-full bg-white border-2 border-[#FFD9E3] shadow-xs">
            <button
              onClick={() => setViewMode("thematic")}
              className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-xs font-raleway font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "thematic"
                  ? "bg-[#B0295F] text-white shadow-xs"
                  : "text-[#3A1F2B]/70 hover:text-[#3A1F2B]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Themed Worlds</span>
            </button>
            <button
              onClick={() => setViewMode("contact-sheet")}
              className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-xs font-raleway font-bold uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === "contact-sheet"
                  ? "bg-[#B0295F] text-white shadow-xs"
                  : "text-[#3A1F2B]/70 hover:text-[#3A1F2B]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>35mm Full Roll</span>
            </button>
          </div>
        </div>

        {/* Quick Chapter Pill Jump Anchors */}
        {viewMode === "thematic" && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <a
              href="#sec-harleen"
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-raleway font-semibold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Crown className="w-3 h-3 text-rose-600" />
              <span>Harleen 4 Life ({harleenItems.length})</span>
            </a>
            <a
              href="#sec-ethnic"
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-raleway font-semibold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Gem className="w-3 h-3 text-emerald-700" />
              <span>Sick in Ethnic ({ethnicItems.length})</span>
            </a>
            <a
              href="#sec-pogo"
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 text-xs font-raleway font-semibold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Baby className="w-3 h-3 text-pink-600" />
              <span>Little Pogo ({pogoItems.length})</span>
            </a>
            <a
              href="#sec-popaaa"
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-raleway font-semibold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Smile className="w-3 h-3 text-amber-700" />
              <span>Popaaa Moments ({popaaaItems.length})</span>
            </a>
            <a
              href="#sec-nails"
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-raleway font-semibold flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Sparkles className="w-3 h-3 text-purple-600" />
              <span>Aesthick Nails ({nailsItems.length})</span>
            </a>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* THEMED WORLDS VIEW (DIVIDED INTO 5 GORGEOUS INDEPENDENT WORLDS) */}
      {/* ========================================================================= */}
      {viewMode === "thematic" && (
        <div className="space-y-24">
          {/* ------------------------------------------------------------------- */}
          {/* CHAPTER 1: HARLEEN 4 LIFE (ICONIC RED CARPET & MOTION REELS) */}
          {/* ------------------------------------------------------------------- */}
          <section
            id="sec-harleen"
            className="rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#1a0c14] via-[#2a1320] to-[#140a12] text-white border border-rose-500/30 shadow-[0_25px_60px_rgba(244,63,94,0.18)]"
          >
            {/* Ambient Lighting Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-rose-500/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-mono uppercase tracking-widest mb-3">
                  <Crown className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>CHAPTER 01 • THE CROWN JEWELS</span>
                </div>
                <h3 className="font-forum text-3xl sm:text-5xl text-rose-50 uppercase tracking-[0.05em]">
                  Harleen 4 Life
                </h3>
                <p className="font-signature text-2xl text-rose-200/80 mt-1">
                  &ldquo;High-fashion elegance, effortless beauty, and cinematic rock-on energy.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-rose-200/70">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15">
                  {harleenItems.length} ARCHIVE ITEMS
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300">
                  {harleenItems.filter((i) => i.type === "video").length} MOTION FILMS
                </span>
              </div>
            </div>

            {/* Harleen 4 Life Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {harleenItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.03, rotateX: 3, rotateY: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openLightbox(item, harleenItems)}
                  className="group relative cursor-pointer select-none rounded-2xl overflow-hidden bg-[#220d1a] border border-rose-500/25 hover:border-rose-400/60 shadow-lg hover:shadow-2xl flex flex-col perspective-1000 transform-3d"
                >
                  {/* Media Viewport */}
                  <div className="relative w-full aspect-[4/5] bg-black/60 overflow-hidden">
                    {item.type === "video" ? (
                      <div className="relative w-full h-full">
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <video
                            src={item.src}
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                        {/* Video Play Badge */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                          <div className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-500 transition-all">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 font-bold border border-amber-400/30">
                          MOTION CLIP
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-xs text-rose-200 flex items-center gap-1 font-raleway font-semibold">
                            <Maximize2 className="w-3.5 h-3.5" /> Tap to view full size
                          </span>
                        </div>
                      </>
                    )}

                    {/* Frame Number Tag */}
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/80 border border-white/10">
                      #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>

                  {/* Caption Card */}
                  <div className="p-4 bg-gradient-to-b from-[#24111d] to-[#180d15] flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-forum text-lg text-rose-100 group-hover:text-rose-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-raleway text-xs text-rose-200/70 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-rose-300/60 mt-3 pt-2 border-t border-rose-500/15">
                      <span className="uppercase tracking-wider">HARLEEN 4 LIFE</span>
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400 opacity-60 group-hover:opacity-100" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------------- */}
          {/* CHAPTER 2: SICK IN ETHNIC (ROYAL DESI COUTURE & GOLDEN SILK) */}
          {/* ------------------------------------------------------------------- */}
          <section
            id="sec-ethnic"
            className="rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#0a1a14] via-[#0e271e] to-[#141d13] text-white border border-amber-400/40 shadow-[0_25px_60px_rgba(212,175,55,0.15)]"
          >
            {/* Ambient Emerald & Gold Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-amber-400/25">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
                  <Gem className="w-3.5 h-3.5 text-[#fbbf24]" />
                  <span>CHAPTER 02 • ROYAL ETHNIC GRACE</span>
                </div>
                <h3 className="font-forum text-3xl sm:text-5xl text-amber-50 uppercase tracking-[0.05em]">
                  Sick in Ethnic
                </h3>
                <p className="font-signature text-2xl text-amber-200/80 mt-1">
                  &ldquo;Timeless royalty, dragonfly tiaras, jhumkas, and the magic of desi fits.&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-amber-200/70">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-amber-400/30 text-amber-300">
                  {ethnicItems.length} ROYAL ATTIRES
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200">
                  {ethnicItems.filter((i) => i.type === "video").length} MOTION TWIRLS
                </span>
              </div>
            </div>

            {/* Sick in Ethnic Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ethnicItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.03, rotateX: 3, rotateY: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openLightbox(item, ethnicItems)}
                  className="group relative cursor-pointer select-none rounded-2xl overflow-hidden bg-[#0c221a] border border-amber-400/30 hover:border-amber-400/80 shadow-lg hover:shadow-2xl flex flex-col perspective-1000 transform-3d"
                >
                  <div className="relative w-full aspect-[4/5] bg-black/60 overflow-hidden">
                    {item.type === "video" ? (
                      <div className="relative w-full h-full">
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <video
                            src={item.src}
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                          <div className="w-13 h-13 rounded-full bg-amber-500/90 text-[#1a140a] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-400 transition-all">
                            <Play className="w-6 h-6 fill-[#1a140a] ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 font-bold border border-amber-400/40">
                          ROYAL TWIRL
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-xs text-amber-200 flex items-center gap-1 font-raleway font-semibold">
                            <Maximize2 className="w-3.5 h-3.5" /> Tap to view full size
                          </span>
                        </div>
                      </>
                    )}

                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-amber-300/90 border border-amber-400/30">
                      ROYAL #{idx + 1}
                    </span>
                  </div>

                  <div className="p-4 bg-gradient-to-b from-[#0f281e] to-[#091811] flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-forum text-lg text-amber-100 group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="font-raleway text-xs text-amber-200/70 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-amber-300/70 mt-3 pt-2 border-t border-amber-400/20">
                      <span className="uppercase tracking-wider">DESI COUTURE</span>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------------- */}
          {/* CHAPTER 3: LITTLE POGO (BABY SCRAPBOOK & NOSTALGIA KEEPSAKE) */}
          {/* ------------------------------------------------------------------- */}
          <section
            id="sec-pogo"
            className="rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#fff0f3] via-[#fffbf5] to-[#fef2f2] text-[#241e16] border border-rose-300/40 shadow-[0_20px_50px_rgba(244,63,94,0.08)]"
          >
            {/* Scrapbook Tape / Pin Elements */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-rose-300/30">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs font-mono uppercase tracking-widest mb-3">
                  <Baby className="w-3.5 h-3.5 text-pink-600" />
                  <span>CHAPTER 03 • NOSTALGIA CAPSULE</span>
                </div>
                <h3 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.05em]">
                  Little Pogo Chronicles
                </h3>
                <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-1">
                  &ldquo;The cutest, sweetest little human in the entire galaxy since day one 🍼&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-pink-700">
                <span className="px-3.5 py-1 rounded-full bg-white border border-pink-300 shadow-xs">
                  👶 BABY ARCHIVE ROLL
                </span>
              </div>
            </div>

            {/* Scrapbook Polaroid Grid with playful angles */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
              {pogoItems.map((item, idx) => {
                const tilts = [-3, 2.5, -2];
                const tilt = tilts[idx % tilts.length];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ rotate: tilt }}
                    whileHover={{ y: -10, scale: 1.04, rotate: 0, rotateX: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => openLightbox(item, pogoItems)}
                    className="group relative cursor-pointer select-none bg-white p-4 pt-5 pb-6 rounded-2xl border border-pink-200 shadow-md hover:shadow-2xl transition-all perspective-1000 transform-3d"
                  >
                    {/* Realistic Washi Tape Graphic */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-200/80 backdrop-blur-xs border-y border-amber-300/60 rotate-1 shadow-xs pointer-events-none z-20" />

                    {/* Polaroid Photo Frame */}
                    <div className="relative w-full aspect-[4/5] bg-pink-50 rounded-lg overflow-hidden border border-pink-100">
                      <img
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono text-pink-700 font-bold shadow-xs">
                        POGO #{idx + 1}
                      </span>
                    </div>

                    {/* Handwritten Polaroid Notes */}
                    <div className="mt-4 text-center">
                      <h4 className="font-signature text-2xl text-[#c95874] leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-raleway text-xs text-[#7d7265] mt-1">
                        {item.caption}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ------------------------------------------------------------------- */}
          {/* CHAPTER 4: POPAAA MOMENTS (CHAOTIC JOY & LAUGHING VAULT) */}
          {/* ------------------------------------------------------------------- */}
          <section
            id="sec-popaaa"
            className="rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#fff7ed] via-[#fffbeb] to-[#ffe4e6] text-[#241e16] border border-amber-300/50 shadow-[0_20px_50px_rgba(245,158,11,0.1)]"
          >
            {/* Section Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-amber-300/40">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-mono uppercase tracking-widest mb-3">
                  <Smile className="w-3.5 h-3.5 text-amber-600" />
                  <span>CHAPTER 04 • UNFILTERED CHAOS</span>
                </div>
                <h3 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.05em]">
                  Popaaa Moments
                </h3>
                <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-1">
                  &ldquo;Squishy cheeks, goofball faces, pillow-talk giggles &amp; pure happiness 😂&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-amber-800">
                <span className="px-3.5 py-1 rounded-full bg-white border border-amber-300 shadow-xs">
                  12 PURE JOY CLIPS &amp; STILLS
                </span>
              </div>
            </div>

            {/* Sticker-bomb Popaaa Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popaaaItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.04, rotate: (idx % 2 === 0 ? 2 : -2), rotateX: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openLightbox(item, popaaaItems)}
                  className="group relative cursor-pointer select-none bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between perspective-1000 transform-3d"
                >
                  <div className="relative w-full aspect-square bg-amber-50 rounded-xl overflow-hidden border border-amber-100">
                    {item.type === "video" ? (
                      <div className="relative w-full h-full">
                        {item.poster ? (
                          <img
                            src={item.poster}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <video
                            src={item.src}
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-mono font-bold shadow-xs">
                          GIGGLE VIDEO
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-amber-800 text-[9px] font-mono font-bold shadow-xs">
                          POPAAA #{idx + 1}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-forum text-base text-[#241e16] group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-raleway text-xs text-[#7d7265] mt-1 line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------------- */}
          {/* CHAPTER 5: AESTHICK NAILS (HAUTE NAIL ATELIER & DETAILS) */}
          {/* ------------------------------------------------------------------- */}
          <section
            id="sec-nails"
            className="rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden bg-gradient-to-br from-[#f8f5ff] via-[#fbf7fe] to-[#f4f7ff] text-[#241e16] border border-purple-200/60 shadow-[0_20px_50px_rgba(168,85,247,0.08)]"
          >
            {/* Section Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 mb-8 border-b border-purple-200/50">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-700 text-xs font-mono uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>CHAPTER 05 • BEAUTY ATELIER</span>
                </div>
                <h3 className="font-forum text-3xl sm:text-5xl text-[#241e16] uppercase tracking-[0.05em]">
                  Aesthick Nails
                </h3>
                <p className="font-signature text-2xl sm:text-3xl text-[#7d7265] mt-1">
                  &ldquo;Chunky gold rings, chrome French tips, almond perfection &amp; high glam ✨&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-purple-700">
                <span className="px-3.5 py-1 rounded-full bg-white border border-purple-300 shadow-xs">
                  💅 1000/10 NAIL ART RATING
                </span>
              </div>
            </div>

            {/* Aesthick Nails Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {nailsItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, scale: 1.03, rotateX: 3, rotateY: -1.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => openLightbox(item, nailsItems)}
                  className="group relative cursor-pointer select-none bg-white p-4 rounded-2xl border border-purple-200/80 shadow-md hover:shadow-2xl transition-all perspective-1000 transform-3d"
                >
                  <div className="relative w-full aspect-[4/5] bg-purple-50 rounded-xl overflow-hidden border border-purple-100">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono text-purple-700 font-bold shadow-xs">
                      SET #{idx + 1}
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h4 className="font-forum text-lg text-[#241e16] group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </h4>
                    <p className="font-raleway text-xs text-[#7d7265] mt-1">
                      {item.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 35MM FULL CONTACT SHEET ROLL (ALTERNATIVE COMPACT VIEW) */}
      {/* ========================================================================= */}
      {viewMode === "contact-sheet" && (
        <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-white border border-[#d97d93]/30 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono text-[#7d7265] mb-6 border-b border-[#d97d93]/20 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-[#d97d93]" />
              <span className="font-semibold tracking-wider">KODAK PORTRA 400 • MASTER ARCHIVE</span>
            </div>
            <span className="text-[#d4af37] font-bold tracking-widest hidden sm:inline">HARLEEN 4 LIFE</span>
            <span>EXP 35 • ISO 400</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MEDIA_CATALOG.map((item, idx) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.03, rotateX: 2, rotateY: -2 }}
                onClick={() => openLightbox(item, MEDIA_CATALOG)}
                className="group cursor-pointer select-none bg-[#fdfaf5] p-3 rounded-2xl border border-[#d97d93]/20 hover:border-[#d97d93]/60 shadow-xs hover:shadow-lg transition-all perspective-1000 transform-3d"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black/10">
                  {item.type === "video" ? (
                    <div className="relative w-full h-full">
                      <img
                        src={item.poster || item.src}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-6 h-6 fill-white text-white" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[9px] font-mono">
                    #{idx + 1}
                  </span>
                </div>
                <div className="mt-2.5">
                  <h5 className="font-forum text-sm text-[#241e16] truncate">{item.title}</h5>
                  <span className="text-[10px] font-mono text-[#c95874] uppercase tracking-wider block">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
