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
          colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
        });
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#d97d93]/20">
        <div>
          <h3 className="font-forum text-3xl sm:text-4xl text-[#241e16] uppercase tracking-[0.06em]">
            Reminders For Your Heart
          </h3>
          <p className="font-signature text-2xl text-[#7d7265] mt-1">
            &ldquo;Every little reason why you are my whole universe, sealed with endless fondness &amp; pucchi.&rdquo;
          </p>
        </div>

        {/* Add Note Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d97d93] to-[#c95874] hover:opacity-95 text-white font-raleway font-bold text-xs uppercase tracking-[0.18em] shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Leave A Reminder</span>
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
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-6 rounded-2xl bg-white border border-[#d97d93]/25 shadow-xs relative select-none flex flex-col justify-between min-h-[175px]"
          >
            {/* Top Gold Pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] shadow-xs border-2 border-white" />

            {/* Stamp Emoji */}
            <span className="absolute top-4 right-4 text-2xl select-none" title="Stamp">
              {w.stamp}
            </span>

            {/* Message */}
            <div className="pt-2 pr-8">
              <p className="font-raleway text-sm sm:text-base text-[#241e16] font-medium leading-relaxed">
                &ldquo;{w.message}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="mt-4 pt-3 border-t border-[#d97d93]/15 flex items-center justify-between text-xs">
              <span className="font-signature text-2xl text-[#c95874]">
                — {w.name}
              </span>
              <span className="text-[#7d7265] text-[10px] font-raleway tracking-wider uppercase">
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
              className="relative max-w-md w-full bg-[#fdfaf5] p-6 sm:p-8 rounded-3xl border border-[#d97d93]/35 shadow-2xl text-[#241e16]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-neutral-100 text-[#241e16] border border-[#d97d93]/30 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <span className="font-signature text-3xl text-[#c95874] block mb-1">
                  Harleen
                </span>
                <h4 className="font-forum text-xl uppercase tracking-wider text-[#241e16]">
                  Leave A Note For Her
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#7d7265] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Your adoring partner"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d97d93]/30 focus:border-[#d4af37] outline-none text-sm font-raleway"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#7d7265] mb-1">
                    Your Note or Memory
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a sweet reminder for Harleen..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#d97d93]/30 focus:border-[#d4af37] outline-none text-sm font-raleway resize-none"
                  />
                </div>

                {/* Stamp Picker */}
                <div>
                  <label className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#7d7265] mb-1">
                    Choose A Seal Stamp
                  </label>
                  <div className="flex gap-2 justify-center">
                    {STAMPS.map((stamp) => (
                      <button
                        key={stamp}
                        type="button"
                        onClick={() => setSelectedStamp(stamp)}
                        className={`text-2xl p-2 rounded-xl transition-all ${
                          selectedStamp === stamp
                            ? "bg-[#d97d93]/20 border border-[#d97d93] scale-110"
                            : "hover:bg-white"
                        }`}
                      >
                        {stamp}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d97d93] to-[#c95874] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sealing..." : "Post Note"}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
