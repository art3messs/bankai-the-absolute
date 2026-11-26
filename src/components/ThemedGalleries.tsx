"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { MEDIA_CATALOG, MediaItem } from "@/data/mediaCatalog";
import { CAPTIONS } from "@/data/captions";
import { COPY } from "@/data/copy";
import PhotoLightbox from "./PhotoLightbox";

export default function ThemedGalleries() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<MediaItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  const categories = [
    {
      key: "harleen 4 life" as const,
      title: COPY.galleries.categories.harleen.title,
      quote: COPY.galleries.categories.harleen.quote,
      items: MEDIA_CATALOG.filter((m) => m.category === "harleen 4 life"),
    },
    {
      key: "sick in ethnic" as const,
      title: COPY.galleries.categories.ethnic.title,
      quote: COPY.galleries.categories.ethnic.quote,
      items: MEDIA_CATALOG.filter((m) => m.category === "sick in ethnic"),
    },
    {
      key: "little pogo" as const,
      title: COPY.galleries.categories.pogo.title,
      quote: COPY.galleries.categories.pogo.quote,
      items: MEDIA_CATALOG.filter((m) => m.category === "little pogo"),
    },
    {
      key: "popaaa moments" as const,
      title: COPY.galleries.categories.popaaa.title,
      quote: COPY.galleries.categories.popaaa.quote,
      items: MEDIA_CATALOG.filter((m) => m.category === "popaaa moments"),
    },
    {
      key: "aesthick nails" as const,
      title: COPY.galleries.categories.nails.title,
      quote: COPY.galleries.categories.nails.quote,
      items: MEDIA_CATALOG.filter((m) => m.category === "aesthick nails"),
    },
  ];

  const filterTabs = [
    { key: "all", label: "All Moments", count: MEDIA_CATALOG.length },
    ...categories.map((c) => ({
      key: c.key,
      label: c.title,
      count: c.items.length,
    })),
  ];

  const displayedCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c.key === selectedCategory);

  return (
    <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-7 sm:py-12 flex flex-col items-center">
      <PhotoLightbox
        item={selectedItem}
        items={activePlaylist}
        currentIndex={activeItemIndex}
        onNavigate={handleLightboxNavigate}
        onClose={() => setSelectedItem(null)}
      />

      <div className="text-center mb-5 sm:mb-7 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
          {COPY.galleries.heading}
        </h2>
        <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
          &ldquo;{COPY.galleries.subtitle}&rdquo;
        </p>
      </div>

      {/* Category Filter Pills with Spring Active Pill */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-9 max-w-3xl">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`relative px-4 py-2 min-h-[38px] rounded-full text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? "text-paper font-semibold border-gold-light/40 shadow-sm"
                  : "bg-paper/95 text-ink/80 border-gold/30 hover:border-strawberry/45"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="galleryActivePill"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] -z-10"
                />
              )}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-paper/20 text-paper" : "bg-mauve/12 text-mauve"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}

        {selectedCategory !== "all" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="px-3.5 py-2 min-h-[38px] rounded-full text-xs font-sans text-strawberry bg-paper/95 border border-strawberry/35 hover:bg-strawberry/5 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Grid: 2-col Phone / 3-col Tablet / 4-col Desktop */}
      <div className="w-full space-y-7 sm:space-y-12">
        {displayedCategories.map((cat) => (
          <div key={cat.key} className="w-full">
            <div className="mb-3 sm:mb-4 text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1 border-b border-gold/25 pb-2">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                  {cat.title}
                </h3>
                <p className="font-hand text-xl sm:text-2xl text-ink/80 mt-0.5">
                  &ldquo;{cat.quote}&rdquo;
                </p>
              </div>
              <span className="text-[11px] font-sans text-mauve uppercase tracking-widest">
                {cat.items.length} Keepsakes
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
              {cat.items.map((item, idx) => {
                const captionData = CAPTIONS[item.id];
                const aspectClass =
                  item.aspectRatio === "landscape"
                    ? "aspect-[4/3]"
                    : item.aspectRatio === "square"
                    ? "aspect-square"
                    : "aspect-[3/4]";

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => openLightbox(item, cat.items)}
                    className={`group paper-card p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:shadow-[0_22px_45px_rgba(212,40,90,0.14)] hover:-translate-y-1 cursor-pointer flex flex-col justify-start text-left ${
                      idx % 2 === 0 ? "lg:-rotate-[0.6deg] lg:hover:rotate-0" : "lg:rotate-[0.6deg] lg:hover:rotate-0"
                    }`}
                  >
                    <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden bg-mauve/10 border border-gold/20`}>
                      <Image
                        src={item.poster || item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {item.type === "video" && (
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-paper/92 backdrop-blur-md border border-gold/40 text-strawberry shadow-sm flex items-center gap-1">
                          <Play className="w-3 h-3 fill-strawberry" />
                          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">
                            Play
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 sm:mt-2.5 px-1 text-center w-full">
                      <p className="font-hand text-base sm:text-xl text-mauve leading-tight sm:leading-snug line-clamp-2 group-hover:text-ink transition-colors">
                        {captionData?.line && !captionData.line.startsWith("TODO:")
                          ? captionData.line
                          : item.caption}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
