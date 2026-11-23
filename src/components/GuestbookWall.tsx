"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";

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

  // Review state
  const [selectedReaction, setSelectedReaction] = useState(COPY.writeBack.reviewOptions[0]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

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
        const msg = err instanceof Error ? err.message : "Could not load notes.";
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });

    try {
      if (typeof window !== "undefined") {
        const storedSubmitted = localStorage.getItem("harleen_review_sent") === "true";
        if (storedSubmitted) {
          setTimeout(() => setReviewSubmitted(true), 0);
        }
      }
    } catch {}
  }, []);

  const handlePostNote = async (e: React.FormEvent) => {
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
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#F4B9C9", "#FFF9FA", "#8A5A6E"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not post note.";
      setPostError(msg);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingReview) return;

    setIsSubmittingReview(true);
    setReviewError("");
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
        throw new Error(data.error || "Failed to send. Please try again.");
      }

      setReviewSubmitted(true);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#F4B9C9", "#FFF9FA", "#8A5A6E"],
      });
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("harleen_review_sent", "true");
        }
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send.";
      setReviewError(msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <section id="notes" className="relative z-10 max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center">
      {/* Heading in sentence case */}
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.writeBack.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.writeBack.subtitle}&rdquo;
      </p>

      {/* MERGED BOX: Review & Note Form */}
      <div className="w-full max-w-xl mt-8 p-6 sm:p-8 rounded-3xl bg-paper border border-mauve/20 shadow-md text-left">
        {!reviewSubmitted ? (
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
            <label className="font-serif text-lg text-ink font-normal">
              {COPY.writeBack.reviewPrompt}
            </label>

            <div className="flex flex-wrap gap-2">
              {COPY.writeBack.reviewOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSelectedReaction(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                    selectedReaction === opt
                      ? "bg-strawberry text-paper font-semibold shadow-xs"
                      : "bg-paper text-ink/80 border border-mauve/20 hover:border-mauve/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              maxLength={400}
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              placeholder={COPY.writeBack.reviewPlaceholder}
              className="w-full p-3 rounded-xl bg-paper border border-mauve/30 focus:border-strawberry focus:ring-1 focus:ring-strawberry/20 outline-none text-ink text-sm font-sans resize-none"
            />

            {reviewError && (
              <p role="alert" className="text-xs text-strawberry font-sans">
                {reviewError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="py-2.5 px-6 rounded-full bg-strawberry text-paper text-xs font-sans font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity self-start cursor-pointer"
            >
              {isSubmittingReview ? COPY.writeBack.reviewSubmittingButton : COPY.writeBack.reviewSubmitButton}
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 py-2 text-strawberry">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="font-sans text-sm font-medium">
              {COPY.writeBack.reviewSuccessMessage}
            </p>
          </div>
        )}
      </div>

      {/* NOTES WALL SECTION */}
      <div className="w-full mt-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-left">
            <h3 className="font-serif text-2xl text-ink font-normal">
              {COPY.writeBack.notesHeading}
            </h3>
            <p className="font-sans text-xs text-mauve">
              {COPY.writeBack.notesSubtitle}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-strawberry text-paper text-xs font-sans font-semibold hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{COPY.writeBack.leaveNoteButton}</span>
          </button>
        </div>

        {isLoading && (
          <p className="text-xs text-mauve py-4 text-center">Loading notes...</p>
        )}
        {errorMessage && (
          <p className="text-xs text-strawberry py-4 text-center">{errorMessage}</p>
        )}
        {/* 2-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-paper border border-mauve/20 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-base">{w.stamp || "🌸"}</span>
                <span className="text-[10px] font-sans text-mauve">
                  {w.createdAt ? new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "16 Feb"}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ink/90 leading-relaxed line-clamp-4">
                &ldquo;{w.message}&rdquo;
              </p>
              <span className="font-hand text-lg text-mauve mt-3 block">
                — {w.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LEAVE NOTE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-paper rounded-3xl border border-mauve/20 shadow-2xl p-6 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-mauve/15 mb-4">
                <h4 className="font-serif text-xl text-ink font-normal">
                  {COPY.writeBack.leaveNoteButton}
                </h4>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-mauve/10 flex items-center justify-center text-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePostNote} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-sans text-mauve block mb-1">
                    {COPY.writeBack.formNameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={COPY.writeBack.formNamePlaceholder}
                    maxLength={40}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-paper border border-mauve/30 focus:border-strawberry outline-none text-ink text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-sans text-mauve block mb-1">
                    {COPY.writeBack.formMessageLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={COPY.writeBack.formMessagePlaceholder}
                    maxLength={500}
                    required
                    className="w-full p-3 rounded-xl bg-paper border border-mauve/30 focus:border-strawberry outline-none text-ink text-sm font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-sans text-mauve block mb-1">
                    {COPY.writeBack.formStampLabel}
                  </label>
                  <div className="flex gap-2">
                    {STAMPS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSelectedStamp(s)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
                          selectedStamp === s
                            ? "bg-strawberry/20 border border-strawberry"
                            : "bg-paper border border-mauve/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {postError && (
                  <p role="alert" className="text-xs text-strawberry font-sans">
                    {postError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPosting}
                  className="mt-2 py-2.5 rounded-full bg-strawberry text-paper font-sans font-semibold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer text-center"
                >
                  {isPosting ? COPY.writeBack.formPostingButton : COPY.writeBack.formSubmitButton}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
