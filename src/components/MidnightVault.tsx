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
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#fde047", "#fef08a", "#e0a4b8", "#f4c2ce", "#ffffff"],
      });
    } else {
      setErrorMsg("Incorrect secret code! Check the hint or try again 🥺");
    }
  };

  return (
    <section id="vault" className="relative z-10 max-w-3xl mx-auto px-4 py-20">
      <div className="editorial-card p-6 sm:p-10 rounded-3xl border border-amber-300/30 shadow-2xl relative overflow-hidden">
        {/* Ambient Gold Halo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-lg mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#120d18] flex items-center justify-center">
              {isUnlocked ? (
                <Unlock className="w-7 h-7 text-amber-300" />
              ) : (
                <Lock className="w-7 h-7 text-amber-300" />
              )}
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-300/90 font-mono font-semibold mb-1">
            Midnight Vault • Classified
          </span>
          <h3 className="font-serif text-2xl sm:text-4xl font-black bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent">
            {isUnlocked ? "Vault Unlocked ✨" : "For Harleen's Eyes Only"}
          </h3>
          <p className="font-hand text-lg sm:text-xl text-rose-200/80 mt-1 italic">
            {isUnlocked
              ? "You cracked the cipher! Here is your private archive..."
              : "Solve the inside riddle below to unlock a hidden memory."}
          </p>
        </div>

        {/* VAULT BODY */}
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
              <div className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-center">
                <p className="text-sm sm:text-base font-serif font-semibold text-rose-100">
                  &ldquo;{BIRTHDAY_CONFIG.secretVault.question}&rdquo;
                </p>
              </div>

              {/* Input & Button */}
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/70" />
                  <input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    placeholder="Enter the secret code..."
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-black/60 border border-amber-300/30 text-white placeholder-rose-200/40 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(253,224,71,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Decrypt</span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
              )}

              {/* Hint */}
              <div className="mt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? "Hide hint" : "Need a hint?"}</span>
                </button>
                {showHint && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-rose-200/90 font-hand text-base mt-2 bg-white/5 p-2.5 rounded-xl border border-white/10"
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
              <div className="p-6 rounded-3xl bg-black/60 border border-amber-300/30 w-full max-w-lg shadow-inner">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-amber-300 fill-amber-400/50 animate-pulse" />
                </div>
                <h4 className="font-serif text-xl font-bold text-white mb-2">
                  Confidential Note Unlocked 🌙
                </h4>
                <p className="font-hand text-xl sm:text-2xl text-rose-100/90 leading-relaxed">
                  {BIRTHDAY_CONFIG.secretVault.secretMessage}
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3">
                  <Video className="w-5 h-5 text-amber-300" />
                  <span className="text-xs sm:text-sm font-semibold text-rose-200">
                    Cigarettes After Sex • K. Dedicated to Harleen
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setInputAnswer("");
                }}
                className="text-xs text-rose-300/60 hover:text-white underline"
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
