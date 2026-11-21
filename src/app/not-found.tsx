"use client";

import Link from "next/link";
import { Sparkles, Heart, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8F5] text-[#3A1F2B] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-white/95 p-8 sm:p-12 rounded-3xl border-2 border-[#FFD9E3] shadow-[0_20px_60px_rgba(176,41,95,0.1)] flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#FFD9E3] flex items-center justify-center text-[#B0295F] mb-4">
          <Heart className="w-7 h-7 fill-[#B0295F]" />
        </div>

        <span className="text-[10px] font-raleway font-bold uppercase tracking-[0.28em] text-[#B0295F] mb-1">
          LOST IN PARADISE • 404
        </span>

        <h1 className="font-forum text-3xl sm:text-4xl uppercase tracking-wider text-[#3A1F2B] my-2">
          Page Not Found
        </h1>

        <p className="font-signature text-2xl text-[#B0295F] mb-6">
          &ldquo;Even if you wander off, every path in this universe leads back to you, Harleen.&rdquo;
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 min-h-[44px] rounded-full bg-[#B0295F] hover:bg-[#8F1D4B] text-white font-raleway font-bold text-xs uppercase tracking-[0.2em] shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Your Celebration</span>
        </Link>
      </div>
    </div>
  );
}
