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

const STAMPS = ["🌙", "✨", "🌸", "🖤", "🥂", "🕯️", "🎧"];

export default function GuestbookWall() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStamp, setSelectedStamp] = useState("🌙");
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
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#fde047", "#fef08a", "#e0a4b8", "#f4c2ce", "#ffffff"],
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200 text-xs font-serif tracking-wider uppercase mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Guestbook • {wishes.length} Messages</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
            Wishes for Harleen 🌙
          </h3>
          <p className="font-hand text-xl text-rose-200/80 italic">
            Warm thoughts left for Harleen on her 16th of February...
          </p>
        </div>

        {/* Add Wish Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(253,224,71,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Leave a Message</span>
        </button>
      </div>

      {/* EDITORIAL CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishes.map((w, idx) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4 }}
            className="p-6 rounded-2xl bg-[#140f1a] border border-rose-300/15 shadow-xl relative select-none flex flex-col justify-between min-h-[170px]"
          >
            {/* Top Amber Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 shadow-sm border border-black/40" />

            {/* Stamp in Top Right */}
            <span className="absolute top-4 right-4 text-2xl select-none" title="Stamp">
              {w.stamp}
            </span>

            {/* Message */}
            <div className="pt-2 pr-8">
              <p className="font-hand text-xl text-rose-100 leading-snug">
                &ldquo;{w.message}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="font-serif font-bold text-amber-200 tracking-wide">
                — {w.name}
              </span>
              <span className="text-white/40 text-[11px] font-mono">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full editorial-card p-6 sm:p-8 rounded-3xl border border-amber-300/30 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-2xl font-bold text-white mb-1">
                Write a Note for Harleen 🌙
              </h4>
              <p className="font-hand text-lg text-rose-200/80 mb-5">
                Drop a heartfelt, poetic, or sweet birthday thought.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1 font-mono uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or nickname..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-rose-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1 font-mono uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your late night thoughts for Harleen..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-rose-200/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1.5 font-mono uppercase tracking-wider">
                    Select a Stamp
                  </label>
                  <div className="flex gap-2">
                    {STAMPS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedStamp(s)}
                        className={`text-xl p-2 rounded-xl transition-all ${
                          selectedStamp === s
                            ? "bg-amber-300 text-black scale-120 shadow-md"
                            : "bg-white/5 hover:bg-white/10"
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending..." : "Send to the Vault"}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
