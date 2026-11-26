"use client";

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
  const [shakeCount, setShakeCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/recipient")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated) {
          setIsUnlocked(true);
          window.dispatchEvent(new CustomEvent("harleen:vault-unlocked"));
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
      window.dispatchEvent(new CustomEvent("harleen:vault-unlocked"));

      confetti({
        particleCount: 95,
        spread: 95,
        origin: { y: 0.6 },
        colors: ["#D4285A", "#C89B3C", "#F6E5B6", "#FFF9FA", "#F4B9C9"],
      });
    } catch (err) {
      setShakeCount((c) => c + 1);
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
    <section id="vault" className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center">
      <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
        {COPY.vault.heading}
      </h2>
      <p className="font-hand text-2xl sm:text-3xl text-ink/80 mt-2">
        &ldquo;{COPY.vault.subtitle}&rdquo;
      </p>

      {/* Velvet Locket Keepsake Vault */}
      <div className="relative w-full max-w-xl mt-7 p-6 sm:p-10 rounded-[28px] paper-card overflow-hidden">
        {/* Corner Filigree Framing */}
        <div className="pointer-events-none absolute top-3 left-3 w-5 h-5 border-t border-l border-gold/45 rounded-tl-lg" />
        <div className="pointer-events-none absolute bottom-3 right-3 w-5 h-5 border-b border-r border-gold/45 rounded-br-lg" />

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-strawberry/15 via-gold-light/40 to-strawberry/10 border border-gold/45 text-strawberry flex items-center justify-center mb-4 shadow-sm">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1.5 rounded-full border border-dashed border-gold/45 animate-spin"
              style={{ animationDuration: "24s" }}
            />
            {isUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <p className="font-serif text-xl sm:text-2xl text-ink font-normal max-w-md">
            {COPY.vault.question}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.form
              key="locked-form"
              onSubmit={handleUnlock}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: shakeCount > 0 ? [0, -7, 7, -5, 5, 0] : 0,
              }}
              transition={{ duration: 0.35 }}
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
                  className="w-full px-5 py-3 rounded-full bg-paper border border-gold/40 focus:border-strawberry focus:ring-2 focus:ring-strawberry/20 outline-none text-ink text-sm font-sans transition-all shadow-inner text-center"
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
                className="w-full py-3 min-h-[44px] rounded-full bg-gradient-to-r from-strawberry to-[#B81E4C] text-paper border border-gold-light/30 font-sans font-semibold text-xs uppercase tracking-widest shadow-md hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{isSubmitting ? "Verifying..." : COPY.vault.submitButton}</span>
              </button>

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
                    className="mt-3 p-3.5 rounded-xl bg-paper border border-gold/30 text-xs text-ink/80 font-sans max-w-sm mx-auto shadow-xs"
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
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center text-center max-w-lg mx-auto"
            >
              <span className="px-3 py-1 rounded-full bg-gold-light/35 border border-gold/40 text-xs font-sans font-semibold text-strawberry uppercase tracking-wider mb-3">
                {COPY.vault.revealedTag}
              </span>

              <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed font-normal">
                {COPY.vault.secretMessage}
              </p>

              {/* Cinema Matte Special Video Keepsake */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-b from-paper to-[#FFF1F5] border border-gold/35 w-full shadow-inner">
                <div className="flex items-center justify-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-strawberry mb-3">
                  <Video className="w-4 h-4" />
                  <span>{COPY.vault.videoTitle}</span>
                </div>

                <div className="relative aspect-video max-w-md mx-auto rounded-xl overflow-hidden shadow-md border border-gold/30 bg-stone-950">
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

                <p className="font-hand text-2xl text-mauve mt-3">
                  &ldquo;{COPY.vault.videoQuote}&rdquo;
                </p>
              </div>

              <div className="w-24 editorial-rule my-6 mx-auto" />

              <span className="font-hand text-3xl sm:text-4xl text-foil block">
                {COPY.vault.signoff}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
