"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Key, Sparkles, HelpCircle, Heart, Video } from "lucide-react";
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
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ff758f", "#ff4d6d", "#fbbf24", "#fde047", "#ffffff"],
      });
    } else {
      setErrorMsg("Incorrect secret code! Check the hint or try again 🥺");
    }
  };

  return (
    <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-20">
      <div className="glass-pearl p-6 sm:p-10 rounded-3xl border-2 border-pink-200/80 shadow-xl relative overflow-hidden">
        {/* Ambient Gold Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-lg mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              {isUnlocked ? (
                <Unlock className="w-8 h-8 text-amber-500" />
              ) : (
                <Lock className="w-8 h-8 text-rose-500" />
              )}
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-700 font-mono font-bold mb-1">
            Harleen&apos;s Secret Vault 🔐
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-black text-[#2e1322]">
            {isUnlocked ? "Vault Unlocked! 🎉" : "Only for Harleen's Eyes"}
          </h3>
          <p className="font-hand text-xl sm:text-2xl text-rose-600/90 mt-1">
            {isUnlocked
              ? "You solved the secret riddle! Here is your private tribute..."
              : "Answer the inside-joke question below to unlock your secret surprise!"}
          </p>
        </div>

        {/* FORM / UNLOCKED BODY */}
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.form
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleUnlock}
              className="flex flex-col items-center max-w-md mx-auto w-full gap-4"
            >
              <div className="w-full p-4 rounded-2xl bg-pink-50 border border-pink-200 text-center shadow-xs">
                <p className="text-base font-serif font-bold text-gray-800">
                  ❓ &ldquo;{BIRTHDAY_CONFIG.secretVault.question}&rdquo;
                </p>
              </div>

              {/* Input & Gold Submit Button */}
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Enter the secret code..."
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-pink-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm shadow-[0_4px_18px_rgba(251,191,36,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Unlock</span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
              )}

              {/* Hint */}
              <div className="mt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-semibold underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide hint" : "Need a hint?"}</span>
                </button>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-sm text-gray-700 font-hand text-lg mt-2 bg-amber-50 p-3 rounded-xl border border-amber-200"
                  >
                    💡 Hint: {BIRTHDAY_CONFIG.secretVault.hint}
                  </motion.p>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="p-6 rounded-3xl bg-pink-50 border border-pink-200 w-full max-w-lg shadow-md">
                <div className="w-12 h-12 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-400 animate-pulse" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-rose-900 mb-2">
                  Confidential Note Unlocked 💖
                </h4>
                <p className="font-hand text-2xl text-gray-800 leading-relaxed">
                  {BIRTHDAY_CONFIG.secretVault.secretMessage}
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-white border border-pink-200 flex items-center justify-center gap-3 shadow-xs">
                  <Video className="w-5 h-5 text-amber-500" />
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    Cigarettes After Sex • K. Dedicated to Harleen
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setInputAnswer("");
                }}
                className="text-xs text-gray-500 hover:text-rose-600 underline font-medium"
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
