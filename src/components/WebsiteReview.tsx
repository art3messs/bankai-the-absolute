"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Send, MessageSquareHeart } from "lucide-react";

const REACTIONS = [
  { id: "adored", label: "🥹 Adored every second" },
  { id: "tears", label: "😭 In happy tears" },
  { id: "best", label: "✨ Best gift ever" },
  { id: "pucchi", label: "💖 Pucchi for life" },
  { id: "queen", label: "👑 1000/10 Queen feel" },
];

export default function WebsiteReview() {
  const [selectedReaction, setSelectedReaction] = useState(REACTIONS[0].label);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Hydrate stored state post-mount to avoid SSR markup mismatch
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedSubmitted = localStorage.getItem("harleen_review_sent") === "true";
        const storedReaction = localStorage.getItem("harleen_review_reaction");
        if (storedSubmitted || storedReaction) {
          setTimeout(() => {
            if (storedSubmitted) {
              setIsSubmitted(true);
            }
            if (storedReaction && REACTIONS.some((r) => r.label === storedReaction)) {
              setSelectedReaction(storedReaction);
            }
          }, 0);
        }
      }
    } catch (err) {
      console.warn("Storage access unavailable:", err);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/wishes", {
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Your review couldn’t be delivered. Please try again.");
      }

      setIsSubmitted(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("harleen_review_sent", "true");
          localStorage.setItem("harleen_review_reaction", selectedReaction);
        }
      } catch (err) {
        console.warn("Could not save review state to localStorage:", err);
      }

      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.7 },
        colors: ["#B0295F", "#FFD9E3", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="review" className="relative z-10 max-w-3xl mx-auto px-4 py-16" style={{ perspective: 1000 }}>
      <div className="girly-card p-6 sm:p-12 rounded-3xl border-2 border-[#FFD9E3] shadow-[0_20px_50px_rgba(176,41,95,0.1)] relative overflow-hidden bg-white/95 text-center transform-3d">
        {/* Top Tag */}
        <div className="girly-tag mb-4">
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#B0295F]" />
          <span>AN INTIMATE QUESTION FOR YOU</span>
        </div>

        <h2 className="font-forum text-3xl sm:text-4xl text-[#3A1F2B] uppercase tracking-[0.06em]">
          Did You Like What I Made For You? 🤍
        </h2>
        <p className="font-signature text-2xl text-[#B0295F] mt-2">
          &ldquo;Every photo, every word, and every line of code was created just to see you smile.&rdquo;
        </p>

        <div className="w-20 editorial-rule my-6 mx-auto" />

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="review-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="flex flex-col items-center max-w-lg mx-auto"
            >
              <label htmlFor="review-textarea" className="text-[10px] font-raleway font-bold uppercase tracking-wider text-[#3A1F2B]/75 mb-3">
                How did this experience make you feel?
              </label>

              {/* Reaction Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={selectedReaction === r.label}
                    onClick={() => {
                      setSelectedReaction(r.label);
                      if (submitError) setSubmitError("");
                    }}
                    className={`px-3.5 py-2 min-h-[44px] rounded-full text-xs font-raleway font-semibold transition-all cursor-pointer ${
                      selectedReaction === r.label
                        ? "bg-[#B0295F] text-white shadow-xs scale-105"
                        : "bg-[#FFF8F5] text-[#3A1F2B] border border-[#FFD9E3] hover:border-[#B0295F]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Review Input */}
              <div className="w-full mb-3">
                <textarea
                  id="review-textarea"
                  rows={3}
                  maxLength={500}
                  value={reviewMessage}
                  onChange={(e) => {
                    setReviewMessage(e.target.value);
                    if (submitError) setSubmitError("");
                  }}
                  placeholder="Tell me your honest thoughts, your favorite part, or whatever you want to say to me..."
                  className="w-full p-4 rounded-2xl bg-[#FFF8F5] border border-[#FFD9E3] focus:border-[#B0295F] focus:ring-2 focus:ring-[#B0295F]/20 outline-none font-raleway text-sm text-[#3A1F2B] placeholder-[#3A1F2B]/45 transition-all shadow-inner resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!reviewMessage.trim() || isSubmitting}
                className="w-full sm:w-auto px-9 py-3.5 min-h-[44px] rounded-full bg-[#B0295F] hover:bg-[#8F1D4B] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-white" />
                <span>{isSubmitting ? "Delivering To Me..." : "Send Your Review To My Phone 💌"}</span>
              </button>

              {submitError && (
                <p role="alert" className="mt-3 text-sm text-rose-700 font-semibold">
                  {submitError}
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="review-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-6 flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#FFD9E3] flex items-center justify-center text-[#B0295F] mb-3">
                <Heart className="w-7 h-7 fill-[#B0295F]" />
              </div>
              <h3 className="font-forum text-2xl uppercase tracking-wider text-[#3A1F2B]">
                I Received Your Thoughts! 🤍
              </h3>
              <div className="my-2 px-4 py-1 rounded-full bg-[#FFD9E3] text-xs font-raleway font-bold text-[#B0295F]">
                {selectedReaction}
              </div>
              <p className="font-signature text-2xl sm:text-3xl text-[#B0295F] mt-2 max-w-md">
                &ldquo;Your reaction popped up on my phone. Seeing you happy is my whole entire universe. Thank you, my sweetest Pucchi.&rdquo;
              </p>
              <div className="mt-4 px-4 py-1.5 rounded-full bg-[#FFF8F5] border border-[#FFD9E3] text-xs text-[#3A1F2B]/70 font-mono">
                Delivered straight to me • Harleen 4 Life
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
