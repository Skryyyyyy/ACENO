import React, { useState } from 'react';
import { 
  ArrowRight
} from 'lucide-react';

export default function OnboardingCarousel({ onComplete, onSkip }) {
  // Current Slide: 1 | 2 | 3
  const [slide, setSlide] = useState(1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#060708] relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/[0.015] rounded-full blur-2xl pointer-events-none" />

      {/* Main Glassmorphic Onboarding Card */}
      <div className="w-full max-w-md bg-[#0e1014] border border-white/10 rounded-[38px] p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 flex flex-col justify-between min-h-[580px]">
        
        {/* ========================================================= */}
        {/* SLIDE 1 (SCREEN 1 - 1/3)                                  */}
        {/* ========================================================= */}
        {slide === 1 && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Indicator: 1/3 */}
            <div className="flex justify-end items-center">
              <span className="text-xs font-mono font-bold text-slate-400">
                1/3
              </span>
            </div>

            {/* Central Content */}
            <div className="my-auto py-6 text-center flex flex-col items-center">
              <h1 className="text-3xl font-black text-white tracking-tight leading-snug">
                Measure without<br />extra hardware.
              </h1>

              {/* Graphic Icon Area: 📱 + ⛽ */}
              <div className="my-8 flex items-center justify-center space-x-4 bg-[#14171d] py-6 px-8 rounded-3xl border border-white/5 shadow-inner">
                <span className="text-4xl">📱</span>
                <span className="text-2xl text-slate-500 font-light">+</span>
                <span className="text-4xl">⛽</span>
              </div>

              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                THUMP uses your phone's microphone and motion sensors to analyze the cylinder's acoustic response.
              </p>

              {/* Dot Pagination: ● ○ ○ */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                <span className="h-2 w-2 rounded-full bg-white transition-all" />
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setSlide(2)}
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={onSkip}
                  className="text-xs font-bold text-slate-500 hover:text-white transition"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SLIDE 2 (SCREEN 2 - 2/3)                                  */}
        {/* ========================================================= */}
        {slide === 2 && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Indicator: 2/3 */}
            <div className="flex justify-end items-center">
              <span className="text-xs font-mono font-bold text-slate-400">
                2/3
              </span>
            </div>

            {/* Central Content */}
            <div className="my-auto py-6 text-center flex flex-col items-center">
              <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
                Calibrate once.<br />Measure anytime.
              </h2>

              {/* Exact ASCII Calibration Graphic: 100% | 50% | 0% */}
              <div className="my-6 w-full max-w-[200px] bg-[#14171d] py-5 px-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black mono text-white">100%</span>
                </div>
                
                <div className="w-0.5 h-6 bg-white/20 my-1" />
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black mono text-white">50%</span>
                </div>

                <div className="w-0.5 h-6 bg-white/20 my-1" />

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black mono text-white">0%</span>
                </div>
              </div>

              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                THUMP learns the acoustic signature of your specific cylinder.
              </p>

              {/* Dot Pagination: ○ ● ○ */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
                <span className="h-2 w-2 rounded-full bg-white transition-all" />
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setSlide(3)}
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <button
                  onClick={onSkip}
                  className="text-xs font-bold text-slate-500 hover:text-white transition"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SLIDE 3 (SCREEN 3 - 3/3) EXACT ASCII WIREFRAME            */}
        {/* ========================================================= */}
        {slide === 3 && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Indicator: 3/3 */}
            <div className="flex justify-end items-center">
              <span className="text-xs font-mono font-bold text-slate-400">
                3/3
              </span>
            </div>

            {/* Central Content */}
            <div className="my-auto py-6 text-center flex flex-col items-center">
              <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
                Track the trend.
              </h2>

              {/* Exact ASCII Trend Graphic: 72% ↓ 54% ↓ 31% */}
              <div className="my-6 w-full max-w-[200px] bg-[#14171d] py-5 px-6 rounded-3xl border border-white/5 shadow-inner flex flex-col items-center">
                <span className="text-xs font-black mono text-white">72%</span>
                <span className="text-slate-500 text-xs my-1 font-mono">↓</span>
                <span className="text-xs font-black mono text-white">54%</span>
                <span className="text-slate-500 text-xs my-1 font-mono">↓</span>
                <span className="text-xs font-black mono text-white">31%</span>
              </div>

              {/* Exact Description text */}
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
                THUMP estimates consumption and helps predict when you'll need a refill.
              </p>

              {/* Exact Dot Pagination: ○ ○ ● */}
              <div className="flex items-center justify-center space-x-2 mt-6">
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
                <span className="h-2 w-2 rounded-full bg-white/20 transition-all" />
                <span className="h-2 w-2 rounded-full bg-white transition-all" />
              </div>
            </div>

            {/* Bottom Actions - Exact 'Start THUMP' Button */}
            <div className="space-y-3 pt-4">
              <button
                onClick={onComplete}
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <span>Start THUMP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
