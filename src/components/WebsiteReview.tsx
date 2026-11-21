"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Send, Sparkles, MessageSquareHeart, CheckCircle2 } from "lucide-react";

const REACTIONS = [
  { id: "adored", label: "🥹 Adored every second", stamp: "🥹" },
  { id: "tears", label: "😭 In happy tears", stamp: "😭" },
  { id: "best", label: "✨ Best gift ever", stamp: "✨" },
  { id: "pucchi", label: "💖 Pucchi for life", stamp: "💖" },
  { id: "queen", label: "👑 1000/10 Queen feel", stamp: "👑" },
];

export default function WebsiteReview() {
  const [selectedReaction, setSelectedReaction] = useState(REACTIONS[0].label);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Harleen",
          type: "review",
          reaction: selectedReaction,
          message: reviewMessage.trim(),
          stamp: "💖",
        }),
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.7 },
        colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="review" className="relative z-10 max-w-3xl mx-auto px-4 py-16">
      <div className="editorial-card p-6 sm:p-12 rounded-3xl border border-[#d97d93]/35 shadow-sm relative overflow-hidden bg-white/95 text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdfaf5] border border-[#d97d93]/30 text-[10px] font-raleway font-bold text-[#c95874] tracking-widest uppercase mb-4">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>AN INTIMATE QUESTION FOR YOU</span>
        </div>

        <h2 className="font-forum text-3xl sm:text-4xl text-[#241e16] uppercase tracking-[0.06em]">
          Did You Like What I Made For You? 🤍
        </h2>
        <p className="font-signature text-2xl text-[#7d7265] mt-2">
          &ldquo;Every photo, every word, and every line of code was created just to see you smile.&rdquo;
        </p>

        <div className="w-16 editorial-rule my-6 mx-auto" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-lg mx-auto">
              <span className="text-[10px] font-raleway font-bold uppercase tracking-wider text-[#7d7265] mb-3">
                How did this experience make you feel?
              </span>

              {/* Reaction Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReaction(r.label)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-raleway font-semibold transition-all cursor-pointer ${
                      selectedReaction === r.label
                        ? "bg-[#c95874] text-white shadow-xs scale-105"
                        : "bg-[#fdfaf5] text-[#241e16] border border-[#d97d93]/30 hover:border-[#c95874]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Review Input */}
              <div className="w-full mb-4">
                <textarea
                  rows={3}
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                  placeholder="Tell me your honest thoughts, your favorite part, or whatever you want to say to me..."
                  className="w-full p-4 rounded-2xl bg-[#fdfaf5] border border-[#d97d93]/40 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none font-raleway text-sm text-[#241e16] placeholder-[#7d7265]/60 transition-all shadow-inner resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!reviewMessage.trim() || isSubmitting}
                className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-white" />
                <span>{isSubmitting ? "Delivering To Me..." : "Send Your Review To My Phone 💌"}</span>
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-[#c95874] mb-3">
                <Heart className="w-7 h-7 fill-[#c95874]" />
              </div>
              <h3 className="font-forum text-2xl uppercase tracking-wider text-[#241e16]">
                I Received Your Message! 🤍
              </h3>
              <p className="font-signature text-2xl sm:text-3xl text-[#c95874] mt-2 max-w-md">
                &ldquo;Your reaction popped up on my phone. Seeing you happy is my whole entire universe. Thank you, my sweetest Pucchi.&rdquo;
              </p>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-[#fdfaf5] border border-[#d97d93]/30 text-xs text-[#7d7265] font-mono">
                Harleen 4 Life • Delivered
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
