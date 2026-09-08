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
  AlertTriangle,
  Server,
  FileSpreadsheet,
  Clock,
  ShieldCheck,
  Flame,
  Radio,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';
import SpectrogramVisualizer from './SpectrogramVisualizer';
import Cylinder3D from './Cylinder3D';

export default function WebDashboardView({ 
  percentage = 62.0, 
  onTriggerTap, 
  onExportReport 
}) {
  const [selectedCylinder, setSelectedCylinder] = useState('CYL-01');
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');

  const cylinders = [
    { id: 'CYL-01', name: 'Kitchen Main #01', brand: 'Indane Domestic', capacity: '14.2 kg', tare: '15.3 kg', level: percentage, burn: '0.76 kg/d', daysLeft: 8, status: 'HEALTHY', lastStrike: '2 min ago' },
    { id: 'CYL-02', name: 'Burner Row #02', brand: 'BharatGas Commercial', capacity: '19.0 kg', tare: '17.8 kg', level: 18.2, burn: '1.45 kg/d', daysLeft: 2, status: 'REFILL_ALERT', lastStrike: '18 min ago' },
    { id: 'CYL-03', name: 'Backup Storage #03', brand: 'HP Gas Domestic', capacity: '14.2 kg', tare: '15.1 kg', level: 92.5, burn: '0.00 kg/d', daysLeft: 45, status: 'STANDBY', lastStrike: '3 hours ago' },
  ];

  const currentCyl = cylinders.find(c => c.id === selectedCylinder) || cylinders[0];
  const netGasKg = (currentCyl.level / 100) * parseFloat(currentCyl.capacity);
  const totalWeightKg = parseFloat(currentCyl.tare) + netGasKg;
  const centroidHz = Math.round(2100 + (100 - currentCyl.level) * 12);

  return (
    <div className="w-full flex flex-col gap-8 select-none">
      
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[#0e1014] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl shadow-xl shadow-white/10">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-lg font-black text-white tracking-tight uppercase">
                THUMP Fleet Command Center
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE • 12ms WebSocket Latency
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Dual-IoT Fleet Gateway • Stock Smartphone DSP + ESP32 BLE Hub
            </p>
          </div>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onTriggerTap}
            className="px-4 py-2.5 rounded-2xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 active:scale-95 transition flex items-center gap-2 shadow-xl shadow-white/10"
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>Simulate Acoustic Impulse</span>
          </button>

          <button
            onClick={onExportReport}
            className="px-4 py-2.5 rounded-2xl bg-[#14171d] hover:bg-[#1d2129] border border-white/15 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Fleet PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Fleet Overview KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monitored Cylinders */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Fleet Units</span>
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-white mono">03</span>
            <span className="text-xs text-slate-400 ml-2">Active Cylinders</span>
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Indane • BharatGas • HP</span>
            <span className="text-emerald-400 font-bold">100% Synced</span>
          </div>
        </div>

        {/* Card 2: Gas Volume Remaining */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Total Reserves</span>
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-white mono">28.4</span>
            <span className="text-xs text-slate-400 ml-1">kg Net LPG</span>
          </div>
          <div className="w-full bg-[#1c2027] h-1.5 rounded-full overflow-hidden border border-white/5">
            <div className="bg-white h-full rounded-full" style={{ width: '63%' }} />
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Capacity: 47.4 kg</span>
            <span className="text-white font-bold">63.1% Total</span>
          </div>
        </div>

        {/* Card 3: Daily Burn Rate */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Burn Rate</span>
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white mono">0.76</span>
            <span className="text-xs text-slate-400">kg / day avg</span>
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-400">Month Trend:</span>
            <span className="text-emerald-400 font-bold">↓ 12% Burn</span>
          </div>
        </div>

        {/* Card 4: Critical Refill Alerts */}
        <div className="pro-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Procurement</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-400 mono">01</span>
            <span className="text-xs text-slate-300">Needs Refill</span>
          </div>
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>Burner Row #02 (18%)</span>
            <span className="text-amber-400 font-bold">~2 Days</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Deck: Cylinder Fleet Selector + Real-time 3D Telemetry Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cylinder Fleet Selector Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
              Monitored Cylinders
            </span>
            <span className="text-[10px] font-mono text-slate-500">Select to inspect</span>
          </div>

          <div className="space-y-3">
            {cylinders.map((cyl) => {
              const isSelected = selectedCylinder === cyl.id;
              return (
                <div
                  key={cyl.id}
                  onClick={() => setSelectedCylinder(cyl.id)}
                  className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#14171d] border-white shadow-xl shadow-white/5 scale-[1.01]'
                      : 'bg-[#0e1014] border-white/10 hover:border-white/20 hover:bg-[#12151b]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-white tracking-wide block">
                        {cyl.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cyl.brand} • {cyl.capacity}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase ${
                      cyl.status === 'REFILL_ALERT'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-white/10 text-white border border-white/15'
                    }`}>
                      {cyl.status === 'REFILL_ALERT' ? '⚠️ Refill Soon' : '✓ Optimal'}
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Fill Level</span>
                      <span className="text-white font-bold">{cyl.level.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cyl.level < 20 ? 'bg-amber-400' : 'bg-white'
                        }`}
                        style={{ width: `${cyl.level}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
                    <span>Burn: <strong className="text-white">{cyl.burn}</strong></span>
                    <span>Remaining: <strong className="text-white">~{cyl.daysLeft} days</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick AI Refill Insights Box */}
          <div className="p-5 rounded-3xl bg-[#0e1014] border border-white/10 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-black text-white font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-white" />
              <span>AI Refill Recommendation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Order a replacement for <strong className="text-white font-bold">Burner Row #02</strong> by <strong className="text-white underline">Thursday morning</strong> to maintain uninterrupted kitchen service.
            </p>
          </div>
        </div>

        {/* Right Column: 3D Cylinder Visualizer + Acoustic Spectrogram Telemetry (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Inspection Deck */}
          <div className="pro-card p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* 3D Liquid Canvas */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Cylinder3D 
                percentage={currentCyl.level} 
                weightKg={netGasKg} 
              />
            </div>

            {/* Detailed Telemetry Breakdown Matrix */}
            <div className="w-full md:w-1/2 space-y-4 font-mono text-xs">
              <div className="pb-3 border-b border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Active Cylinder Telemetry
                </span>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {currentCyl.name}
                </h3>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  ID: {currentCyl.id} • Tare: {currentCyl.tare}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Net Gas Mass:</span>
                  <span className="text-white font-bold text-sm">{netGasKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Scale Gross:</span>
                  <span className="text-white font-bold text-sm">{totalWeightKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Days Remaining:</span>
                  <span className="text-white font-bold text-sm">~{currentCyl.daysLeft} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Acoustic Confidence:</span>
                  <span className="text-emerald-400 font-bold">91.4% (±6% margin)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Last Acoustic Strike:</span>
                  <span className="text-slate-200">{currentCyl.lastStrike}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Hardware Pipeline:</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold text-[10px]">
                  DSP + Snapdragon NPU
                </span>
              </div>
            </div>
          </div>

          {/* 48kHz Acoustic Spectrogram Live Waterfall Console */}
          <div className="pro-card p-6 flex flex-col space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                  <Activity className="w-4 h-4 text-white" />
                  Live Acoustic Spectrogram (48kHz FFT Analysis)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Real-time frequency impulse distribution during cylinder shell tap
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-xl bg-[#14171d] border border-white/10 text-white">
                  Centroid: <strong className="text-white font-bold">{centroidHz} Hz</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#14171d] border border-white/10 text-white">
                  Decay τ: <strong className="text-emerald-400 font-bold">0.71</strong>
                </span>
              </div>
            </div>

            {/* Spectrogram Canvas Visualizer */}
            <div className="w-full h-36 bg-[#090A0D] rounded-2xl overflow-hidden border border-white/10 relative shadow-inner">
              <SpectrogramVisualizer active={true} />
              <div className="absolute bottom-2 left-3 text-[10px] mono text-slate-500 flex items-center gap-8 pointer-events-none">
                <span>0 Hz (DC)</span>
                <span>3 kHz</span>
                <span>6 kHz</span>
                <span>12 kHz</span>
                <span>24 kHz (Nyquist)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Inventory Reorder Table */}
      <div className="pro-card p-6 md:p-8 flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
              <FileSpreadsheet className="w-5 h-5 text-white" />
              Commercial Fleet Logistics & Reorder Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Real-time audit log synced via local IoT WebSocket Gateway
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportReport}
              className="px-4 py-2 rounded-2xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition flex items-center gap-2 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Procurement Sheet</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Cylinder Tag</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Tare / Spec</th>
                <th className="pb-3 px-3">Acoustic Reading</th>
                <th className="pb-3 px-3">Estimated Gas (kg)</th>
                <th className="pb-3 px-3">Depletion Rate</th>
                <th className="pb-3 px-3">Expected Empty</th>
                <th className="pb-3 px-3 text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cylinders.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-3 font-bold text-white">{row.id}</td>
                  <td className="py-4 px-3 text-slate-300">{row.name}</td>
                  <td className="py-4 px-3 text-slate-400">{row.brand} ({row.capacity})</td>
                  <td className="py-4 px-3 font-bold text-white">{row.level.toFixed(1)}%</td>
                  <td className="py-4 px-3 text-white">{((row.level / 100) * parseFloat(row.capacity)).toFixed(2)} kg</td>
                  <td className="py-4 px-3 text-slate-400">{row.burn}</td>
                  <td className="py-4 px-3 text-slate-300">~{row.daysLeft} days</td>
                  <td className="py-4 px-3 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      row.status === 'REFILL_ALERT'
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                        : 'bg-white/10 text-slate-300 border border-white/10'
                    }`}>
                      {row.status === 'REFILL_ALERT' ? 'Order Refill Now' : 'Stocked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
