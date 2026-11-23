"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { MEDIA_CATALOG, MediaItem } from "@/data/mediaCatalog";
import { CAPTIONS } from "@/data/captions";
import { COPY } from "@/data/copy";
import PhotoLightbox from "./PhotoLightbox";

export default function ThemedGalleries() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<MediaItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

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

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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
    <section id="memories" className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
      <PhotoLightbox
        item={selectedItem}
        items={activePlaylist}
        currentIndex={activeItemIndex}
        onNavigate={handleLightboxNavigate}
        onClose={() => setSelectedItem(null)}
      />

      {/* Main Section Heading in sentence case */}
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
          {COPY.galleries.heading}
        </h2>
        <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
          &ldquo;{COPY.galleries.subtitle}&rdquo;
        </p>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-3xl">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-strawberry text-paper font-semibold shadow-xs"
                  : "bg-paper text-ink/80 border border-mauve/20 hover:border-mauve/50 hover:bg-mauve/5"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-paper/25 text-paper" : "bg-mauve/15 text-mauve"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categories (clean 2-col on phones, 3-col tablet, 4-col desktop) */}
      <div className="w-full space-y-12">
        {displayedCategories.map((cat) => (
          <div key={cat.key} className="w-full">
            {/* Clean category title */}
            <div className="mb-4 text-left">
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                {cat.title}
              </h3>
              <p className="font-hand text-xl text-ink/75 mt-0.5">
                &ldquo;{cat.quote}&rdquo;
              </p>
            </div>

            {/* 2-column mobile, 3-column tablet, 4-column desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {cat.items.map((item) => {
                const captionData = CAPTIONS[item.id];
                const aspectClass =
                  item.aspectRatio === "landscape"
                    ? "aspect-[4/3]"
                    : item.aspectRatio === "square"
                    ? "aspect-square"
                    : "aspect-[3/4]";

                return (
                  <div
                    key={item.id}
                    onClick={() => openLightbox(item, cat.items)}
                    className="group bg-paper p-2.5 sm:p-3 rounded-2xl border border-mauve/20 shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
                  >
                    <div className={`relative w-full ${aspectClass} rounded-xl overflow-hidden bg-mauve/10`}>
                      <Image
                        src={item.poster || item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                      {item.type === "video" && (
                        <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-paper/90 text-strawberry shadow-xs">
                          <Play className="w-3.5 h-3.5 fill-strawberry" />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-center">
                      <p className="font-hand text-base sm:text-lg text-mauve leading-snug line-clamp-2">
                        {captionData?.line && !captionData.line.startsWith("TODO:")
                          ? captionData.line
                          : item.caption}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
