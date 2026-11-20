"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, Sparkles, HelpCircle, Heart, Video } from "lucide-react";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function SecretVault() {
  const [inputAnswer, setInputAnswer] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputAnswer.trim().toLowerCase();
    const expected = BIRTHDAY_CONFIG.secretVault.answerHash.trim().toLowerCase();

    // Check if input matches or matches common sweet words
    if (cleanInput === expected || cleanInput === "pink" || cleanInput === "harleen" || cleanInput === "16") {
      setIsUnlocked(true);
      setErrorMsg("");

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
      });
    } else {
      setErrorMsg("Incorrect secret word! Check the hint or try again 🥺");
    }
  };

  return (
    <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-16">
      <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl border border-pink-300/40 shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-lg mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-pink-950/80 flex items-center justify-center">
              {isUnlocked ? (
                <Unlock className="w-7 h-7 text-pink-300" />
              ) : (
                <Lock className="w-7 h-7 text-pink-300" />
              )}
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-pink-300/90 font-semibold mb-1">
            Top Secret Memory Vault 🔐
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-100 via-rose-200 to-pink-300 bg-clip-text text-transparent">
            {isUnlocked ? "Vault Unlocked! 🎉" : "Only for Harleen's Eyes"}
          </h3>
          <p className="font-hand text-lg sm:text-xl text-pink-200/80 mt-1">
            {isUnlocked
              ? "You solved the secret riddle! Here is your private surprise..."
              : "Answer the inside-joke question below to unlock your secret surprise!"}
          </p>
        </div>

        {/* VAULT CONTENT */}
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* LOCKED STATE FORM */
            <motion.form
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleUnlock}
              className="flex flex-col items-center max-w-md mx-auto w-full gap-4"
            >
              <div className="w-full p-4 rounded-2xl bg-pink-950/40 border border-pink-400/25 text-center">
                <p className="text-sm sm:text-base font-semibold text-pink-100">
                  ❓ &ldquo;{BIRTHDAY_CONFIG.secretVault.question}&rdquo;
                </p>
              </div>

              {/* Input & Button */}
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Type the answer here..."
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-pink-950/50 border border-pink-400/30 text-white placeholder-pink-300/50 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <p className="text-xs text-rose-300 font-medium">{errorMsg}</p>
              )}

              {/* Hint Accordion */}
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-pink-300/80 hover:text-pink-200 underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide hint" : "Need a hint?"}</span>
                </button>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-pink-200/90 font-hand text-base mt-2 bg-pink-500/10 p-2.5 rounded-xl border border-pink-400/20"
                  >
                    💡 Hint: {BIRTHDAY_CONFIG.secretVault.hint}
                  </motion.p>
                )}
              </div>
            </motion.form>
          ) : (
            /* UNLOCKED SURPRISE CARD */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="p-6 rounded-3xl bg-pink-950/60 border border-pink-300/40 w-full max-w-lg shadow-inner">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-pink-300 fill-pink-400 animate-pulse" />
                </div>
                <h4 className="font-serif text-xl font-bold text-pink-100 mb-2">
                  Special Secret Message 💖
                </h4>
                <p className="font-hand text-xl sm:text-2xl text-pink-100/90 leading-relaxed">
                  {BIRTHDAY_CONFIG.secretVault.secretMessage}
                </p>

                {/* Video Reel or Memory Link Placeholder */}
                <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-pink-500/30 flex items-center justify-center gap-3">
                  <Video className="w-5 h-5 text-pink-300" />
                  <span className="text-xs sm:text-sm font-semibold text-pink-200">
                    Secret Video Reel / Playlist unlocked for Harleen!
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setInputAnswer("");
                }}
                className="text-xs text-pink-300/70 hover:text-pink-200 underline"
              >
                🔒 Relock the vault
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
