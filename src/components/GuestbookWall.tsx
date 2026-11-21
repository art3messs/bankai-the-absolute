"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Send, Heart, Loader2 } from "lucide-react";
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
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/wishes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load notes.");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setWishes(data);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Could not load memories right now.";
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isPosting) return;

    setIsPosting(true);
    setPostError(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim().slice(0, 40),
          message: message.trim().slice(0, 500),
          stamp: selectedStamp,
          type: "note",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to post note. Please try again.");
      }

      const data = await res.json();
      if (data.item) {
        setWishes((prev) => [data.item, ...prev]);
      }
      setName("");
      setMessage("");
      setIsModalOpen(false);

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#B0295F", "#FFD9E3", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to post note. Please try again.";
      setPostError(msg);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-[#FFD9E3]">
        <div>
          <h3 className="font-forum text-3xl sm:text-4xl text-[#3A1F2B] uppercase tracking-[0.06em]">
            Reminders For Your Heart
          </h3>
          <p className="font-signature text-2xl text-[#B0295F] mt-1">
            &ldquo;Every little reason why you are my whole universe, sealed with endless fondness &amp; pucchi.&rdquo;
          </p>
        </div>

        {/* Add Note Button */}
        <button
          onClick={() => {
            setPostError(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-[#B0295F] hover:bg-[#8F1D4B] text-white font-raleway font-bold text-xs uppercase tracking-[0.18em] shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Leave A Reminder</span>
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="py-16 flex flex-col items-center justify-center text-[#B0295F]">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#B0295F]" />
          <span className="font-raleway text-xs uppercase tracking-widest text-[#3A1F2B]/70">
            Unsealing Reminders...
          </span>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="py-12 text-center text-rose-600 font-raleway text-sm">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && wishes.length === 0 && (
        <div className="py-16 text-center text-[#3A1F2B]/70">
          <Heart className="w-8 h-8 text-[#B0295F] mx-auto mb-3" />
          <p className="font-forum text-lg uppercase tracking-wider text-[#3A1F2B]">
            No reminders yet
          </p>
          <p className="font-signature text-xl text-[#B0295F] mt-1">
            Be the first to leave a sweet thought for Harleen.
          </p>
        </div>
      )}

      {/* STICKY NOTES GRID */}
      {!isLoading && wishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishes.map((w, idx) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.4) }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="p-6 rounded-2xl bg-white border border-[#FFD9E3] shadow-xs relative select-none flex flex-col justify-between min-h-[175px]"
            >
              {/* Top Gold Pin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4af37] shadow-xs border-2 border-white" />

              {/* Stamp Emoji */}
              <span className="absolute top-4 right-4 text-2xl select-none" title="Stamp">
                {w.stamp}
              </span>

              {/* Message */}
              <div className="pt-2 pr-8">
                <p className="font-raleway text-sm sm:text-base text-[#3A1F2B] font-medium leading-relaxed">
                  &ldquo;{w.message}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-4 pt-3 border-t border-[#FFD9E3] flex items-center justify-between text-xs">
                <span className="font-signature text-2xl text-[#B0295F]">
                  — {w.name}
                </span>
                <span className="text-[#3A1F2B]/60 text-[10px] font-mono tracking-wider uppercase">
                  {new Date(w.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* WRITE A WISH MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full m-auto my-auto max-h-[calc(100dvh-2rem)] flex flex-col bg-[#FFF8F5] p-6 sm:p-8 rounded-2xl border border-[#FFD9E3] shadow-2xl text-[#3A1F2B] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white hover:bg-neutral-100 text-[#3A1F2B] border border-[#FFD9E3] flex items-center justify-center transition-all shadow-xs cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <span className="font-signature text-3xl text-[#B0295F] block mb-1">
                  Harleen
                </span>
                <h4 className="font-forum text-xl uppercase tracking-wider text-[#3A1F2B]">
                  Leave A Reminder For You
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="guestbook-name-input" className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#3A1F2B]/75 mb-1">
                    Your Name
                  </label>
                  <input
                    id="guestbook-name-input"
                    type="text"
                    required
                    maxLength={40}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (postError) setPostError(null);
                    }}
                    placeholder="e.g. Your adoring partner"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FFD9E3] focus:border-[#B0295F] outline-none text-sm font-raleway text-[#3A1F2B]"
                  />
                </div>

                <div>
                  <label htmlFor="guestbook-message-input" className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#3A1F2B]/75 mb-1">
                    Your Note or Memory
                  </label>
                  <textarea
                    id="guestbook-message-input"
                    required
                    rows={4}
                    maxLength={500}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (postError) setPostError(null);
                    }}
                    placeholder="Write a sweet reminder for Harleen..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#FFD9E3] focus:border-[#B0295F] outline-none text-sm font-raleway text-[#3A1F2B] resize-none"
                  />
                </div>

                {/* Stamp Picker */}
                <div>
                  <label className="block text-[10px] font-raleway font-bold uppercase tracking-[0.2em] text-[#3A1F2B]/75 mb-1">
                    Choose A Seal Stamp
                  </label>
                  <div className="flex gap-2 justify-center">
                    {STAMPS.map((stamp) => (
                      <button
                        key={stamp}
                        type="button"
                        aria-pressed={selectedStamp === stamp}
                        onClick={() => setSelectedStamp(stamp)}
                        className={`text-2xl p-2 min-h-[44px] min-w-[44px] rounded-xl transition-all cursor-pointer ${
                          selectedStamp === stamp
                            ? "bg-[#FFD9E3] border border-[#B0295F] scale-110"
                            : "hover:bg-white"
                        }`}
                      >
                        {stamp}
                      </button>
                    ))}
                  </div>
                </div>

                {postError && (
                  <p role="alert" aria-live="polite" className="text-xs text-rose-600 font-semibold text-center">
                    {postError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPosting}
                  className="w-full py-3.5 min-h-[44px] rounded-full bg-[#B0295F] hover:bg-[#8F1D4B] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isPosting ? "Sealing..." : "Post Note"}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
