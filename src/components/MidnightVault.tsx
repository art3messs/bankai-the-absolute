"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, Sparkles, HelpCircle, Heart } from "lucide-react";
import confetti from "canvas-confetti";
import { BIRTHDAY_CONFIG } from "@/data/config";

export default function MidnightVault() {
  const [inputAnswer, setInputAnswer] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputAnswer.trim().toLowerCase();
    const expected = BIRTHDAY_CONFIG.secretVault.answerHash.trim().toLowerCase();

    if (
      cleanInput === expected ||
      cleanInput === "pink" ||
      cleanInput === "harleen" ||
      cleanInput === "16" ||
      cleanInput === "k"
    ) {
      setIsUnlocked(true);
      setErrorMsg("");

      confetti({
        particleCount: 100,
        spread: 95,
        origin: { y: 0.6 },
        colors: ["#d97d93", "#c95874", "#d4af37", "#f3e5ab", "#ffffff"],
      });
    } else {
      setErrorMsg("Incorrect secret code. Check the hint or try again.");
    }
  };

  return (
    <div className="w-full">
      <div className="editorial-card p-6 sm:p-12 rounded-3xl border border-[#d97d93]/35 shadow-xs relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d97d93] via-[#f2ccd6] to-[#d4af37] p-0.5 shadow-md mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {isUnlocked ? (
                <Unlock className="w-7 h-7 text-[#d4af37]" />
              ) : (
                <Lock className="w-7 h-7 text-[#c95874]" />
              )}
            </div>
          </div>

          <h2 className="font-forum text-3xl sm:text-4xl text-[#241e16] uppercase tracking-[0.06em]">
            The Secret Archive
          </h2>
          <p className="font-signature text-2xl text-[#7d7265] mt-2">
            &ldquo;Locked with an intimate memory known only to us.&rdquo;
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
              <div className="w-full p-5 rounded-2xl bg-white border border-[#d97d93]/30 shadow-xs mb-6 text-center">
                <span className="text-[10px] font-raleway tracking-[0.25em] text-[#7d7265] uppercase font-bold block mb-1">
                  SECURITY QUESTION
                </span>
                <p className="font-forum text-lg text-[#241e16] font-normal leading-relaxed">
                  {BIRTHDAY_CONFIG.secretVault.question}
                </p>
              </div>

              {/* Password Input */}
              <div className="w-full relative mb-3">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => {
                    setInputAnswer(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Enter secret answer..."
                  className="w-full px-5 py-3.5 rounded-full bg-white border border-[#d97d93]/40 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none text-center font-raleway text-sm text-[#241e16] placeholder-[#7d7265]/60 transition-all shadow-xs"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-[#c95874] font-raleway font-semibold mb-3">
                  {errorMsg}
                </p>
              )}

              {/* Unlock Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d97d93] via-[#c95874] to-[#d4af37] hover:opacity-95 text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Unlock Secret Archive</span>
              </button>

              {/* Hint Accordion */}
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#7d7265] hover:text-[#241e16] font-raleway font-semibold transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{showHint ? "Hide Hint" : "Need a hint?"}</span>
                </button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3 rounded-xl bg-white border border-[#d97d93]/20 text-xs text-[#7d7265] font-raleway max-w-sm mx-auto"
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
              <div className="w-full p-8 rounded-2xl bg-white border border-[#d4af37]/40 shadow-md">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-[11px] font-raleway tracking-[0.25em] text-[#d4af37] uppercase font-bold">
                    VAULT DECRYPTED
                  </span>
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </div>

                <p className="font-forum text-xl sm:text-2xl text-[#241e16] leading-relaxed font-normal">
                  {BIRTHDAY_CONFIG.secretVault.secretMessage}
                </p>

                <div className="w-16 editorial-rule my-6 mx-auto" />

                <span className="font-signature text-3xl text-[#c95874] block">
                  harleen 4 life 🤍
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
