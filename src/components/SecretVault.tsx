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

    // Check if input matches pucchi
    if (
      cleanInput === expected ||
      cleanInput === "pucchi" ||
      cleanInput === "puchhi" ||
      cleanInput === "puchi"
    ) {
      setIsUnlocked(true);
      setErrorMsg("");

      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#ff758f", "#ffb3c1", "#ff4d6d", "#ffe3a8", "#ffffff"],
      });
    } else {
      setErrorMsg("Incorrect secret word! Hint: the sweetest little word... 🥺");
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

          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 dark:text-pink-100 font-bold tracking-wide">
            The Secret Archive
          </h2>
          <p className="font-handwriting text-2xl text-pink-600 dark:text-pink-300 mt-2">
            Locked with our secret password: &ldquo;pucchi&rdquo; 🔐
          </p>
        </div>

        {/* VAULT CONTENT */}
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.form
              key="locked-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleUnlock}
              className="flex flex-col items-center max-w-md mx-auto"
            >
              {/* Question */}
              <div className="w-full p-5 rounded-2xl bg-white/70 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-500/20 shadow-sm mb-6 text-center">
                <span className="text-[11px] font-sans tracking-widest text-pink-600 dark:text-pink-400 font-semibold uppercase block mb-1">
                  SECURITY QUESTION
                </span>
                <p className="font-serif text-lg text-neutral-800 dark:text-pink-200">
                  {BIRTHDAY_CONFIG.secretVault.question}
                </p>
              </div>

              {/* Password Input */}
              <div className="w-full relative mb-4">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => {
                    setInputAnswer(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder='Enter secret answer (e.g. "pucchi")...'
                  className="w-full px-5 py-3.5 rounded-full bg-white/80 dark:bg-pink-950/50 border border-pink-300/60 dark:border-pink-500/30 focus:border-pink-500 focus:ring-2 focus:ring-pink-400/30 outline-none text-center font-sans text-sm text-neutral-800 dark:text-pink-100 placeholder-neutral-400 dark:placeholder-pink-400/40 transition-all shadow-inner"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-sans font-medium mb-3">
                  {errorMsg}
                </p>
              )}

              {/* Unlock Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 hover:opacity-95 text-white font-sans font-semibold text-sm tracking-wider shadow-lg shadow-pink-500/25 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Secret Archive</span>
              </button>

              {/* Hint */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-pink-600 dark:text-pink-400 hover:underline font-sans font-medium"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide Hint" : "Need a hint?"}</span>
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 p-3 rounded-xl bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200/50 dark:border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 font-sans"
                  >
                    💡 {BIRTHDAY_CONFIG.secretVault.hint}
                  </motion.div>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="unlocked-content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center max-w-lg mx-auto"
            >
              <div className="w-full p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-pink-950/50 border border-pink-300/60 dark:border-pink-500/30 shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-sans tracking-widest text-pink-600 dark:text-pink-400 font-bold uppercase">
                    VAULT DECRYPTED
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>

                <p className="font-serif text-xl sm:text-2xl text-neutral-800 dark:text-pink-100 leading-relaxed">
                  {BIRTHDAY_CONFIG.secretVault.secretMessage}
                </p>

                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent my-6 mx-auto" />

                <span className="font-handwriting text-3xl text-pink-500 dark:text-pink-400 block">
                  harleen 4 life 🤍
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
