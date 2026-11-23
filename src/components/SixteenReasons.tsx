"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { COPY } from "@/data/copy";

export default function SixteenReasons() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const reasonsList = COPY.reasons.items;
  const count = reasonsList.length;
  const headingText = `${count} reasons why you are my world`;
  const unveilText = `Unveil all ${count} cards`;

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
    if (flippedCards.length === reasonsList.length) {
      setFlippedCards([]);
    } else {
      setFlippedCards(reasonsList.map((i) => i.id));
    }
  };

  return (
    <section id="reasons" className="relative z-10 max-w-5xl mx-auto px-4 py-10 flex flex-col items-center text-center">
      {/* Header in sentence case, dynamic count */}
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {headingText}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.reasons.subtitle}&rdquo;
      </p>

      <div className="mt-4 mb-6 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={revealAll}
          className="px-5 py-2.5 rounded-full bg-strawberry text-paper hover:opacity-95 text-xs font-sans font-semibold transition-opacity cursor-pointer shadow-sm"
        >
          {unveilText}
        </button>

        <span className="text-xs font-sans text-mauve">
          {flippedCards.length === count ? "✦ All 16 reasons revealed 🤍" : `${flippedCards.length} of ${count} revealed`}
          {favorites.length > 0 && ` • ${favorites.length} favorited`}
        </span>
      </div>

      {/* 2-column on mobile, 4-column on desktop */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {reasonsList.map((item) => {
          const isFlipped = flippedCards.includes(item.id);
          const isFavorited = favorites.includes(item.id);

          return (
            <motion.button
              type="button"
              key={item.id}
              aria-pressed={isFlipped}
              onClick={() => toggleCard(item.id)}
              className="relative h-56 sm:h-64 w-full text-left rounded-2xl cursor-pointer perspective-1000 select-none block p-0 bg-transparent border-0"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full relative transform-3d"
              >
                {/* FRONT FACE */}
                <div
                  className="absolute inset-0 rounded-2xl bg-paper p-4 sm:p-5 flex flex-col justify-between border border-mauve/20 shadow-sm backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm sm:text-base font-bold text-strawberry">
                      {item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    {isFavorited && (
                      <Heart className="w-4 h-4 text-strawberry fill-strawberry" />
                    )}
                  </div>

                  <h3 className="font-serif text-base sm:text-lg text-ink font-normal leading-snug">
                    {item.title}
                  </h3>

                  <span className="text-[11px] font-sans text-mauve">
                    {COPY.reasons.flipPrompt}
                  </span>
                </div>

                {/* BACK FACE */}
                <div
                  className="absolute inset-0 rounded-2xl bg-paper p-4 sm:p-5 flex flex-col justify-between border border-mauve/30 shadow-md backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans text-strawberry font-semibold uppercase tracking-wider">
                      {item.id}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, item.id)}
                      className="p-1 rounded-full hover:bg-strawberry/10 text-mauve transition-colors cursor-pointer"
                      title={isFavorited ? "Remove from favorites" : "Favorite this reason"}
                      aria-label={isFavorited ? "Remove favorite" : "Add to favorites"}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFavorited
                            ? "text-strawberry fill-strawberry"
                            : "text-mauve hover:text-strawberry"
                        }`}
                      />
                    </button>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-ink/90 leading-relaxed my-auto">
                    {item.body}
                  </p>

                  <span className="text-[10px] font-sans text-mauve text-right">
                    {COPY.reasons.unflipPrompt}
                  </span>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
