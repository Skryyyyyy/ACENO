import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mic, 
  Scale, 
  Calendar, 
  Activity, 
  TrendingDown, 
  Download, 
  Zap, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  Server,
  FileSpreadsheet
} from 'lucide-react';
import SpectrogramVisualizer from '../components/SpectrogramVisualizer';

export default function WebDashboardView({ 
  percentage, 
  onTriggerTap, 
  onExportReport 
}) {
  const [selectedFleet, setSelectedFleet] = useState('ALL');
  const netGasKg = (percentage / 100) * 14.2;
  const totalScaleKg = 15.5 + netGasKg;
  const centroidHz = Math.round(2100 + (100 - percentage) * 12);

  return (
    <section className="flex flex-col gap-6">
      {/* Top Console Bar */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-white" /> Office Kit // Fleet Console
          </span>
          <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
            LocalHost:8080 (WS Active)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs mono text-slate-400">
          <span className="hidden sm:inline">Telemetry Latency: <strong className="text-white">12ms</strong></span>
        </div>
      </div>

      {/* Top 3-Card KPI Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Acoustic Stream */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Acoustic AI Stream</span>
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white mono">
              {(percentage + 0.2).toFixed(1)}%
            </span>
            <span className="text-xs mono text-slate-400">14.8 ms τ</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500" style={{ width: '88%' }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Confidence Score: <strong className="text-slate-300">88.4% (Tier 1 DSP)</strong>
          </span>
        </div>

        {/* Card 2: IoT Scale Pad Ground Truth */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Ground Truth Scale</span>
            <Scale className="w-4 h-4 text-white" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white mono">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-xs mono text-slate-400">
              {totalScaleKg.toFixed(2)} kg
            </span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500" style={{ width: '100%' }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            ESP32 BLE HX711 Load Cell Broadcast
          </span>
        </div>

        {/* Card 3: Depletion Forecast */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Depletion Forecast</span>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-black text-white mono">Sep 14</span>
            <span className="text-xs mono text-slate-400">06.0 Days</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-white h-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            Auto-reorder trigger in <strong className="text-white">3 days</strong>
          </span>
        </div>
      </div>

      {/* Live Waterfall Spectrogram Canvas */}
      <div className="pro-card p-6 flex flex-col">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-white" /> Live Acoustic Spectrogram (48kHz FFT)
            </h3>
            <p className="text-xs text-slate-400">
              Real-time frequency distribution during impulse tap strike
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs mono text-slate-400">
            <span className="px-3 py-1 rounded-full bg-[#14171d] border border-white/10">
              Centroid: <strong className="text-white">{centroidHz} Hz</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-[#14171d] border border-white/10">
              Window: <strong className="text-white">500ms Gated</strong>
            </span>
          </div>
        </div>

        <div className="w-full h-40 bg-[#090A0C] rounded-2xl overflow-hidden border border-white/10 relative">
          <SpectrogramVisualizer active={true} />
          <div className="absolute bottom-2 left-3 text-[10px] mono text-slate-500 flex items-center gap-6 pointer-events-none">
            <span>0 Hz (DC)</span>
            <span>6 kHz</span>
            <span>12 kHz</span>
            <span>24 kHz (Nyquist)</span>
          </div>
        </div>
      </div>

      {/* Fleet Inventory Matrix */}
      <div className="pro-card p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Fleet Management Grid
            </h3>
            <p className="text-xs text-slate-400">Multi-cylinder overview for commercial cloud kitchens</p>
          </div>
          <button 
            onClick={onExportReport}
            className="px-3.5 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 text-xs font-bold border border-white/15 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Reorder Sheet
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-2">Cylinder ID</th>
                <th className="pb-3 px-2">Location</th>
                <th className="pb-3 px-2">Acoustic</th>
                <th className="pb-3 px-2">BLE Scale</th>
                <th className="pb-3 px-2">Burn Rate</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'IND-9042', loc: 'Kitchen Main', acoustic: '45.2%', scale: '45.0%', burn: '0.8 kg/d', status: 'OPTIMAL' },
                { id: 'IND-8812', loc: 'Burner Row 2', acoustic: '14.1%', scale: '14.0%', burn: '1.2 kg/d', status: 'REORDER_NOW' },
                { id: 'HP-1029', loc: 'Backup Stash', acoustic: '98.5%', scale: '99.0%', burn: '0.0 kg/d', status: 'FULL' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-2 font-bold text-white mono">{row.id}</td>
                  <td className="py-3 px-2 text-slate-300">{row.loc}</td>
                  <td className="py-3 px-2 mono text-white">{row.acoustic}</td>
                  <td className="py-3 px-2 mono text-white">{row.scale}</td>
                  <td className="py-3 px-2 mono text-slate-400">{row.burn}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      row.status === 'REORDER_NOW' ? 'bg-white text-black' : 'bg-white/10 text-white'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
