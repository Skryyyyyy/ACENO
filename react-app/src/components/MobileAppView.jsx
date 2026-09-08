import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  Bell,
  Mic, 
  Scale, 
  Hand, 
  ChevronDown, 
  Sliders, 
  History, 
  QrCode, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  Sparkles,
  Home,
  Flame,
  Bot,
  Plus,
  ArrowLeft,
  Check,
  Camera,
  AlertTriangle,
  Brain,
  Edit3,
  X,
  CheckCircle2,
  HelpCircle,
  FlaskConical,
  MoreVertical,
  Cloud,
  CloudOff,
  RefreshCw,
  User,
  Settings as SettingsIcon,
  ChevronRight,
  LogOut
} from 'lucide-react';
import Cylinder3D from '../components/Cylinder3D';

export default function MobileAppView({ 
  percentage = 62.0, 
  onTriggerTap, 
  method, 
  onMethodChange,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'CYLINDERS' | 'HISTORY' | 'AI' | 'PROFILE' | 'SETTINGS' | 'NOTIFICATIONS' | 'NOTIFICATION_SETTINGS' | 'PRIVACY_SETTINGS' | 'HELP_GUIDE' | 'MEASURE_ERROR' | 'ABOUT_THUMP' | 'ADD_CYLINDER' | 'ENTER_MANUALLY' | 'SCAN_CAMERA' | 'SCAN_SUCCESS' | 'CALIBRATION_INTRO' | 'CALIBRATION_FULL' | 'CALIBRATION_EMPTY' | 'CALIBRATION_SUCCESS' | 'MEASURE_SELECT' | 'MEASURE_POSITION' | 'MEASURE_TAP' | 'MEASURE_BAD_TAP' | 'MEASURE_ANALYSIS' | 'MEASURE_RESULT' | 'ASK_THUMP' | 'CONSUMPTION_DETAILS' | 'OFFLINE_MODE' | 'SYNC_STATUS'
  const [isCalibrated, setIsCalibrated] = useState(true);
  const [selectedCylinderForMeasure, setSelectedCylinderForMeasure] = useState('Kitchen');
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

  // Notification Settings Toggles
  const [notifLowGas, setNotifLowGas] = useState(true);
  const [notifRefillPrediction, setNotifRefillPrediction] = useState(true);
  const [notifAnomaly, setNotifAnomaly] = useState(true);
  const [notifSyncComplete, setNotifSyncComplete] = useState(false);
  const [notifWeeklySummary, setNotifWeeklySummary] = useState(true);
  const [notifThreshold, setNotifThreshold] = useState('20%');

  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [spokenResponse, setSpokenResponse] = useState(true);
  const [voiceQuery, setVoiceQuery] = useState('refill');

  // Manual entry form state
  const [manualName, setManualName] = useState('Kitchen');
  const [manualId, setManualId] = useState('ABC12345');
  const [manualCapacity, setManualCapacity] = useState('14.2 kg');
  const [manualTare, setManualTare] = useState('15.3 kg');

  const [calibFullTaps, setCalibFullTaps] = useState(0);
  const [calibEmptyTaps, setCalibEmptyTaps] = useState(0);
  const [calibTapFeedback, setCalibTapFeedback] = useState(false);

  // Measurement states
  const [measureTaps, setMeasureTaps] = useState(0);
  const [tapStrength, setTapStrength] = useState(82);
  const [tapHapticFlash, setTapHapticFlash] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleMeasureTap = () => {
    setTapHapticFlash(true);
    setTimeout(() => setTapHapticFlash(false), 200);
    if (onTriggerTap) onTriggerTap();

    // Randomize strength slightly around 80-92%
    const strength = Math.floor(75 + Math.random() * 20);
    setTapStrength(strength);

    if (measureTaps < 4) {
      setMeasureTaps(prev => prev + 1);
    } else {
      setMeasureTaps(5);
      setTimeout(() => {
        startAnalysis();
      }, 500);
    }
  };

  const handleSimulateBadTap = () => {
    setActiveTab('MEASURE_BAD_TAP');
  };

  const startAnalysis = () => {
    setActiveTab('MEASURE_ANALYSIS');
    setAnalysisStep(1);
    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);
    setTimeout(() => setAnalysisStep(4), 1500);
    setTimeout(() => setAnalysisStep(5), 2000);
    setTimeout(() => setAnalysisStep(6), 2500);
    setTimeout(() => {
      setActiveTab('MEASURE_RESULT');
    }, 3000);
  };

  const resetMeasurement = () => {
    setMeasureTaps(0);
    setAnalysisStep(0);
  };

  const handleFullTap = () => {
    setCalibTapFeedback(true);
    setTimeout(() => setCalibTapFeedback(false), 200);
    if (onTriggerTap) onTriggerTap();
    if (calibFullTaps < 2) {
      setCalibFullTaps(prev => prev + 1);
    } else {
      setCalibFullTaps(3);
      setTimeout(() => {
        setActiveTab('CALIBRATION_EMPTY');
      }, 500);
    }
  };

  const handleEmptyTap = () => {
    setCalibTapFeedback(true);
    setTimeout(() => setCalibTapFeedback(false), 200);
    if (onTriggerTap) onTriggerTap();
    if (calibEmptyTaps < 2) {
      setCalibEmptyTaps(prev => prev + 1);
    } else {
      setCalibEmptyTaps(3);
      setTimeout(() => {
        setIsCalibrated(true);
        setActiveTab('CALIBRATION_SUCCESS');
      }, 500);
    }
  };

  const resetCalibration = () => {
    setCalibFullTaps(0);
    setCalibEmptyTaps(0);
  };

  const displayPercent = percentage || 62.0;
  const netGasKg = (displayPercent / 100) * 14.2;
  const daysLeft = Math.round((displayPercent / 100) * 13);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="w-full flex justify-between items-center mb-3 px-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" /> iQOO Light Luxury Mobile
        </span>
        <span className="text-xs mono text-slate-500">Snapdragon NPU • 120Hz</span>
      </div>

      {/* Phone Mockup Frame */}
      <div className="phone-mockup relative flex flex-col overflow-hidden bg-[#F8FAFC]">
        
        {/* Dynamic Island Status Bar */}
        <div className="px-7 pt-3 pb-2 flex justify-between items-center text-xs font-semibold text-slate-500">
          <span className="mono">09:41</span>
          <div className="w-28 h-6 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center space-x-1.5 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-mono text-slate-900 tracking-widest">THUMP OS</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Dynamic Screen Area based on active tab */}
        <div className="flex-1 flex flex-col px-6 py-3 justify-between overflow-y-auto">
          
          {/* ========================================================= */}
          {/* SCREEN 9: 🏠 HOME — MAIN DASHBOARD                        */}
          {/* ========================================================= */}
          {activeTab === 'HOME' && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Header: THUMP 🔔 | Good evening, Bala */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-black mono text-slate-900 tracking-widest">
                    THUMP
                  </span>
                  <button 
                    onClick={() => setActiveTab('NOTIFICATIONS')}
                    className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-900 hover:bg-white/10 transition relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white" />
                  </button>
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Good evening, Bala
                    </h2>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-white/10 border border-slate-300 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider">
                      {isCalibrated ? 'Calibrated' : 'Needs Tap'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD 1: YOUR CYLINDER */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  YOUR CYLINDER
                </span>

                <div className="text-center my-2">
                  <span className="text-5xl font-black text-slate-900 mono tracking-tighter">
                    {Math.round(displayPercent)}%
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                    GAS REMAINING
                  </span>
                </div>

                {/* Progress Bar: ████████████░░░░ */}
                <div className="w-full bg-slate-100 h-3 rounded-full my-4 overflow-hidden border border-slate-200 p-0.5">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-700"
                    style={{ width: `${displayPercent}%` }}
                  />
                </div>

                {/* Meta details */}
                <div className="space-y-1 my-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700 font-medium">
                    <span>~{netGasKg.toFixed(1)} kg remaining</span>
                    <span className="mono text-slate-900 font-bold">~{daysLeft} days left</span>
                  </div>
                </div>

                {/* Reading Healthy */}
                <div className="pt-3 border-t border-slate-200 flex items-center space-x-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  <span className="text-slate-900 font-semibold text-[11px]">Reading healthy</span>
                </div>
              </div>

              {/* CARD 2: AI INSIGHT */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-1">
                  AI INSIGHT
                </span>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      You're using gas 12% slower than usual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact '+ MEASURE' Button */}
              <button
                onClick={() => setActiveTab('MEASURE_SELECT')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <Plus className="w-4 h-4" />
                <span>+ MEASURE</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 10: 🔔 NOTIFICATIONS                                */}
          {/* ========================================================= */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {/* Header: ← Notifications ✓ */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <h2 className="text-base font-black text-slate-900">Notifications</h2>

                  <button
                    onClick={() => alert('Marked all as read')}
                    className="p-2 -mr-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                    title="Mark all read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>

                {/* Section: TODAY */}
                <div className="mb-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                    TODAY
                  </span>

                  <div className="space-y-2.5">
                    {/* Item 1: ⚠️ Refill approaching */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center space-x-2 text-slate-900 text-xs font-bold mb-0.5">
                        <span className="text-amber-600">⚠️</span>
                        <span>Refill approaching</span>
                      </div>
                      <p className="text-xs text-slate-700">Cylinder 01 is at 18%.</p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">2 hours ago</span>
                    </div>

                    {/* Item 2: ✓ Measurement synced */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center space-x-2 text-slate-900 text-xs font-bold mb-0.5">
                        <span className="text-slate-900">✓</span>
                        <span>Measurement synced</span>
                      </div>
                      <p className="text-xs text-slate-700">Cylinder 01 → 62%</p>
                      <span className="text-[10px] text-slate-500 font-mono block mt-1">5 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Section: YESTERDAY */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                    YESTERDAY
                  </span>

                  {/* Item 3: 🧠 Usage anomaly */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-900 text-xs font-bold mb-0.5">
                      <span>🧠</span>
                      <span>Usage anomaly</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Consumption was 27% above your usual rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 11: ⛽ CYLINDERS (Exact Matching Wireframe)         */}
          {/* ========================================================= */}
          {activeTab === 'CYLINDERS' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {/* Header: Cylinders ＋ */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Cylinders</h2>
                  <button
                    onClick={() => setActiveTab('ADD_CYLINDER')}
                    className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-200 hover:bg-slate-200 transition"
                    title="Add Cylinder"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3 px-1">
                  2 CYLINDERS
                </span>

                <div className="space-y-3">
                  {/* Card 1: ⛽ Kitchen */}
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xl">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">⛽</span>
                        <span className="text-sm font-bold text-slate-900">Kitchen</span>
                      </div>
                      <span className="text-sm font-black mono text-slate-900">62%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full my-3 overflow-hidden border border-slate-200 p-0.5">
                      <div className="bg-white h-full rounded-full" style={{ width: '62%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                      <span className="font-semibold text-slate-700">~8 days remaining</span>
                      <span className="text-[10px]">Last checked: 2h ago</span>
                    </div>
                  </div>

                  {/* Card 2: ⛽ Backup */}
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xl">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">⛽</span>
                        <span className="text-sm font-bold text-slate-900">Backup</span>
                      </div>
                      <span className="text-sm font-black mono text-slate-900">18%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full my-3 overflow-hidden border border-slate-200 p-0.5">
                      <div className="bg-white h-full rounded-full" style={{ width: '18%' }} />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        ⚠️ Refill soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('ADD_CYLINDER')}
                className="w-full py-3.5 rounded-2xl bg-white/10 text-slate-900 font-bold text-xs hover:bg-white/20 transition border border-slate-200 mt-4"
              >
                + Register New Cylinder
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 12: ➕ ADD CYLINDER                                 */}
          {/* ========================================================= */}
          {activeTab === 'ADD_CYLINDER' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {/* Header: ← Add Cylinder */}
                <div className="flex items-center space-x-3 mb-6">
                  <button
                    onClick={() => setActiveTab('CYLINDERS')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Add Cylinder</h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Identify your cylinder
                  </h3>
                </div>

                {/* Main Action 1: 📷 Scan Label */}
                <div 
                  onClick={() => setActiveTab('SCAN_CAMERA')}
                  className="bg-white border-2 border-dashed border-slate-300 hover:border-white rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition shadow-xl group my-4"
                >
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 text-3xl mb-3 group-hover:scale-110 transition">
                    📷
                  </div>
                  <span className="text-base font-bold text-slate-900 tracking-tight">
                    Scan Label
                  </span>
                </div>

                {/* OR Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative px-3 bg-[#F8FAFC] text-xs font-bold text-slate-500 uppercase tracking-widest">
                    OR
                  </span>
                </div>

                {/* Main Action 2: Enter Manually Button */}
                <button
                  onClick={() => setActiveTab('ENTER_MANUALLY')}
                  className="w-full py-4 rounded-2xl bg-slate-50 hover:bg-[#181B20] border border-slate-200 text-slate-900 font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Enter Manually</span>
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-[11px] text-slate-500">
                  THUMP uses the cylinder ID to keep readings separate.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 13: 📷 SCAN CYLINDER (CAMERA SCREEN)                */}
          {/* ========================================================= */}
          {activeTab === 'SCAN_CAMERA' && (
            <div className="flex-1 flex flex-col justify-between py-1 relative">
              <div>
                {/* Header: × Scan Cylinder */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setActiveTab('ADD_CYLINDER')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Scan Cylinder</h2>
                  <div className="w-8" />
                </div>

                {/* Camera Viewfinder Box matching exact wireframe */}
                <div className="my-6 flex flex-col items-center justify-center">
                  <div className="w-60 h-64 border-2 border-slate-300 rounded-3xl relative bg-slate-100/80 flex flex-col items-center justify-center p-4 shadow-2xl backdrop-blur-sm">
                    {/* Corner Guides */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white" />

                    <div className="text-center space-y-1">
                      <span className="text-xs font-black tracking-widest text-slate-900 uppercase block">
                        POSITION
                      </span>
                      <span className="text-xs font-black tracking-widest text-slate-900 uppercase block">
                        LABEL
                      </span>
                      <span className="text-xs font-black tracking-widest text-slate-900 uppercase block">
                        HERE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center px-4">
                  <p className="text-xs font-medium text-slate-700">
                    Align the cylinder label inside the frame.
                  </p>
                </div>
              </div>

              {/* Exact ◉ Shutter Button */}
              <div className="flex justify-center pt-4 pb-2">
                <button
                  onClick={() => setActiveTab('SCAN_SUCCESS')}
                  className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 active:scale-95 transition"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-black font-black text-lg">
                    ◉
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 13 (THEN): CYLINDER DETECTED SUCCESS STATE          */}
          {activeTab === 'SCAN_SUCCESS' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={() => setActiveTab('SCAN_CAMERA')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Detection Result</h2>
                  <div className="w-8" />
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 my-4">
                  <div className="flex items-center space-x-2 text-slate-900 font-black text-lg">
                    <span>Cylinder detected</span>
                    <span className="text-emerald-600">✓</span>
                  </div>

                  <div className="space-y-2 text-xs border-t border-slate-200 pt-4 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID:</span>
                      <span className="text-slate-900 font-bold">ABC12345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type:</span>
                      <span className="text-slate-900 font-bold">Domestic LPG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacity:</span>
                      <span className="text-slate-900 font-bold">14.2 kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact [ Add Cylinder ] Button */}
              <button
                onClick={() => {
                  alert('Cylinder ABC12345 registered! Navigating to Calibration.');
                  setActiveTab('CALIBRATION_INTRO');
                }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                <span>Add Cylinder</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 14: 📝 MANUAL CYLINDER ENTRY (Exact Wireframe)      */}
          {/* ========================================================= */}
          {activeTab === 'ENTER_MANUALLY' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                {/* Header: ← Cylinder Details */}
                <div className="flex items-center space-x-3 mb-6">
                  <button
                    onClick={() => setActiveTab('ADD_CYLINDER')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Cylinder Details</h2>
                </div>

                <div className="space-y-4">
                  {/* Field 1: Cylinder name */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Cylinder name
                    </label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition font-medium"
                    />
                  </div>

                  {/* Field 2: Cylinder ID */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Cylinder ID
                    </label>
                    <input
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition font-mono font-bold"
                    />
                  </div>

                  {/* Field 3: LPG capacity */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      LPG capacity
                    </label>
                    <input
                      type="text"
                      value={manualCapacity}
                      onChange={(e) => setManualCapacity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition font-medium"
                    />
                  </div>

                  {/* Field 4: Tare weight */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Tare weight
                    </label>
                    <input
                      type="text"
                      value={manualTare}
                      onChange={(e) => setManualTare(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Exact [ Save Cylinder ] Button */}
              <button
                onClick={() => {
                  alert(`Cylinder ${manualName} (${manualId}) Saved!`);
                  setActiveTab('CALIBRATION_INTRO');
                }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                <span>Save Cylinder</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 15: 🧪 CALIBRATION INTRO                            */}
          {/* ========================================================= */}
          {activeTab === 'CALIBRATION_INTRO' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveTab('CYLINDERS')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Calibrate Cylinder</h2>
                  <div className="w-8" />
                </div>

                <span className="text-xs text-slate-500 block px-1 mb-4 font-mono">
                  Cylinder: <strong className="text-slate-900">Kitchen</strong>
                </span>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Calibration improves accuracy for this specific cylinder.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-900 block">You'll record:</span>
                    <div className="space-y-1.5 pl-1">
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-slate-900 flex items-center justify-center text-[11px] font-bold">1</span>
                        <span>Known FULL</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-slate-900 flex items-center justify-center text-[11px] font-bold">2</span>
                        <span>Known EMPTY</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal pt-1">
                    Optional: intermediate calibration points.
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Estimated time:</span>
                    <span className="text-slate-900 font-mono font-bold">2 min</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  resetCalibration();
                  setActiveTab('CALIBRATION_FULL');
                }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                <span>Start Calibration</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 16: 🎯 CALIBRATION — FULL (Step 1/2)                 */}
          {/* ========================================================= */}
          {activeTab === 'CALIBRATION_FULL' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Calibration 1/2 */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setActiveTab('CALIBRATION_INTRO')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-700">Calibration</h2>
                  <span className="text-xs font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-white/10">1/2</span>
                </div>

                <div className="text-center my-2">
                  <h3 className="text-base font-black text-slate-900 tracking-wider">KNOWN FULL</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Confirm the cylinder is known to be full.</p>
                </div>

                {/* Cylinder Graphic with Lower Shell highlight */}
                <div className="my-4 py-4 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="relative w-20 h-28 border-2 border-slate-600 rounded-t-2xl rounded-b-xl flex flex-col justify-end p-1">
                    {/* Valve */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 border border-slate-600 rounded-t-sm" />
                    {/* Fill */}
                    <div className="w-full h-full bg-white/20 rounded-b-lg relative overflow-hidden flex items-end">
                      <div className="w-full h-1/3 bg-white/40 animate-pulse border-t border-white" />
                    </div>
                    {/* Target Pin */}
                    <div className="absolute bottom-3 -right-6 flex items-center gap-1">
                      <span className="text-[10px] text-slate-900 font-mono bg-white/20 px-1 rounded">TAP HERE</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-700 mt-4 font-medium">Position phone against the lower shell.</span>
                </div>

                {/* Status Checks */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Contact</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> GOOD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Orientation</span>
                    <span className="text-slate-900 font-bold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-slate-900" /> OK
                    </span>
                  </div>
                </div>
              </div>

              {/* TAP ACTION & COUNTER */}
              <div className="space-y-2">
                <button
                  onClick={handleFullTap}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
                    calibTapFeedback 
                      ? 'bg-emerald-600 text-black shadow-emerald-400/20' 
                      : 'bg-slate-900 text-white hover:bg-slate-200 hover:bg-slate-200 shadow-white/5'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>[ TAP ]</span>
                </button>
                <div className="text-center">
                  <span className="text-xs text-slate-500 block font-medium">Tap 3 times</span>
                  <span className="text-sm text-slate-900 font-mono font-black">{calibFullTaps} / 3</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 17: 🎯 CALIBRATION — EMPTY (Step 2/2)                */}
          {/* ========================================================= */}
          {activeTab === 'CALIBRATION_EMPTY' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Calibration 2/2 */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setActiveTab('CALIBRATION_FULL')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-700">Calibration</h2>
                  <span className="text-xs font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-white/10">2/2</span>
                </div>

                <div className="text-center my-2">
                  <h3 className="text-base font-black text-slate-900 tracking-wider">KNOWN EMPTY</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Confirm the cylinder upper shell reference.</p>
                </div>

                {/* Cylinder Graphic with Upper Shell highlight */}
                <div className="my-4 py-4 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="relative w-20 h-28 border-2 border-slate-600 rounded-t-2xl rounded-b-xl flex flex-col justify-start p-1">
                    {/* Valve */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 border border-slate-600 rounded-t-sm" />
                    {/* Top Region highlight */}
                    <div className="w-full h-1/3 bg-white/40 animate-pulse border-b border-white rounded-t-lg" />
                    {/* Target Pin */}
                    <div className="absolute top-3 -right-6 flex items-center gap-1">
                      <span className="text-[10px] text-slate-900 font-mono bg-white/20 px-1 rounded">TAP HERE</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-700 mt-4 font-medium">Position phone against the upper shell.</span>
                </div>

                {/* Status Checks */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Contact</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> GOOD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Orientation</span>
                    <span className="text-slate-900 font-bold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-slate-900" /> OK
                    </span>
                  </div>
                </div>
              </div>

              {/* TAP ACTION & COUNTER */}
              <div className="space-y-2">
                <button
                  onClick={handleEmptyTap}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
                    calibTapFeedback 
                      ? 'bg-emerald-600 text-black shadow-emerald-400/20' 
                      : 'bg-slate-900 text-white hover:bg-slate-200 hover:bg-slate-200 shadow-white/5'
                  }`}
                >
                  <Hand className="w-4 h-4" />
                  <span>[ TAP ]</span>
                </button>
                <div className="text-center">
                  <span className="text-xs text-slate-500 block font-medium">Tap 3 times</span>
                  <span className="text-sm text-slate-900 font-mono font-black">{calibEmptyTaps} / 3</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 18: 🏆 CALIBRATION RESULT                            */}
          {/* ========================================================= */}
          {activeTab === 'CALIBRATION_SUCCESS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-black text-slate-900">Calibration Complete ✓</h2>
                  <div className="w-4" />
                </div>

                <span className="text-xs text-slate-500 block px-1 mb-4 font-mono">
                  Cylinder: <strong className="text-slate-900">Kitchen</strong>
                </span>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
                  {/* Signatures Verified */}
                  <div className="space-y-2 pb-2 border-b border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium">FULL signature</span>
                      <span className="text-slate-900 font-bold font-mono">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-700 font-medium">EMPTY signature</span>
                      <span className="text-slate-900 font-bold font-mono">✓</span>
                    </div>
                  </div>

                  {/* Calibration Quality Progress */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-500">Calibration quality</span>
                      <span className="text-slate-900 font-bold font-mono">91%</span>
                    </div>
                    {/* ASCII Style High-Contrast Monochromatic Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-200">
                      <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: '91%' }} />
                    </div>
                  </div>

                  {/* Ready text */}
                  <div className="pt-2">
                    <p className="text-xs text-slate-900 font-bold">Your cylinder is ready.</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Measurements will use this cylinder-specific baseline.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('MEASURE_SELECT')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                <span>Measure Cylinder</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 19: 🎯 MEASURE — SELECT CYLINDER                    */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_SELECT' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Measure */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Measure</h2>
                  <div className="w-8" />
                </div>

                <span className="text-xs text-slate-500 block px-1 mb-4 font-medium">
                  Select cylinder
                </span>

                {/* Cylinder Selection Cards */}
                <div className="space-y-3">
                  {/* Option 1: Kitchen */}
                  <div
                    onClick={() => setSelectedCylinderForMeasure('Kitchen')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedCylinderForMeasure === 'Kitchen'
                        ? 'bg-[#181c24] border-white text-slate-900 shadow-lg'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedCylinderForMeasure === 'Kitchen' ? 'border-white bg-white' : 'border-slate-500'
                      }`}>
                        {selectedCylinderForMeasure === 'Kitchen' && (
                          <div className="w-2 h-2 rounded-full bg-black" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-900 block">Kitchen</span>
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                          62% • calibrated ✓
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Backup */}
                  <div
                    onClick={() => setSelectedCylinderForMeasure('Backup')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedCylinderForMeasure === 'Backup'
                        ? 'bg-[#181c24] border-white text-slate-900 shadow-lg'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedCylinderForMeasure === 'Backup' ? 'border-white bg-white' : 'border-slate-500'
                      }`}>
                        {selectedCylinderForMeasure === 'Backup' && (
                          <div className="w-2 h-2 rounded-full bg-black" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-900 block">Backup</span>
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                          18% • calibrated ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Start THUMP */}
              <button
                onClick={() => setActiveTab('MEASURE_POSITION')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                <span>Start THUMP</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 20: 📱 MEASURE — POSITION (Step 1 of 3)              */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* SCREEN 20: 📱 MEASURE — POSITION (Step 1 of 3)              */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_POSITION' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: × THUMP */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('MEASURE_SELECT')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase">THUMP</h2>
                  <div className="w-8" />
                </div>

                <div className="text-center my-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                    STEP 1 OF 3
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-wide">POSITION PHONE</h3>
                </div>

                {/* ASCII / Monochromatic Phone-on-Cylinder Visual */}
                <div className="my-3 py-4 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center relative">
                  <div className="flex flex-col items-center">
                    {/* Phone Icon top indicator */}
                    <div className="w-7 h-11 border-2 border-white rounded-md flex flex-col items-center justify-between p-0.5 bg-black shadow-lg">
                      <div className="w-2 h-0.5 bg-white/40 rounded-full" />
                      <span className="text-[6px] font-mono text-slate-900 font-bold">📱</span>
                      <div className="w-1.5 h-1.5 rounded-full border border-white/40" />
                    </div>

                    <div className="w-0.5 h-4 bg-white/40 my-0.5" />

                    {/* Cylinder Frame */}
                    <div className="w-20 h-24 border-2 border-slate-500 rounded-t-2xl rounded-b-xl flex flex-col items-center justify-center p-1 bg-slate-100/80 relative">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-2.5 border border-slate-500 rounded-t-sm" />
                      <Flame className="w-6 h-6 text-slate-500" />
                    </div>
                  </div>

                  <span className="text-xs text-slate-700 mt-3 font-medium">Place against the cylinder.</span>
                </div>

                {/* Sensor Indicators */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Contact</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> GOOD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Orientation</span>
                    <span className="text-slate-900 font-bold font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-slate-900" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Noise level</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" /> LOW
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: READY */}
              <button
                onClick={() => {
                  resetMeasurement();
                  setActiveTab('MEASURE_TAP');
                }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <span>READY</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 21: 🔊 MEASURE — TAP (Step 2 of 3 - Hero Action)    */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_TAP' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: × THUMP */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('MEASURE_POSITION')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase">THUMP</h2>
                  <button
                    onClick={handleSimulateBadTap}
                    className="text-[10px] font-mono text-slate-500 hover:text-amber-600 underline"
                    title="Simulate Bad Tap for testing"
                  >
                    Simulate Bad Tap
                  </button>
                </div>

                <div className="text-center my-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                    STEP 2 OF 3
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-wide">TAP NOW</h3>
                </div>

                {/* Strike Target Indicator ◉ */}
                <div className="my-2 py-4 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center relative">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center mb-2">
                    <div className="w-4 h-4 rounded-full bg-white animate-ping" />
                  </div>

                  {/* HERO TAP BUTTON */}
                  <button
                    onClick={handleMeasureTap}
                    className={`px-10 py-3.5 rounded-2xl border-2 font-black text-base transition duration-150 active:scale-95 shadow-2xl flex items-center justify-center gap-2 ${
                      tapHapticFlash
                        ? 'bg-emerald-600 border-emerald-400 text-black shadow-emerald-400/40 scale-105'
                        : 'bg-white border-white text-black hover:bg-slate-200 shadow-white/10'
                    }`}
                  >
                    <Hand className="w-5 h-5" />
                    <span>TAP</span>
                  </button>

                  <div className="mt-3">
                    <span className="text-base font-black text-slate-900 font-mono">{measureTaps} / 5</span>
                  </div>
                </div>

                {/* LIVE SENSOR HUD (iQOO Hackathon Hardware & Sensor Telemetry) */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-100">
                    <span>LIVE SENSOR HUD</span>
                    <span className="text-emerald-600 font-bold">48kHz • 200Hz IMU</span>
                  </div>

                  {measureTaps === 0 && !tapHapticFlash ? (
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">IMU</span>
                        <span className="text-slate-900 font-bold flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          READY
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">MIC</span>
                        <span className="text-slate-900 font-bold flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          LISTENING
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">CONTACT</span>
                        <span className="text-slate-900 font-bold flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          GOOD
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">NOISE</span>
                        <span className="text-slate-900 font-bold flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          LOW
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">IMU</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          ✓ TAP DETECTED
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">MIC</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          ✓ RESPONSE CAPTURED
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">DSP</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          ✓ SIGNAL VALID
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">ML</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          ✓ CLASSIFIED
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acoustic Response Waveform & Strength */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Tap strength</span>
                    <span className="text-slate-900 font-mono font-bold">{tapStrength}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden border border-slate-100">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-300"
                      style={{ width: `${tapStrength}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center pt-1 pb-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  Snapdragon NPU INT8 • IMU Gated Acoustic DSP
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 22: ⚠️ BAD TAP (Quality Gate / Outlier Rejection)     */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_BAD_TAP' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-3xl bg-red-50 border border-amber-500/30 flex items-center justify-center mb-4 text-3xl shadow-xl">
                  ⚠️
                </div>

                <h2 className="text-base font-black text-slate-900 tracking-wide mb-2 uppercase">
                  TAP NOT USABLE
                </h2>

                <p className="text-xs text-slate-700 leading-relaxed max-w-xs mb-3">
                  The tap was too soft or the phone moved during impulse acquisition.
                </p>

                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Keep the phone flat and tap again.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('MEASURE_TAP')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 23: 🧠 ANALYSIS (Step 3 of 3)                        */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_ANALYSIS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-black text-slate-900 tracking-widest uppercase">ANALYZING</h2>
                  <span className="text-xs font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-white/10">THUMP</span>
                </div>

                <span className="text-xs text-slate-500 block px-1 mb-2 font-mono">
                  Acoustic response
                </span>

                {/* ASCII Waveform Display */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 mb-4 flex flex-col items-center justify-center">
                  <svg className="w-full h-12 stroke-slate-900 fill-none" viewBox="0 0 200 40">
                    <path
                      d="M 0 25 L 30 25 L 45 5 L 60 35 L 75 15 L 90 25 L 120 25 L 135 8 L 150 32 L 165 20 L 180 25 L 200 25"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">
                    FFT Spectral Centroid Peak: 2480 Hz
                  </span>
                </div>

                {/* Sequential Checkpoints */}
                <div className="space-y-1.5 px-1 text-xs font-medium">
                  {[
                    { step: 1, text: 'Tap quality' },
                    { step: 2, text: 'Noise filtering' },
                    { step: 3, text: 'Spectral analysis' },
                    { step: 4, text: 'Decay analysis' },
                    { step: 5, text: 'Cylinder calibration' },
                    { step: 6, text: 'On-device ML' },
                  ].map(item => (
                    <div key={item.step} className="flex items-center space-x-2">
                      <span className={`font-mono font-bold ${
                        analysisStep >= item.step ? 'text-slate-900' : 'text-slate-600'
                      }`}>
                        ✓
                      </span>
                      <span className={analysisStep >= item.step ? 'text-slate-200' : 'text-slate-600'}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Confidence Bar */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500">Confidence</span>
                    <span className="text-slate-900 font-mono font-bold">87%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: '87%' }} />
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-500 font-mono animate-pulse">
                  Snapdragon NPU INT8 inference in progress...
                </span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 24: ⛽ RESULT — HERO SCREEN (Exact ASCII Match)      */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_RESULT' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Measurement Result ⋮ */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-bold text-slate-900">Measurement Result</h2>
                  <button
                    onClick={() => setActiveTab('ACOUSTIC_ANALYSIS')}
                    className="p-2 -mr-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                    title="Acoustic Analysis Details"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center my-1">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest block font-mono">
                    {selectedCylinderForMeasure.toUpperCase()}
                  </span>
                </div>

                {/* Hero Readout Card */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-2.5 my-2">
                  <div className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    62%
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    GAS REMAINING
                  </span>

                  {/* Monochromatic Bar ████████████░░░░ */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-200 my-1">
                    <div className="bg-white h-full rounded-full" style={{ width: '62%' }} />
                  </div>

                  <span className="text-xs text-slate-700 font-mono font-medium">
                    Approx. 6.2 kg
                  </span>
                </div>

                {/* Telemetry Breakdown Details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      DAILY CONSUMPTION
                    </span>
                    <span className="text-slate-900 font-mono font-bold text-sm">
                      0.76 kg / day
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      ESTIMATED REMAINING
                    </span>
                    <span className="text-slate-900 font-mono font-bold text-sm">
                      ~8 days
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      EXPECTED EMPTY
                    </span>
                    <span className="text-slate-900 font-mono font-bold text-sm">
                      September 16
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-emerald-600 font-bold font-mono">✓ Confidence: 91%</span>
                    <span className="text-slate-500 font-mono">±6% estimated level</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => setActiveTab('HOME')}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  <span>Save Reading</span>
                </button>

                <div className="flex items-center justify-between px-2">
                  <button
                    onClick={() => {
                      resetMeasurement();
                      setActiveTab('MEASURE_POSITION');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-900 transition font-medium py-1"
                  >
                    Measure Again
                  </button>

                  <button
                    onClick={() => setActiveTab('ACOUSTIC_ANALYSIS')}
                    className="text-xs text-slate-700 hover:text-slate-900 transition font-bold py-1 flex items-center gap-1"
                  >
                    <span>🔬 Advanced Analysis</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 25: 🔬 ADVANCED ANALYSIS (For Judges / Telemetry)   */}
          {/* ========================================================= */}
          {activeTab === 'ACOUSTIC_ANALYSIS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Acoustic Analysis */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setActiveTab('MEASURE_RESULT')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-sm font-black text-slate-900 tracking-tight">Acoustic Analysis</h2>
                  <div className="w-8" />
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                  {/* Card 1: RAW RESPONSE */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                      RAW RESPONSE
                    </span>
                    <div className="py-2 flex items-center justify-center">
                      <svg className="w-full h-10 stroke-slate-900 fill-none" viewBox="0 0 200 35">
                        <path
                          d="M 0 20 L 20 20 L 35 3 L 50 28 L 65 10 L 80 20 L 105 20 L 120 5 L 135 26 L 150 16 L 165 20 L 200 20"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: SPECTRUM */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                        SPECTRUM
                      </span>
                      <div className="flex items-end space-x-1.5 h-8 px-2 bg-slate-100/80 rounded-lg py-1 border border-slate-100">
                        <div className="w-3 bg-white/40 h-2 rounded-t-sm" />
                        <div className="w-3 bg-white/60 h-4 rounded-t-sm" />
                        <div className="w-3 bg-white h-7 rounded-t-sm" />
                        <div className="w-3 bg-white/80 h-5 rounded-t-sm" />
                        <div className="w-3 bg-white/50 h-3 rounded-t-sm" />
                        <div className="w-3 bg-white/30 h-1.5 rounded-t-sm" />
                        <div className="w-3 bg-white/20 h-1 rounded-t-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[9px] text-slate-500 block">Centroid</span>
                        <span className="text-xs font-mono font-bold text-slate-900">2.84 kHz</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">Decay rate</span>
                        <span className="text-xs font-mono font-bold text-slate-900">0.71</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 block">RMS energy</span>
                        <span className="text-xs font-mono font-bold text-slate-900">0.183</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: CLASSIFICATION INFERENCE */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">DSP Classification</span>
                      <span className="text-slate-900 font-bold font-mono px-2 py-0.5 rounded bg-white/10">GAS-LIKE</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-mono">ML (TFLite NPU)</span>
                      <span className="text-slate-900 font-bold font-mono px-2 py-0.5 rounded bg-white/10">GAS-LIKE</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-slate-500">Fused Confidence</span>
                      <span className="text-emerald-600 font-bold font-mono">91%</span>
                    </div>
                  {/* Model Version Tag */}
                  <div className="pt-2 text-center">
                    <span className="text-[10px] font-mono text-slate-500">
                      Model: <strong className="text-slate-900">THUMP-Lite v1</strong>
                    </span>
                  </div>
                </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('MEASURE_RESULT')}
                className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <span>Back to Result</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 26: 📊 HISTORY (Exact ASCII Match)                  */}
          {/* ========================================================= */}
          {activeTab === 'HISTORY' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: History ⋮ */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base font-black text-slate-900">History</h2>
                  <button
                    onClick={() => alert('Filter telemetry by cylinder')}
                    className="p-2 -mr-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <span className="text-xs font-mono font-black text-slate-900 tracking-widest block uppercase mb-2">
                  KITCHEN
                </span>

                {/* Monochromatic Trend Line Graph */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 mb-3">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-2">
                    <span className="text-slate-900 font-bold">62% Current</span>
                    <span>30-Day Trend</span>
                  </div>

                  <div className="relative h-20 w-full flex items-center justify-center">
                    <svg className="w-full h-full stroke-slate-900 fill-none" viewBox="0 0 240 70">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="240" y2="20" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="240" y2="50" stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                      
                      {/* Depletion Curve Line */}
                      <path
                        d="M 10 15 L 60 22 L 120 38 L 180 48 L 230 58"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Spark Points */}
                      <circle cx="10" cy="15" r="3.5" fill="#0F172A" />
                      <circle cx="60" cy="22" r="3" fill="#0F172A" />
                      <circle cx="120" cy="38" r="3" fill="#0F172A" />
                      <circle cx="180" cy="48" r="3" fill="#0F172A" />
                      <circle cx="230" cy="58" r="3.5" fill="#0F172A" />
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                    <span>Aug 29 (76%)</span>
                    <span>Sep 2 (71%)</span>
                    <span>Sep 5 (67%)</span>
                    <span>Sep 8 (62%)</span>
                  </div>
                </div>

                {/* Recent Readings List */}
                <div className="space-y-1.5 mb-3">
                  {[
                    { date: 'Sep 8', val: '62%', status: '✓' },
                    { date: 'Sep 5', val: '67%', status: '✓' },
                    { date: 'Sep 2', val: '71%', status: '✓' },
                    { date: 'Aug 29', val: '76%', status: '✓' },
                  ].map((row, i) => (
                    <div key={i} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-700">{row.date}</span>
                      <span className="text-slate-900 font-bold">{row.val}</span>
                      <span className="text-emerald-600 font-bold">{row.status}</span>
                    </div>
                  ))}
                </div>

                {/* Consumption Box */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Consumption
                  </span>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-700">Avg: 0.76 kg/day</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                      Trend: ↓ 12%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 27: 🧠 AI INSIGHTS (Exact ASCII Match)              */}
          {/* ========================================================= */}
          {activeTab === 'AI' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: AI Insights */}
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-base font-black text-slate-900">AI Insights</h2>
                  <div className="w-4" />
                </div>

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3 font-mono">
                  THUMP INTELLIGENCE
                </span>

                <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
                  {/* Card 1: ⛽ REFILL FORECAST */}
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-black text-slate-900">
                      <span>⛽</span>
                      <span className="tracking-wider uppercase">REFILL FORECAST</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      ~8 days remaining
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Expected empty: <strong className="text-slate-900">Sep 16</strong>
                    </div>
                  </div>

                  {/* Card 2: 📉 USAGE TREND */}
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-black text-slate-900">
                      <span>📉</span>
                      <span className="tracking-wider uppercase">USAGE TREND</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Consumption is <strong className="text-slate-900 font-bold">12% lower</strong> than your 30-day avg.
                    </p>
                  </div>

                  {/* Card 3: ⚠️ ANOMALY */}
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 text-xs font-black text-amber-600">
                      <span>⚠️</span>
                      <span className="tracking-wider uppercase text-slate-900">ANOMALY</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Today's usage is higher than your usual pattern.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action: 🎙 Ask THUMP */}
              <button
                onClick={() => setActiveTab('ASK_THUMP')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <Mic className="w-4 h-4" />
                <span>🎙 Ask THUMP</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 28: 🎙️ ASK THUMP (Voice Conversational Interface)  */}
          {/* ========================================================= */}
          {activeTab === 'ASK_THUMP' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Ask THUMP */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setActiveTab('AI')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Ask THUMP</h2>
                  <div className="w-8" />
                </div>

                {/* Pulse Target ◉ */}
                <div className="my-3 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center bg-slate-100 shadow-xl">
                    <div className="w-4 h-4 rounded-full bg-white animate-ping" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-2 font-mono">
                    Listening to user voice...
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setVoiceQuery('refill')}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        voiceQuery === 'refill' ? 'bg-slate-900 text-white hover:bg-slate-200 font-bold border-white' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      "When should I refill?"
                    </button>
                    <button
                      onClick={() => setVoiceQuery('level')}
                      className={`text-xs px-2.5 py-1 rounded-full border transition ${
                        voiceQuery === 'level' ? 'bg-slate-900 text-white hover:bg-slate-200 font-bold border-white' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      "How much gas?"
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 my-2.5" />

                {/* Assistant Spoken Response Card */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                    <span>🔊</span>
                    <span>THUMP Voice Assistant</span>
                  </div>
                  {voiceQuery === 'refill' ? (
                    <p className="text-xs text-slate-900 leading-relaxed font-sans">
                      "Based on your recent consumption, your cylinder is estimated to run out around <strong className="text-slate-900 font-bold underline decoration-white/40">September 16</strong>. I'd recommend arranging a refill before then."
                    </p>
                  ) : (
                    <p className="text-xs text-slate-900 leading-relaxed font-sans">
                      "You have approximately <strong className="text-slate-900 font-mono font-bold">62%</strong> gas remaining (~6.2 kg). Based on your recent usage, that's about <strong className="text-slate-900 font-mono font-bold">8 days</strong>."
                    </p>
                  )}
                </div>
              </div>

              {/* Mic Trigger */}
              <div className="flex flex-col items-center justify-center my-2">
                <button
                  onClick={() => {
                    setIsListening(true);
                    setTimeout(() => {
                      setIsListening(false);
                      setVoiceQuery(prev => prev === 'refill' ? 'level' : 'refill');
                    }, 1200);
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 shadow-2xl ${
                    isListening ? 'bg-emerald-600 text-black scale-110 shadow-emerald-400/40' : 'bg-slate-900 text-white hover:bg-slate-200 hover:bg-slate-200'
                  }`}
                  title="Speak to THUMP"
                >
                  <Mic className="w-6 h-6" />
                </button>
                <span className="text-[10px] text-slate-500 font-mono mt-1">Tap to speak or switch query</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 29: 📈 CONSUMPTION DETAILS                           */}
          {/* ========================================================= */}
          {activeTab === 'CONSUMPTION_DETAILS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Consumption */}
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => setActiveTab('HISTORY')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Consumption</h2>
                  <div className="w-8" />
                </div>

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-mono">
                  LAST 30 DAYS
                </span>

                <div className="p-4 rounded-3xl bg-white border border-slate-200 text-center mb-3">
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    5.8 kg
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    consumed
                  </span>
                </div>

                {/* Step / Curve Chart */}
                <div className="p-4 rounded-3xl bg-white border border-slate-200 mb-3">
                  <div className="relative h-24 w-full flex items-center justify-center">
                    <svg className="w-full h-full stroke-slate-900 fill-none" viewBox="0 0 240 80">
                      <path
                        d="M 10 15 L 50 35 L 90 45 L 140 45 L 180 65 L 230 70"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="15" r="3" fill="#0F172A" />
                      <circle cx="50" cy="35" r="3" fill="#0F172A" />
                      <circle cx="90" cy="45" r="3" fill="#0F172A" />
                      <circle cx="140" cy="45" r="3" fill="#0F172A" />
                      <circle cx="180" cy="65" r="3" fill="#0F172A" />
                      <circle cx="230" cy="70" r="3" fill="#0F172A" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>
                </div>

                {/* Consumption Details Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Average</span>
                    <span className="text-slate-900 font-bold">0.76 kg/day</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Compared to previous month</span>
                    <span className="text-emerald-600 font-bold">↓ 12%</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Peak usage</span>
                    <span className="text-slate-900 font-bold">Sunday</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('HISTORY')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <span>Back to History</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 30: 🔄 OFFLINE MODE (Offline-First Architecture)    */}
          {/* ========================================================= */}
          {activeTab === 'OFFLINE_MODE' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Offline Mode */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold font-mono">
                    <span>🟠</span>
                    <span>OFFLINE</span>
                  </div>
                  <div className="w-6" />
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 mb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Your readings still work.</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      THUMP processes DSP & ML 100% on-device on Snapdragon NPU without network latency.
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    {[
                      'Measurement',
                      'Acoustic analysis',
                      'History',
                      'AI level estimation'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-slate-200">
                        <span className="text-emerald-600 font-bold font-mono">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pending Readings */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500 font-mono block">
                      {pendingSyncCount} readings waiting to sync
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs font-mono font-bold text-slate-900">
                    Pending Sync: {pendingSyncCount}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 text-center px-4 mb-3 leading-relaxed">
                  They'll sync automatically when you're back online.
                </p>

                <button
                  onClick={() => {
                    setIsOffline(false);
                    setActiveTab('SYNC_STATUS');
                  }}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Connect & Sync</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 31: ☁️ SYNC STATUS                                   */}
          {/* ========================================================= */}
          {activeTab === 'SYNC_STATUS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← Sync Status */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Sync Status</h2>
                  <button
                    onClick={() => {
                      setIsOffline(true);
                      setActiveTab('OFFLINE_MODE');
                    }}
                    className="text-[10px] font-mono text-slate-500 hover:text-amber-600"
                    title="Simulate Offline"
                  >
                    Go Offline
                  </button>
                </div>

                {/* Big Cloud Icon & Status */}
                <div className="my-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white hover:bg-slate-200 flex items-center justify-center shadow-xl">
                    <Cloud className="w-9 h-9" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-wider">SYNCED</h3>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      Encrypted peer-to-peer relay
                    </span>
                  </div>

                  {/* Sync Metrics Table */}
                  <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Last sync</span>
                      <span className="text-slate-900 font-bold">Today, 2:42 PM</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Measurements</span>
                      <span className="text-slate-900 font-bold block">28 synced</span>
                      <span className="text-slate-500 block">0 pending</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Cylinder data</span>
                      <span className="text-emerald-600 font-bold">✓ Up to date</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">AI insights</span>
                      <span className="text-emerald-600 font-bold">✓ Up to date</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSyncing(true);
                  setTimeout(() => {
                    setIsSyncing(false);
                    alert('All cylinders & telemetry successfully synced!');
                  }, 1200);
                }}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing Fleet...' : 'Sync Now'}</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 32: 👤 PROFILE (Exact ASCII Match)                  */}
          {/* ========================================================= */}
          {activeTab === 'PROFILE' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="overflow-y-auto max-h-[500px] pr-1 space-y-3">
                {/* Header: Profile */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-black text-slate-900">Profile</h2>
                  <button
                    onClick={() => setActiveTab('SETTINGS')}
                    className="p-2 -mr-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                    title="Settings"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* User Avatar Card */}
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-slate-300 flex items-center justify-center mb-2 shadow-xl">
                    <User className="w-8 h-8 text-slate-900" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">Bala Murugan</h3>
                  <span className="text-xs text-slate-500 font-mono mt-0.5">bala@email.com</span>
                </div>

                <div className="border-t border-slate-200 my-1" />

                {/* Section: Account */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    Account
                  </span>
                  <div
                    onClick={() => alert('Personal Information editing')}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                  >
                    <span>Personal information</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Section: Preferences */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    Preferences
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => setActiveTab('SETTINGS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Units</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    <div
                      onClick={() => setActiveTab('NOTIFICATIONS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Notifications</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Section: Data */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    Data
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => setActiveTab('SYNC_STATUS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Sync & backup</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    <div
                      onClick={() => alert('Privacy & Local-Only telemetry details')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Privacy</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Section: Help */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    Help
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => alert('Help Center')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Help center</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                    <div
                      onClick={() => alert('THUMP v1.0.0 - iQOO Smart Living Hackathon Track 05')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>About THUMP</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Log out */}
                <div className="pt-2">
                  <button
                    onClick={onLogout}
                    className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 33: ⚙️ SETTINGS (Exact ASCII Match)                 */}
          {/* ========================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="overflow-y-auto max-h-[500px] pr-1 space-y-3">
                {/* Header: Settings */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('PROFILE')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Settings</h2>
                  <div className="w-8" />
                </div>

                {/* MEASUREMENT */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    MEASUREMENT
                  </span>
                  <div className="space-y-1">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Gas unit</span>
                      <span className="text-slate-500 font-mono flex items-center gap-1">
                        Percentage (%) <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Weight unit</span>
                      <span className="text-slate-500 font-mono flex items-center gap-1">
                        Kilograms (kg) <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* APP */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    APP
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => setActiveTab('NOTIFICATIONS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Notifications</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Appearance</span>
                      <span className="text-slate-500 font-mono flex items-center gap-1">
                        Obsidian Dark <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* DATA */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    DATA
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => setActiveTab('SYNC_STATUS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Cloud sync</span>
                      <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                        Enabled <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                    </div>
                    <div
                      onClick={() => alert('Exporting Telemetry CSV/JSON...')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Export data</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* PRIVACY */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    PRIVACY
                  </span>
                  <div className="space-y-1">
                    <div
                      onClick={() => setActiveTab('PRIVACY_SETTINGS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Data permissions</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div
                      onClick={() => setActiveTab('PRIVACY_SETTINGS')}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 hover:border-slate-300 transition cursor-pointer"
                    >
                      <span>Camera & microphone</span>
                      <span className="text-emerald-600 font-mono font-bold">Granted</span>
                    </div>
                  </div>
                </div>

                {/* SUPPORT */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    SUPPORT
                  </span>
                  <div className="space-y-1">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Help center</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Report a problem</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>About THUMP</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 34: 🔔 NOTIFICATION SETTINGS (Exact ASCII Match)    */}
          {/* ========================================================= */}
          {activeTab === 'NOTIFICATION_SETTINGS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="overflow-y-auto max-h-[500px] pr-1 space-y-4">
                {/* Header: ← Notifications */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('SETTINGS')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Notifications</h2>
                  <div className="w-8" />
                </div>

                {/* REFILL ALERTS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    REFILL ALERTS
                  </span>
                  
                  <div className="space-y-1.5">
                    {/* Low gas */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Low gas</span>
                      <button
                        onClick={() => setNotifLowGas(!notifLowGas)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition ${
                          notifLowGas ? 'bg-slate-900 text-white hover:bg-slate-200' : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {notifLowGas ? '[ ON ]' : '[ OFF ]'}
                      </button>
                    </div>

                    {/* Refill prediction */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Refill prediction</span>
                      <button
                        onClick={() => setNotifRefillPrediction(!notifRefillPrediction)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition ${
                          notifRefillPrediction ? 'bg-slate-900 text-white hover:bg-slate-200' : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {notifRefillPrediction ? '[ ON ]' : '[ OFF ]'}
                      </button>
                    </div>

                    {/* Usage anomaly */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Usage anomaly</span>
                      <button
                        onClick={() => setNotifAnomaly(!notifAnomaly)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition ${
                          notifAnomaly ? 'bg-slate-900 text-white hover:bg-slate-200' : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {notifAnomaly ? '[ ON ]' : '[ OFF ]'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* MEASUREMENT */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1">
                    MEASUREMENT
                  </span>
                  
                  <div className="space-y-1.5">
                    {/* Sync complete */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Sync complete</span>
                      <button
                        onClick={() => setNotifSyncComplete(!notifSyncComplete)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition ${
                          notifSyncComplete ? 'bg-slate-900 text-white hover:bg-slate-200' : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {notifSyncComplete ? '[ ON ]' : '[ OFF ]'}
                      </button>
                    </div>

                    {/* Weekly summary */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900">
                      <span>Weekly summary</span>
                      <button
                        onClick={() => setNotifWeeklySummary(!notifWeeklySummary)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition ${
                          notifWeeklySummary ? 'bg-slate-900 text-white hover:bg-slate-200' : 'bg-white/10 text-slate-500'
                        }`}
                      >
                        {notifWeeklySummary ? '[ ON ]' : '[ OFF ]'}
                      </button>
                    </div>

                    {/* Alert threshold */}
                    <div
                      onClick={() => {
                        const nextThreshold = notifThreshold === '20%' ? '25%' : notifThreshold === '25%' ? '15%' : '20%';
                        setNotifThreshold(nextThreshold);
                      }}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs text-slate-900 cursor-pointer hover:border-slate-300 transition"
                    >
                      <span>Alert threshold</span>
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                        {notifThreshold} <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 35: 🔐 PRIVACY (On-Device Architecture)            */}
          {/* ========================================================= */}
          {activeTab === 'PRIVACY_SETTINGS' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="overflow-y-auto max-h-[500px] pr-1 space-y-4">
                {/* Header: ← Privacy */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('SETTINGS')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">Privacy</h2>
                  <div className="w-8" />
                </div>

                {/* YOUR DATA */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1 font-mono">
                    YOUR DATA
                  </span>

                  <div className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-900 font-bold block">Acoustic recordings</span>
                      <span className="text-emerald-600 font-mono text-[11px] block mt-0.5">
                        Processed on device ✓
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-900 font-bold block">Camera</span>
                      <span className="text-slate-700 text-[11px] block mt-0.5">
                        Used only for label scan
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-900 font-bold block">AI processing</span>
                      <span className="text-slate-700 text-[11px] block mt-0.5">
                        On-device where supported
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-900 font-bold block">Cloud sync</span>
                      <span className="text-slate-700 text-[11px] block mt-0.5">
                        Measurement data only
                      </span>
                    </div>
                  </div>
                </div>

                {/* SENSOR ACCESS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-1 font-mono">
                    SENSOR ACCESS
                  </span>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Microphone (48kHz)</span>
                      <span className="text-slate-900 font-bold">Active on Tap</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Accelerometer / Gyro</span>
                      <span className="text-slate-900 font-bold">200Hz Sampled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Snapdragon NPU</span>
                      <span className="text-emerald-600 font-bold">Hardware Accelerated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: Delete Data */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (window.confirm('Delete all local recordings, calibrations, and logs?')) {
                      alert('Local data purged successfully.');
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs hover:bg-red-500/20 transition flex items-center justify-center gap-2"
                >
                  <span>Delete Data</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 36: ❓ HELP / HOW TO MEASURE (Exact ASCII Match)    */}
          {/* ========================================================= */}
          {activeTab === 'HELP_GUIDE' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="overflow-y-auto max-h-[500px] pr-1 space-y-3">
                {/* Header: ← How to Measure */}
                <div className="flex justify-between items-center mb-1">
                  <button
                    onClick={() => setActiveTab('PROFILE')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">How to Measure</h2>
                  <div className="w-8" />
                </div>

                <div className="space-y-2.5">
                  {/* STEP 1 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                      STEP 1
                    </span>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      Place phone firmly against cylinder.
                    </p>
                  </div>

                  {/* STEP 2 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                      STEP 2
                    </span>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      Keep phone orientation stable.
                    </p>
                  </div>

                  {/* STEP 3 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                      STEP 3
                    </span>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      Tap the shell when prompted.
                    </p>
                  </div>

                  {/* STEP 4 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                      STEP 4
                    </span>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      Repeat 3–5 times.
                    </p>
                  </div>

                  {/* STEP 5 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
                      STEP 5
                    </span>
                    <p className="text-xs text-slate-900 font-medium leading-relaxed">
                      THUMP calculates the level.
                    </p>
                  </div>

                  {/* Tips Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                      Tips
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      <li className="flex items-center gap-1.5">• Avoid noisy environments</li>
                      <li className="flex items-center gap-1.5">• Use same phone position</li>
                      <li className="flex items-center gap-1.5">• Don't move during capture</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('MEASURE_POSITION')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-3"
              >
                <span>Start Measuring</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCREEN 37: 🆘 ERROR SCREEN (Graceful Failure Handling)     */}
          {/* ========================================================= */}
          {activeTab === 'MEASURE_ERROR' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-3xl bg-red-50 border border-amber-500/30 flex items-center justify-center mb-4 text-3xl shadow-xl">
                  ⚠️
                </div>

                <h2 className="text-base font-black text-slate-900 tracking-wide mb-1">
                  Measurement unclear
                </h2>

                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-4">
                  THUMP couldn't get a reliable acoustic response.
                </p>

                {/* Possible Causes Card */}
                <div className="w-full p-4 rounded-3xl bg-white border border-slate-200 text-left space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                    Possible causes:
                  </span>
                  <ul className="space-y-1.5 text-slate-700 pl-1">
                    <li className="flex items-center gap-1.5">• Too much background noise</li>
                    <li className="flex items-center gap-1.5">• Poor phone contact</li>
                    <li className="flex items-center gap-1.5">• Inconsistent tap</li>
                    <li className="flex items-center gap-1.5">• Phone movement</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  onClick={() => {
                    resetMeasurement();
                    setActiveTab('MEASURE_POSITION');
                  }}
                  className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  <span>Try Again</span>
                </button>

                <button
                  onClick={() => setActiveTab('HELP_GUIDE')}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-900 transition font-medium text-center"
                >
                  Troubleshoot
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* SCREEN 38: 🏆 ABOUT THUMP (Exact ASCII Match)               */}
          {/* ========================================================= */}
          {activeTab === 'ABOUT_THUMP' && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-in fade-in duration-200">
              <div>
                {/* Header: ← About THUMP */}
                <div className="flex justify-between items-center mb-3">
                  <button
                    onClick={() => setActiveTab('PROFILE')}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-slate-900 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-black text-slate-900">About THUMP</h2>
                  <div className="w-8" />
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4 mb-3">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white hover:bg-slate-200 flex items-center justify-center font-black text-xl tracking-tight shadow-xl">
                      T
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-wider">THUMP</h3>
                      <p className="text-xs text-slate-500">Measure what's inside.</p>
                    </div>
                  </div>

                  {/* Wireframe Card Elements */}
                  <div className="space-y-3.5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        Intelligence
                      </span>
                      <span className="text-slate-900 font-bold text-sm">
                        DSP + THUMP-Lite ML
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        Processing
                      </span>
                      <span className="text-emerald-600 font-bold text-sm">
                        On-device
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
                        Built for
                      </span>
                      <span className="text-slate-900 font-bold text-sm">
                        iQOO Hackathon 2026
                      </span>
                    </div>
                  </div>

                  {/* Made with ♥ */}
                  <div className="pt-3 border-t border-slate-200 text-center">
                    <span className="text-xs text-slate-500 font-mono tracking-wide">
                      Made with <span className="text-red-400 font-sans">♥</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('HOME')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-200 shadow-md text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-2"
              >
                <span>Back to Home</span>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* 📱 4 TABS + CENTER FLOATING ⊕ MEASURE BUTTON               */}
          {/* ========================================================= */}
          <div className="relative mt-2 pt-2 border-t border-slate-200 flex justify-between items-center px-1">
            {/* Left Tab 1: Home */}
            <button
              onClick={() => setActiveTab('HOME')}
              className={`flex-1 flex flex-col items-center space-y-1 transition ${
                activeTab === 'HOME' || ['MEASURE_RESULT', 'NOTIFICATIONS', 'SYNC_STATUS', 'OFFLINE_MODE', 'PROFILE', 'SETTINGS', 'NOTIFICATION_SETTINGS', 'PRIVACY_SETTINGS', 'HELP_GUIDE', 'MEASURE_ERROR', 'ABOUT_THUMP'].includes(activeTab)
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
            </button>

            {/* Left Tab 2: Cylinders */}
            <button
              onClick={() => setActiveTab('CYLINDERS')}
              className={`flex-1 flex flex-col items-center space-y-1 transition ${
                activeTab === 'CYLINDERS' || ['ADD_CYLINDER', 'ENTER_MANUALLY', 'SCAN_CAMERA', 'SCAN_SUCCESS', 'CALIBRATION_INTRO', 'CALIBRATION_FULL', 'CALIBRATION_EMPTY', 'CALIBRATION_SUCCESS'].includes(activeTab)
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Cylinders</span>
            </button>

            {/* Center Floating Hero Button: ⊕ MEASURE */}
            <div className="relative -top-4 flex flex-col items-center px-1">
              <button
                onClick={() => {
                  resetMeasurement();
                  setActiveTab('MEASURE_POSITION');
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 border-2 ${
                  ['MEASURE_SELECT', 'MEASURE_POSITION', 'MEASURE_TAP', 'MEASURE_BAD_TAP', 'MEASURE_ANALYSIS'].includes(activeTab)
                    ? 'bg-slate-900 text-white hover:bg-slate-200 border-white ring-4 ring-white/20 scale-105'
                    : 'bg-slate-900 text-white hover:bg-slate-200 border-white/80 hover:bg-slate-200 hover:scale-105'
                }`}
                title="Start Measurement"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
              <span className="text-[8px] font-black tracking-widest text-slate-900 uppercase mt-0.5 font-mono">
                MEASURE
              </span>
            </div>

            {/* Right Tab 1: History */}
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`flex-1 flex flex-col items-center space-y-1 transition ${
                activeTab === 'HISTORY' || ['CONSUMPTION_DETAILS'].includes(activeTab)
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-wider">History</span>
            </button>

            {/* Right Tab 2: Insights */}
            <button
              onClick={() => setActiveTab('AI')}
              className={`flex-1 flex flex-col items-center space-y-1 transition ${
                activeTab === 'AI' || ['ASK_THUMP', 'ACOUSTIC_ANALYSIS'].includes(activeTab)
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Insights</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
