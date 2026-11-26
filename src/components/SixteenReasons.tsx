"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Crown, Sun, Moon, Music, Star, Flower2, Shuffle } from "lucide-react";
import { COPY } from "@/data/copy";

const CARD_MOTIFS = [Sparkles, Flower2, Sun, Heart, Crown, Moon, Star, Music];

export default function SixteenReasons() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [cardOrder, setCardOrder] = useState<number[]>(() =>
    COPY.reasons.items.map((item) => item.id)
  );

  const reasonsList = COPY.reasons.items;
  const count = reasonsList.length;
  const headingText = `${count} reasons why you are my world`;
  const allRevealed = flippedCards.length === count;
  const unveilText = allRevealed ? `Turn all ${count} cards back` : `Unveil all ${count} cards`;

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("harleen_favorite_reasons");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setTimeout(() => setFavorites(parsed), 0);
          }
        }
      }
    } catch {}
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("harleen_favorite_reasons", JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  };

  const toggleCard = (num: number) => {
    setFlippedCards((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const revealAll = () => {
    if (allRevealed) {
      setFlippedCards([]);
    } else {
      setFlippedCards(reasonsList.map((i) => i.id));
    }
  };

  const shuffleDeck = () => {
    setCardOrder((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  const orderedItems = cardOrder
    .map((id) => reasonsList.find((item) => item.id === id))
    .filter((item): item is (typeof reasonsList)[number] => Boolean(item));

  const visibleItems = filterFavorites
    ? orderedItems.filter((item) => favorites.includes(item.id))
    : orderedItems;

  return (
    <section id="reasons" className="relative z-10 max-w-5xl mx-auto px-4 py-7 sm:py-12 flex flex-col items-center text-center">
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {headingText}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.reasons.subtitle}&rdquo;
      </p>

      {/* Action & Filter Bar */}
      <div className="mt-4 sm:mt-5 mb-5 sm:mb-7 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={revealAll}
          className="px-5 py-2.5 min-h-[40px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/30 hover:brightness-110 text-xs font-sans font-semibold transition-all cursor-pointer shadow-sm"
        >
          {unveilText}
        </button>

        <button
          type="button"
          onClick={shuffleDeck}
          className="px-4 py-2.5 min-h-[40px] rounded-full bg-paper text-ink border border-gold/30 hover:border-strawberry/50 text-xs font-sans font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          title="Shuffle the cards"
        >
          <Shuffle className="w-3.5 h-3.5 text-strawberry" />
          <span>Shuffle</span>
        </button>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => setFilterFavorites((f) => !f)}
            className={`px-4 py-2.5 min-h-[40px] rounded-full text-xs font-sans font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              filterFavorites
                ? "bg-plum text-gold-light border-gold/50 shadow-sm"
                : "bg-paper text-ink border-gold/30 hover:border-strawberry/50"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorites ? "fill-gold-light text-gold-light" : "fill-strawberry text-strawberry"}`} />
            <span>{filterFavorites ? `Showing Favorites (${favorites.length})` : `Favorites (${favorites.length})`}</span>
          </button>
        )}

        <span className="text-xs font-sans text-mauve px-2">
          {allRevealed ? `✦ All ${count} reasons revealed 🤍` : `${flippedCards.length} of ${count} revealed`}
        </span>
      </div>

      {/* 2-col Mobile / 4-col Desktop Keepsake Deck */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {visibleItems.map((item, idx) => {
          const isFlipped = flippedCards.includes(item.id);
          const isFavorited = favorites.includes(item.id);
          const MotifIcon = CARD_MOTIFS[idx % CARD_MOTIFS.length];

          return (
            <motion.div
              key={item.id}
              layout
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              whileHover={{ y: -3 }}
              className="group relative h-44 sm:h-64 w-full text-left perspective-1000 select-none"
            >
              <motion.div
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                onClick={() => toggleCard(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(item.id);
                  }
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full relative transform-3d cursor-pointer outline-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-strawberry"
              >
                {/* FRONT FACE: Cream Parchment & Gold Filigree */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFFDFD] via-[#FFF6F8] to-[#FCEAF0] p-3.5 sm:p-5 flex flex-col justify-between border border-gold/35 shadow-[0_12px_30px_rgba(43,21,36,0.07)] backface-hidden overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Delicate Inner Double Frame */}
                  <div className="pointer-events-none absolute inset-1.5 sm:inset-2 rounded-xl border border-gold/20" />
                  {/* Foil Shimmer Sweep on Hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-gold-light/30 to-transparent -skew-x-12"
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-serif text-xs sm:text-base font-bold text-foil">
                      N° {item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isFavorited && <Heart className="w-3.5 h-3.5 text-strawberry fill-strawberry" />}
                      <MotifIcon className="w-3.5 h-3.5 text-gold/80" />
                    </div>
                  </div>

                  <h3 className="relative z-10 font-serif text-sm sm:text-lg text-ink font-normal leading-snug">
                    {item.title}
                  </h3>

                  <span className="relative z-10 text-[10px] sm:text-[11px] font-sans text-mauve tracking-wide flex items-center gap-1">
                    <span className="text-gold">✦</span>
                    <span>{COPY.reasons.flipPrompt}</span>
                  </span>
                </div>

                {/* BACK FACE: Deep Velvet Plum & Gold Prose */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3A0E34] via-[#2B0A28] to-[#1D051B] p-3.5 sm:p-5 flex flex-col justify-between border border-gold/55 shadow-[0_18px_40px_rgba(43,21,36,0.28)] backface-hidden overflow-hidden text-paper"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-2 rounded-xl border border-gold-light/20" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-sans text-gold-light font-semibold uppercase tracking-widest">
                      {item.id < 10 ? `0${item.id}` : item.id} • Truth
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, item.id)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-paper/80 transition-colors cursor-pointer"
                      title={isFavorited ? "Remove from favorites" : "Favorite this reason"}
                      aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFavorited
                            ? "text-box-pink fill-box-pink"
                            : "text-gold-light/70 hover:text-box-pink"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="relative z-10 font-sans text-xs sm:text-sm text-paper/95 leading-relaxed my-auto">
                    {item.body}
                  </p>

                  <span className="relative z-10 text-[10px] font-sans text-gold-light/70 text-right">
                    {COPY.reasons.unflipPrompt}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
