"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Heart, Sparkles } from "lucide-react";

export default function CalendarCard() {
  // February standard days (28 days)
  const daysInFeb = Array.from({ length: 28 }, (_, i) => i + 1);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="glass-panel p-5 rounded-3xl max-w-xs w-full flex flex-col items-center select-none shadow-xl border border-pink-300/30">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-3 px-1 border-b border-pink-400/20 pb-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-pink-300" />
          <span className="font-serif font-bold text-pink-100 text-base tracking-wide">
            February
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-[11px] font-semibold text-pink-300 border border-pink-400/30">
          The 16th 💖
        </span>
      </div>

      {/* Weekday initials */}
      <div className="grid grid-cols-7 gap-1.5 w-full text-center mb-1">
        {weekDays.map((wd, i) => (
          <span key={i} className="text-[11px] font-semibold text-pink-300/60">
            {wd}
          </span>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 w-full text-center">
        {/* Feb starts on Sunday (day 1) in common reference */}
        {daysInFeb.map((day) => {
          const isSixteenth = day === 16;
          return (
            <div
              key={day}
              className={`relative flex items-center justify-center h-8 rounded-xl text-xs font-medium transition-all ${
                isSixteenth
                  ? "bg-gradient-to-tr from-pink-500 via-rose-500 to-fuchsia-500 text-white font-bold shadow-[0_0_15px_rgba(255,75,145,0.7)] scale-110 z-10"
                  : "text-pink-100/80 hover:bg-pink-500/10"
              }`}
            >
              {day}

              {/* Beating Heart on the 16th */}
              {isSixteenth && (
                <motion.div
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-1.5 -right-1.5 text-pink-200 drop-shadow"
                >
                  <Heart className="w-3.5 h-3.5 fill-pink-300 text-pink-100" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Romantic Tagline Footer */}
      <div className="mt-4 pt-3 border-t border-pink-400/20 w-full text-center flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-pink-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>The day an angel was born</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
        </div>
        <p className="text-[11px] text-pink-300/70 mt-0.5 font-hand text-base">
          Forever a celebration of Harleen ✨
        </p>
      </div>
    </div>
  );
}
