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
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import SpectrogramVisualizer from './SpectrogramVisualizer';
import Cylinder3D from './Cylinder3D';

export default function WebDashboardView({ 
  percentage = 62.0, 
  onTriggerTap, 
  onExportReport 
}) {
  const [selectedCylinder, setSelectedCylinder] = useState('CYL-01');

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
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                THUMP Fleet Command Console
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                GATEWAY LIVE • 12ms Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Dual-IoT Fleet Gateway • Stock Smartphone 48kHz DSP + ESP32 BLE Load Cell Relay
            </p>
          </div>
        </div>

        {/* Global Quick Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onTriggerTap}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 active:scale-95 transition flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Zap className="w-4 h-4 text-indigo-300 stroke-[2.5]" />
            <span>Simulate Tap Strike</span>
          </button>

          <button
            onClick={onExportReport}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Procurement PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Fleet Overview KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Monitored Cylinders */}
        <div className="pro-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Fleet Units</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900 mono">03</span>
            <span className="text-xs text-slate-500 ml-2 font-medium">Cylinders Active</span>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono text-slate-500">
            <span>Indane • Bharat • HP</span>
            <span className="text-emerald-600 font-bold">100% Synced</span>
          </div>
        </div>

        {/* Card 2: Gas Volume Remaining */}
        <div className="pro-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Total Gas Stock</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="text-3xl font-black text-slate-900 mono">28.4</span>
            <span className="text-xs text-slate-500 ml-1 font-medium">kg Net LPG</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '63%' }} />
          </div>
          <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span>Capacity: 47.4 kg</span>
            <span className="text-slate-900 font-bold">63.1% Full</span>
          </div>
        </div>

        {/* Card 3: Daily Burn Rate */}
        <div className="pro-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Daily Burn Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 mono">0.76</span>
            <span className="text-xs text-slate-500 font-medium">kg / day avg</span>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-500">Month Trend:</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              ↓ 12% Burn (Efficient)
            </span>
          </div>
        </div>

        {/* Card 4: Critical Refill Alerts */}
        <div className="pro-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Procurement Alert</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-600 mono">01</span>
            <span className="text-xs text-slate-600 font-medium">Needs Refill</span>
          </div>
          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono text-slate-500">
            <span>Burner Row #02 (18%)</span>
            <span className="text-amber-700 font-bold">~2 Days Left</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Deck: Cylinder Fleet Selector + Real-time 3D Telemetry Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cylinder Fleet Selector Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono">
              Fleet Cylinders
            </span>
            <span className="text-[10px] font-mono text-slate-400">Click to inspect</span>
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
                      ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-600/10 ring-2 ring-indigo-500/20 scale-[1.01]'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-black text-slate-900 tracking-tight block">
                        {cyl.name}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {cyl.brand} • {cyl.capacity}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                      cyl.status === 'REFILL_ALERT'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {cyl.status === 'REFILL_ALERT' ? '⚠️ Refill Soon' : '✓ Optimal'}
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Fill Level</span>
                      <span className="text-slate-900 font-extrabold">{cyl.level.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cyl.level < 20 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${cyl.level}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2.5 border-t border-slate-100">
                    <span>Burn: <strong className="text-slate-900">{cyl.burn}</strong></span>
                    <span>Remaining: <strong className="text-slate-900">~{cyl.daysLeft} days</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick AI Refill Insights Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-100 space-y-2.5 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-black text-indigo-900 font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Refill Recommendation</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Order a replacement for <strong className="text-slate-900 font-bold">Burner Row #02</strong> by <strong className="text-indigo-900 font-bold underline">Thursday morning</strong> to prevent gas outage during lunch rush.
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
              <div className="pb-3 border-b border-slate-200">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block mb-1">
                  Active Cylinder Telemetry
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {currentCyl.name}
                </h3>
                <span className="text-slate-500 text-xs block mt-0.5 font-medium">
                  ID: {currentCyl.id} • Tare Weight: {currentCyl.tare}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Net Gas Mass:</span>
                  <span className="text-slate-900 font-black text-sm">{netGasKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Total Scale Gross:</span>
                  <span className="text-slate-900 font-black text-sm">{totalWeightKg.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Estimated Depletion:</span>
                  <span className="text-slate-900 font-black text-sm">~{currentCyl.daysLeft} days remaining</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Acoustic Confidence:</span>
                  <span className="text-emerald-700 font-black">91.4% (±6% precision margin)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Last Acoustic Strike:</span>
                  <span className="text-slate-800 font-medium">{currentCyl.lastStrike}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-xs font-medium">Processing Engine:</span>
                <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-[10px]">
                  48kHz FFT + Snapdragon NPU
                </span>
              </div>
            </div>
          </div>

          {/* 48kHz Acoustic Spectrogram Live Waterfall Console */}
          <div className="pro-card p-6 flex flex-col space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  Live Acoustic Spectrogram (48kHz FFT Waterfall)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Real-time resonance frequency distribution during knuckle / shell strike
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                  Centroid: <strong className="text-indigo-600">{centroidHz} Hz</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  Decay Rate τ: 0.71
                </span>
              </div>
            </div>

            {/* Spectrogram Canvas Visualizer */}
            <div className="w-full h-36 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
              <SpectrogramVisualizer active={true} />
              <div className="absolute bottom-2 left-3 text-[10px] mono text-slate-500 font-semibold flex items-center gap-8 pointer-events-none">
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
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              Commercial Fleet Logistics & Procurement Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Live audit telemetry synchronized via local WebSocket IoT Gateway
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onExportReport}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition flex items-center gap-2 shadow-md shadow-slate-900/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Procurement Sheet</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-3">Cylinder Tag</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Tare / Spec</th>
                <th className="py-3 px-3">Acoustic Reading</th>
                <th className="py-3 px-3">Estimated Gas (kg)</th>
                <th className="py-3 px-3">Burn Rate</th>
                <th className="py-3 px-3">Expected Empty</th>
                <th className="py-3 px-3 text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cylinders.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-3 font-bold text-slate-900">{row.id}</td>
                  <td className="py-4 px-3 text-slate-700 font-medium">{row.name}</td>
                  <td className="py-4 px-3 text-slate-500">{row.brand} ({row.capacity})</td>
                  <td className="py-4 px-3 font-black text-slate-900">{row.level.toFixed(1)}%</td>
                  <td className="py-4 px-3 text-slate-900 font-bold">{((row.level / 100) * parseFloat(row.capacity)).toFixed(2)} kg</td>
                  <td className="py-4 px-3 text-slate-500">{row.burn}</td>
                  <td className="py-4 px-3 text-slate-700 font-medium">~{row.daysLeft} days</td>
                  <td className="py-4 px-3 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      row.status === 'REFILL_ALERT'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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
