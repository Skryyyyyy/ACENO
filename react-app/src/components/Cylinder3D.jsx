import React from 'react';

export default function Cylinder3D({ percentage = 62, weightKg = 6.20 }) {
  const fillPercent = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex flex-col items-center justify-center relative my-2 select-none">
      {/* Ambient Glow behind Cylinder */}
      <div className="absolute w-40 h-56 bg-white/[0.04] rounded-full blur-2xl pointer-events-none" />

      <div className="cylinder-tank-pro w-48 h-72 relative flex flex-col justify-between items-center py-5 shadow-2xl">
        
        {/* Specular Light Reflection Streak */}
        <div className="absolute top-0 left-6 w-3 h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none z-30 blur-[1px]" />
        <div className="absolute top-0 right-6 w-2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-30 blur-[1px]" />

        {/* Collar / Top Handle */}
        <div className="w-24 h-6 border-2 border-slate-600/80 rounded-t-2xl bg-gradient-to-b from-[#242933] to-[#12151a] flex items-center justify-center -mt-8 z-20 shadow-xl">
          <div className="w-10 h-1.5 bg-white/50 rounded-full shadow-inner" />
        </div>
        
        {/* Vapor Phase Indicator */}
        <div className="z-10 text-center mt-2 opacity-60">
          <span className="text-[9px] font-mono tracking-widest text-slate-300 uppercase px-2.5 py-0.5 rounded-full bg-black/40 border border-white/5">
            Vapor Phase
          </span>
        </div>

        {/* Dual Wave Animated Liquid Layer */}
        <div 
          className="liquid-layer-pro" 
          style={{ height: `${fillPercent}%` }}
        >
          <div className="liquid-wave-back" />
          <div className="liquid-wave-front" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 pointer-events-none">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-800/90 font-mono">
              Liquid LPG (C₃H₈)
            </span>
            <span className="text-2xl font-black mono text-slate-950 drop-shadow-sm">
              {weightKg.toFixed(2)} KG
            </span>
          </div>
        </div>
      </div>

      {/* Floating Glass Level Pill */}
      <div className="relative -mt-6 px-6 py-2.5 rounded-2xl bg-[#14171d]/95 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-4 z-30">
        <span className="text-3xl font-black mono text-white tracking-tighter">
          {fillPercent.toFixed(1)}%
        </span>
        <div className="border-l border-white/15 pl-3.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            Reading Level
          </span>
          <span className="text-xs font-black text-emerald-400 mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            0.76 kg/d
          </span>
        </div>
      </div>
    </div>
  );
}
