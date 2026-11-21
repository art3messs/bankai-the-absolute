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
        className="cursor-pointer max-w-xl w-full mx-auto p-4 rounded-3xl bg-white/95 border-2 border-[#f472b6]/45 shadow-[0_12px_35px_rgba(236,72,153,0.12)] hover:shadow-[0_20px_45px_rgba(236,72,153,0.2)] transition-all flex items-center justify-between gap-4 group select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/10 p-0.5 border border-[#1DB954]/30 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-[#1DB954] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-0.5 rounded-full">
                Spotify Player Live
              </span>
              <span className="text-xs text-[#f472b6]">✦</span>
              <span className="text-[11px] font-mono text-[#db2777] font-semibold">
                Harleen &amp; Me
              </span>
            </div>
            <h4 className="font-forum uppercase tracking-wider text-base text-[#831843] mt-0.5 group-hover:text-[#db2777] transition-colors">
              Interactive Spotify Mixtape 🎧
            </h4>
            <p className="text-xs font-signature text-[#9d174d] text-lg">
              Open to browse, change songs, and stream our full playlist.
            </p>
          </div>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-raleway font-bold text-xs uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer">
          <span>Open Player</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </motion.div>

      {/* Embedded Spotify Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl bg-[#121212] p-5 shadow-2xl border border-white/20 overflow-hidden text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4 pr-10">
                <div className="w-10 h-10 rounded-full bg-[#1DB954]/20 p-1 flex items-center justify-center text-[#1DB954]">
                  <Disc3 className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <div>
                  <h3 className="font-forum text-xl uppercase tracking-wider text-white">
                    Our Spotify Mixtape
                  </h3>
                  <p className="text-xs text-neutral-400 font-raleway">
                    Change songs and listen together directly on Spotify
                  </p>
                </div>
              </div>

              {/* Embedded Spotify IFrame */}
              <div className="rounded-2xl overflow-hidden bg-black/50 border border-white/10">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/06Aj93NfdzlxVX8Sw1dlXK?utm_source=generator&theme=0"
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>

              {/* Footer Links */}
              <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 font-raleway">
                <span>Harleen 4 Life • February 16</span>
                <a
                  href={BIRTHDAY_CONFIG.spotifyPlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#1DB954] hover:underline font-semibold"
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
