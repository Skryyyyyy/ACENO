import React from 'react';

export default function Cylinder3D({ percentage = 45, weightKg = 6.39 }) {
  const fillPercent = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex flex-col items-center justify-center relative my-1">
      <div className="cylinder-tank-pro w-44 h-64 relative flex flex-col justify-between items-center py-4">
        
        {/* Collar / Top Handle */}
        <div className="w-20 h-5 border-2 border-slate-600 rounded-t-xl bg-[#1d2129] flex items-center justify-center -mt-6 z-20 shadow-inner">
          <div className="w-8 h-1.5 bg-white/40 rounded-full" />
        </div>
        
        {/* Vapor Phase Indicator */}
        <div className="z-10 text-center mt-3 opacity-40">
          <span className="text-[9px] font-mono tracking-widest text-slate-200 uppercase">
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
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-800/80">
              Liquid LPG
            </span>
            <span className="text-xl font-black mono text-slate-950">
              {weightKg.toFixed(2)} KG
            </span>
          </div>
        </div>
      </div>

      {/* Floating Level Pill */}
      <div className="absolute bottom-2 px-5 py-2 rounded-2xl bg-[#14171d]/90 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-4">
        <span className="text-3xl font-black mono text-white tracking-tighter">
          {fillPercent.toFixed(1)}%
        </span>
        <div className="border-l border-white/10 pl-3">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            Level
          </span>
          <span className="text-xs font-extrabold text-white mono">
            -0.8 kg/d
          </span>
        </div>
      </div>
    </div>
  );
}
