"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Sparkles, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";

interface Wish {
  id: string;
  name: string;
  message: string;
  stamp: string;
  createdAt: string;
}

const STAMPS = ["🌸", "💖", "🎀", "✨", "🎂", "💌", "🧸"];

export default function GuestbookWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStamp, setSelectedStamp] = useState("🌸");
  const [loading, setLoading] = useState(false);

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

        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
        });
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="guestbook" className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 pb-5 border-b border-pink-200">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-rose-700 text-xs font-semibold tracking-wider uppercase mb-2 shadow-xs">
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Digital Guestbook • {wishes.length} Messages</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2e1322]">
            Birthday Wishes for Harleen 💌
          </h3>
          <p className="font-hand text-2xl text-rose-600/90">
            Messages from friends celebrating the one and only Harleen!
          </p>
        </div>

        {/* Add Wish Button with Gold Accent */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm shadow-[0_4px_20px_rgba(251,191,36,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Leave a Message</span>
        </button>
      </div>

      {/* STICKY NOTES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishes.map((w, idx) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-6 rounded-2xl bg-[#fffafc] border border-pink-200 shadow-md relative select-none flex flex-col justify-between min-h-[175px]"
          >
            {/* Top Gold Pin */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 shadow-md border-2 border-white" />

            {/* Stamp Emoji */}
            <span className="absolute top-4 right-4 text-2xl select-none" title="Stamp">
              {w.stamp}
            </span>

            {/* Message */}
            <div className="pt-2 pr-8">
              <p className="font-hand text-2xl text-gray-800 leading-snug">
                &ldquo;{w.message}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-rose-800 tracking-wide text-sm">
                — {w.name}
              </span>
              <span className="text-gray-400 text-[11px] font-sans">
                {new Date(w.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* WRITE A WISH MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border-2 border-pink-200 shadow-2xl text-[#2e1322]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 text-gray-700 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-2xl font-bold text-rose-900 mb-1">
                Write a Wish for Harleen 🌸
              </h4>
              <p className="font-hand text-xl text-rose-600 mb-5">
                Drop your sweetest birthday thought!
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or nickname..."
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Birthday Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something heartfelt, funny, or sweet..."
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-50/50 border border-pink-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
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
                            ? "bg-gradient-to-tr from-amber-400 to-yellow-300 text-black scale-120 shadow-md border border-amber-300"
                            : "bg-pink-50 hover:bg-pink-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4 fill-black" />
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
