import React from 'react';

export default function Cylinder3D({ percentage = 62, weightKg = 6.20 }) {
  const fillPercent = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex flex-col items-center justify-center relative my-2 select-none">
      {/* Soft Ambient Light Glow behind Cylinder */}
      <div className="absolute w-48 h-64 bg-indigo-500/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="cylinder-tank-pro w-48 h-72 relative flex flex-col justify-between items-center py-5 shadow-2xl">
        
        {/* Specular White Light Reflection Streak */}
        <div className="absolute top-0 left-6 w-3 h-full bg-gradient-to-r from-white/70 to-transparent pointer-events-none z-30 blur-[1px]" />
        <div className="absolute top-0 right-6 w-2 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none z-30 blur-[1px]" />

        {/* Collar / Top Handle */}
        <div className="w-24 h-6 border-2 border-slate-400/80 rounded-t-2xl bg-gradient-to-b from-[#F8FAFC] to-[#CBD5E1] flex items-center justify-center -mt-8 z-20 shadow-md">
          <div className="w-10 h-1.5 bg-slate-400/60 rounded-full shadow-inner" />
        </div>
        
        {/* Vapor Phase Indicator */}
        <div className="z-10 text-center mt-2 opacity-90">
          <span className="text-[9px] font-mono font-bold tracking-widest text-slate-600 uppercase px-3 py-0.5 rounded-full bg-white/80 border border-slate-300 shadow-sm">
            Vapor Phase
          </span>
        </div>

        {/* Dual Wave Animated Azure/Indigo Liquid Layer */}
        <div 
          className="liquid-layer-pro" 
          style={{ height: `${fillPercent}%` }}
        >
          <div className="liquid-wave-back" />
          <div className="liquid-wave-front" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none drop-shadow">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/90 font-mono">
              Liquid LPG (C₃H₈)
            </span>
            <span className="text-2xl font-black mono text-white">
              {weightKg.toFixed(2)} KG
            </span>
          </div>
        </div>
      </div>

      {/* Floating Light Glass Level Pill */}
      <div className="relative -mt-6 px-6 py-2.5 rounded-2xl bg-white/95 border border-slate-200/90 backdrop-blur-xl shadow-xl flex items-center gap-4 z-30">
        <span className="text-3xl font-black mono text-slate-900 tracking-tighter">
          {fillPercent.toFixed(1)}%
        </span>
        <div className="border-l border-slate-200 pl-3.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
            Reading Level
          </span>
          <span className="text-xs font-black text-emerald-600 mono flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            0.76 kg/d
          </span>
        </div>
      </div>
    </div>
  );
}
