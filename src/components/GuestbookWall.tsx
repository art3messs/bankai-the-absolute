"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
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

const emptySubscribe = () => () => {};

export default function GuestbookWall() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStamp, setSelectedStamp] = useState("🌸");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const [selectedReaction, setSelectedReaction] = useState(COPY.writeBack.reviewOptions[0]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [needsVaultUnlock, setNeedsVaultUnlock] = useState(false);

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

    const onVaultUnlocked = () => {
      setNeedsVaultUnlock(false);
      setReviewError("");
    };
    window.addEventListener("harleen:vault-unlocked", onVaultUnlocked);
    return () => window.removeEventListener("harleen:vault-unlocked", onVaultUnlocked);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen]);

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
        particleCount: 55,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#FFF9FA"],
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
    setNeedsVaultUnlock(false);
    try {
      const payloadMessage = reviewMessage.trim() || selectedReaction;
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Harleen",
          type: "review",
          reaction: selectedReaction,
          message: payloadMessage,
          stamp: "💖",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setNeedsVaultUnlock(true);
        }
        throw new Error(data.error || "Failed to send. Please try again.");
      }

      setReviewSubmitted(true);
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#F4B9C9", "#C89B3C", "#FFF9FA"],
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
    <section id="notes" className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.writeBack.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.writeBack.subtitle}&rdquo;
      </p>

      {/* Reaction Capsule Card */}
      <div className="w-full max-w-xl mt-8 p-6 sm:p-8 rounded-[28px] paper-card text-left">
        {!reviewSubmitted ? (
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
            <label className="font-serif text-lg sm:text-xl text-ink font-normal">
              {COPY.writeBack.reviewPrompt}
            </label>

            <div className="flex flex-wrap gap-2">
              {COPY.writeBack.reviewOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSelectedReaction(opt)}
                  className={`px-3.5 py-2 min-h-[38px] rounded-full text-xs font-sans transition-all cursor-pointer ${
                    selectedReaction === opt
                      ? "bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper font-semibold shadow-sm border border-gold-light/35"
                      : "bg-paper text-ink/85 border border-gold/30 hover:border-strawberry/50"
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
              className="w-full p-3.5 rounded-2xl bg-paper border border-gold/35 focus:border-strawberry focus:ring-2 focus:ring-strawberry/15 outline-none text-ink text-sm font-sans resize-none shadow-inner"
            />

            {reviewError && (
              <div role="alert" className="text-xs text-strawberry font-sans flex flex-wrap items-center gap-2">
                <span>{reviewError}</span>
                {needsVaultUnlock && (
                  <a
                    href="#vault"
                    className="underline font-semibold hover:text-ink transition-colors"
                  >
                    Unlock vault above
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="py-2.5 px-6 min-h-[42px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/30 text-xs font-sans font-semibold hover:brightness-110 disabled:opacity-50 transition-all self-start cursor-pointer shadow-sm"
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

      {/* Handwritten Notes Wall */}
      <div className="w-full mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 text-left">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
              {COPY.writeBack.notesHeading}
            </h3>
            <p className="font-sans text-xs text-mauve mt-0.5">
              {COPY.writeBack.notesSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/30 text-xs font-sans font-semibold hover:brightness-110 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left pt-2">
          {wishes.map((w, idx) => (
            <div
              key={w.id}
              className={`relative p-4 sm:p-5 rounded-2xl paper-card flex flex-col justify-between transition-transform hover:-translate-y-0.5 ${
                idx % 2 === 0 ? "md:-rotate-[0.6deg] md:hover:rotate-0" : "md:rotate-[0.6deg] md:hover:rotate-0"
              }`}
            >
              {/* Masking-Tape Accent */}
              <div
                aria-hidden="true"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-xs bg-gold-light/60 border border-gold/25 shadow-2xs"
              />

              <div className="flex items-center justify-between mb-2 pt-1">
                <span className="text-lg">{w.stamp || "🌸"}</span>
                <span className="text-[10px] font-sans text-mauve">
                  {w.createdAt
                    ? new Date(w.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "16 Feb"}
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ink/90 leading-relaxed line-clamp-4">
                &ldquo;{w.message}&rdquo;
              </p>
              <span className="font-hand text-xl text-foil mt-3 block">
                — {w.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Note Composer Modal (Portalled above all sections) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isModalOpen && (
              <div
                role="dialog"
                aria-modal="true"
                aria-label={COPY.writeBack.leaveNoteButton}
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-md w-full paper-card rounded-3xl p-6 text-left shadow-2xl"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gold/20 mb-4">
                    <h4 className="font-serif text-xl text-ink font-normal">
                      {COPY.writeBack.leaveNoteButton}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      aria-label="Close note modal"
                      className="w-9 h-9 rounded-full hover:bg-mauve/10 flex items-center justify-center text-ink cursor-pointer"
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-paper border border-gold/35 focus:border-strawberry outline-none text-ink text-sm font-sans"
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
                        className="w-full p-3.5 rounded-xl bg-paper border border-gold/35 focus:border-strawberry outline-none text-ink text-sm font-sans resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-sans text-mauve block mb-1">
                        {COPY.writeBack.formStampLabel}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {STAMPS.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSelectedStamp(s)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer ${
                              selectedStamp === s
                                ? "bg-strawberry/15 border-2 border-strawberry scale-105"
                                : "bg-paper border border-gold/30 hover:border-strawberry/40"
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
                      className="mt-2 py-3 rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/30 font-sans font-semibold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer text-center shadow-sm"
                    >
                      {isPosting ? COPY.writeBack.formPostingButton : COPY.writeBack.formSubmitButton}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
