"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Calendar, Sparkles } from "lucide-react";
import { PhotoMemory } from "@/data/config";

interface PhotoLightboxProps {
  photo: PhotoMemory | null;
  onClose: () => void;
}

export default function PhotoLightbox({ photo, onClose }: PhotoLightboxProps) {
  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full glass-panel-glow rounded-3xl p-4 md:p-6 border border-pink-300/40 shadow-[0_0_60px_rgba(255,105,180,0.3)] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Container */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-pink-950/40 border border-pink-300/20 shadow-inner flex items-center justify-center">
            {/* If photo image fails or is sample placeholder, show aesthetic fallback card */}
            <img
              src={photo.url}
              alt={photo.caption || "Harleen's memory"}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback graphic for placeholder
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector(".photo-fallback") as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }
              }}
            />

            <div className="photo-fallback hidden flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-pink-300 fill-pink-400/30 animate-pulse" />
              </div>
              <p className="font-serif text-xl font-bold text-pink-100">
                {photo.caption || "A Sweet Memory of Harleen 🌸"}
              </p>
              <p className="text-xs text-pink-300/80 mt-1">
                Drop your photo into <code className="bg-pink-950/60 px-2 py-0.5 rounded text-pink-200">public/photos/</code> to display it here!
              </p>
            </div>
          </div>

          {/* Caption & Metadata */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
            <div>
              <p className="font-serif text-lg font-bold text-pink-100">
                {photo.caption || "A Special Moment"}
              </p>
              {photo.date && (
                <div className="flex items-center gap-1.5 text-xs text-pink-300/80 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{photo.date}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-xs font-semibold text-pink-200 capitalize">
                {photo.category}
              </span>
              <button
                onClick={(e) => {
                  e.currentTarget.classList.toggle("text-rose-400");
                  e.currentTarget.classList.toggle("fill-rose-400");
                }}
                className="p-2 rounded-full hover:bg-pink-500/20 text-pink-200 transition-all active:scale-125"
                title="Send Love"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
