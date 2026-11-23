"use client";

/**
 * MidnightVault Component - Interactive Keepsake Reveal
 *
 * NOTE ON SECURITY ARCHITECTURE:
 * This component is an interactive, playful keepsake reveal designed as a romantic
 * surprise for Harleen. It is an interactive reveal rather than cryptographic secure storage.
 * The accepted answers and media asset (/media/vid-videocall-whisper.mp4) are delivered
 * client-side for instantaneous, seamless playback.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, HelpCircle, Video } from "lucide-react";
import confetti from "canvas-confetti";
import { COPY } from "@/data/copy";

export default function MidnightVault() {
  const [inputAnswer, setInputAnswer] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/recipient")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated) {
          setIsUnlocked(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputAnswer.trim();
    if (!cleanInput || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/recipient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanInput }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429) {
          throw new Error("Too many attempts. Please wait a few moments.");
        }
        throw new Error(
          data.error || "That's not the special word... Tap the hint below if you need a reminder!"
        );
      }

      setIsUnlocked(true);
      setErrorMsg("");

      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#8A5A6E", "#FFF9FA", "#F4B9C9"],
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Verification could not be completed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="vault" className="relative z-10 max-w-4xl mx-auto px-4 py-10 flex flex-col items-center text-center">
      {/* Heading in sentence case */}
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.vault.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.vault.subtitle}&rdquo;
      </p>

      {/* Keepsake Card */}
      <div className="w-full max-w-xl mt-6 p-6 sm:p-10 rounded-3xl bg-paper border border-mauve/20 shadow-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center mb-3">
            {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <p className="font-serif text-xl sm:text-2xl text-ink font-normal">
            {COPY.vault.question}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.form
              key="locked-form"
              onSubmit={handleUnlock}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="relative mb-4">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => {
                    setInputAnswer(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Enter our secret word..."
                  aria-label="Secret keepsake passcode"
                  disabled={isSubmitting}
                  className="w-full px-5 py-3 rounded-full bg-paper border border-mauve/30 focus:border-strawberry focus:ring-2 focus:ring-strawberry/20 outline-none text-ink text-sm font-sans transition-all shadow-inner text-center"
                />
              </div>

              {errorMsg && (
                <p role="alert" className="text-xs text-strawberry mb-4 font-sans font-medium">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={!inputAnswer.trim() || isSubmitting}
                className="w-full py-3 rounded-full bg-strawberry text-paper font-sans font-semibold text-xs uppercase tracking-wider shadow-sm hover:opacity-95 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{isSubmitting ? "Verifying..." : COPY.vault.submitButton}</span>
              </button>

              {/* Hint */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-mauve hover:text-ink font-sans transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-strawberry" />
                  <span>{showHint ? COPY.vault.hideHintButton : COPY.vault.hintButton}</span>
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3.5 rounded-xl bg-paper border border-mauve/20 text-xs text-ink/80 font-sans max-w-sm mx-auto shadow-xs"
                  >
                    💡 {COPY.vault.hint}
                  </motion.div>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="unlocked-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center max-w-lg mx-auto"
            >
              <span className="text-xs font-sans font-semibold text-strawberry uppercase tracking-wider mb-2">
                {COPY.vault.revealedTag}
              </span>

              <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed font-normal">
                {COPY.vault.secretMessage}
              </p>

              {/* Special Video Keepsake */}
              <div className="mt-6 p-4 rounded-2xl bg-paper border border-mauve/20 w-full">
                <div className="flex items-center justify-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-strawberry mb-3">
                  <Video className="w-4 h-4" />
                  <span>{COPY.vault.videoTitle}</span>
                </div>

                <div className="relative aspect-video max-w-md mx-auto rounded-xl overflow-hidden shadow-sm bg-stone-900">
                  <video
                    controls
                    autoPlay
                    loop
                    playsInline
                    onPlay={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("harleen:pause-music"));
                      }
                    }}
                    poster="/media/vid-videocall-whisper-poster.jpg"
                    src="/media/vid-videocall-whisper.mp4"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="font-hand text-xl text-mauve mt-3">
                  &ldquo;{COPY.vault.videoQuote}&rdquo;
                </p>
              </div>

              <div className="w-16 h-px bg-mauve/20 my-6 mx-auto" />

              <span className="font-hand text-2xl sm:text-3xl text-ink block">
                {COPY.vault.signoff}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
