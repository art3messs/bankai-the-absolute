"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3, ExternalLink, Sparkles, X, Heart, Music } from "lucide-react";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function SpotifyMixtape() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Interactive Trigger Card / Banner */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer max-w-xl w-full mx-auto p-4 rounded-2xl glass-pearl border border-amber-300/50 shadow-md hover:shadow-lg transition-all flex items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
              <Music className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full">
                Shared Playlist
              </span>
              <span className="text-xs text-rose-500">✦</span>
              <span className="text-[11px] font-mono text-rose-700 font-semibold">
                Spotify Live
              </span>
            </div>
            <h4 className="font-serif font-black text-base text-[#2e1322] mt-0.5 group-hover:text-rose-600 transition-colors">
              Our Collaborative Mixtape 🎧
            </h4>
            <p className="text-xs font-hand text-rose-600">
              The tracks that remind me of you, curated together.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-900 font-bold text-xs shadow-xs hover:shadow-md transition-all shrink-0 flex items-center gap-1.5">
          <span>Listen</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Fullscreen Spotify Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl bg-white/95 p-6 shadow-2xl border-2 border-pink-200 overflow-hidden text-[#2e1322]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-pink-100 hover:bg-pink-200 text-rose-800 flex items-center justify-center transition-all shadow-xs active:scale-95 z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-pink-500 animate-spin" style={{ animationDuration: "8s" }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-black text-rose-950">
                    Our Collaborative Mixtape 🌸
                  </h3>
                  <p className="text-xs font-hand text-rose-600 text-sm">
                    &ldquo;Every song here reminds me of you, Harleen.&rdquo;
                  </p>
                </div>
              </div>

              {/* Embedded Spotify Player */}
              <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-pink-200 bg-neutral-900">
                <iframe
                  style={{ borderRadius: "16px" }}
                  src="https://open.spotify.com/embed/playlist/06Aj93NfdzlxVX8Sw1dlXK?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Collaborative Playlist"
                />
              </div>

              {/* Footer Actions */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-pink-100">
                <div className="flex items-center gap-1.5 text-xs text-rose-800 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Curated for Harleen 4 Life</span>
                </div>

                <a
                  href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Open in Spotify App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
