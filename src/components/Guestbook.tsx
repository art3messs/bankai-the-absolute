"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, Heart, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";

interface Wish {
  id: string;
  name: string;
  message: string;
  stamp: string;
  createdAt: string;
}

const STAMPS = ["🌸", "💖", "🎀", "✨", "🎂", "💌", "🧸"];

export default function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStamp, setSelectedStamp] = useState("🌸");
  const [loading, setLoading] = useState(false);

  // Fetch live wishes on mount
  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setWishes(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          stamp: selectedStamp,
        }),
      });

      if (res.ok) {
        const newWish = await res.json();
        setWishes((prev) => [newWish, ...prev]);
        setName("");
        setMessage("");
        setIsModalOpen(false);

        // Confetti burst on wish submit
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
        });
      }
    } catch {
      // Failed to submit
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-pink-400/20">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-xs font-semibold tracking-wider uppercase mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-pink-300" />
            <span>Digital Guestbook • {wishes.length} Wishes</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-pink-100">
            Birthday Wishes for Harleen 🌸
          </h3>
          <p className="font-hand text-xl text-pink-200/80">
            Messages from friends celebrating the one and only Harleen!
          </p>
        </div>

        {/* Add Wish Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white font-bold text-sm shadow-[0_0_20px_rgba(255,75,145,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Wish</span>
        </button>
      </div>

      {/* STICKY NOTES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishes.map((w, idx) => {
          // Playful slight tilt for each sticky note
          const rotations = [-2, 1.5, -1, 2, -1.5];
          const rotation = rotations[idx % rotations.length];

          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#fff3f6] to-[#ffe5ec] shadow-lg border border-pink-200 relative select-none flex flex-col justify-between min-h-[170px]"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-300/40 border-x border-pink-200/60 shadow-xs" />

              {/* Stamp Emoji in Top Right */}
              <span className="absolute top-3 right-3 text-2xl select-none" title="Sticker Stamp">
                {w.stamp}
              </span>

              {/* Message */}
              <div className="pt-2 pr-6">
                <p className="font-hand text-xl text-gray-800 leading-snug">
                  &ldquo;{w.message}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-4 pt-2 border-t border-pink-200/60 flex items-center justify-between text-xs">
                <span className="font-serif font-bold text-pink-900">
                  — {w.name}
                </span>
                <span className="text-gray-500 text-[11px]">
                  {new Date(w.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* WRITE A WISH MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full glass-panel-glow p-6 sm:p-8 rounded-3xl border border-pink-300/40 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-2xl font-bold text-pink-100 mb-1">
                Leave a Wish for Harleen 💌
              </h4>
              <p className="font-hand text-lg text-pink-200/80 mb-5">
                Drop your sweetest birthday message!
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">
                    Your Name / Nickname
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Simran, Gurleen, Aryan..."
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/60 border border-pink-400/30 text-white placeholder-pink-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">
                    Birthday Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something heartfelt, funny, or sweet..."
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/60 border border-pink-400/30 text-white placeholder-pink-300/40 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                {/* Pick a Stamp */}
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1.5">
                    Choose a Sticker Stamp
                  </label>
                  <div className="flex gap-2">
                    {STAMPS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedStamp(s)}
                        className={`text-xl p-2 rounded-xl transition-all ${
                          selectedStamp === s
                            ? "bg-pink-500 scale-125 shadow-md"
                            : "bg-pink-950/40 hover:bg-pink-900/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Posting..." : "Post Birthday Wish"}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
