import React, { useState } from 'react';
import { 
  Zap, 
  Download, 
  Smartphone, 
  LayoutDashboard, 
  Sliders, 
  LogOut,
  Radio,
  ExternalLink,
  ShieldCheck,
  Flame,
  Activity
} from 'lucide-react';
import LoginPage from './components/LoginPage';
import OnboardingScreen1 from './components/OnboardingScreen1';
import MobileAppView from './components/MobileAppView';
import WebDashboardView from './components/WebDashboardView';

export default function App() {
  const [user, setUser] = useState({ identifier: '+91 98401 23456', name: 'Bala Murugan', role: 'ENGINEER' });
  const [inOnboarding, setInOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState('WEB_APP'); // 'WEB_APP' | 'MOBILE_APP'
  const [percentage, setPercentage] = useState(62.0);
  const [method, setMethod] = useState('ACOUSTIC'); // 'ACOUSTIC' | 'SCALE'
  const [userCylinder, setUserCylinder] = useState({
    name: 'Kitchen Cylinder #01',
    brand: 'Indane Domestic',
    type: '14.2kg Domestic'
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setInOnboarding(false);
  };

  const handleStartOnboarding = (userData) => {
    setUser(userData);
    setInOnboarding(true);
  };

  const handleOnboardingComplete = (cylinderData) => {
    setUserCylinder({
      name: cylinderData.cylinderName,
      brand: cylinderData.selectedBrand,
      type: cylinderData.selectedType
    });
    setInOnboarding(false);
  };

  const handleLogout = () => {
    setUser(null);
    setInOnboarding(false);
  };

  const triggerAcousticTap = () => {
    const delta = (Math.random() * 0.6 - 0.3);
    setPercentage((prev) => Math.max(5, Math.min(95, prev + delta)));
  };

  const handleExportReport = () => {
    window.print();
  };

  // If not authenticated, render Login Page
  if (!user) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onStartOnboarding={handleStartOnboarding}
      />
    );
  }

  // If in Onboarding flow after signup/verification
  if (inOnboarding) {
    return (
      <OnboardingScreen1
        onComplete={handleOnboardingComplete}
        onSkip={() => setInOnboarding(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#060708] text-slate-100 flex flex-col p-4 sm:p-6 lg:p-10 relative overflow-x-hidden select-none">
      
      {/* Background Ambient Mesh Gradients */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.012] rounded-full blur-[140px] pointer-events-none" />

      {/* Universal Monochromatic Studio Navigation Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Brand Logo & Telemetry Tag */}
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl shadow-2xl ring-2 ring-white/20">
            T
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-black text-white tracking-tight uppercase">
                THUMP
              </h1>
              <span className="text-slate-600 font-light">/</span>
              <span className="text-xs font-mono text-slate-400 font-semibold tracking-wider">
                ACOUSTIC GAS OS
              </span>
              <span className="px-2.5 py-0.5 text-[9px] font-black rounded-full bg-white/10 text-white border border-white/20 uppercase tracking-widest font-mono">
                Track 05
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
              <span>Station: <strong className="text-white">{user.name || user.identifier}</strong></span>
              <span className="text-slate-600">•</span>
              <span>LPG Density Model: <strong className="text-emerald-400">0.51 kg/L</strong></span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Dedicated Web Console vs Standalone Mobile App */}
        <div className="flex items-center space-x-3">
          
          <div className="bg-[#14171d] p-1 rounded-2xl border border-white/10 flex items-center shadow-inner">
            <button
              onClick={() => setViewMode('WEB_APP')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'WEB_APP'
                  ? 'bg-white text-black shadow-xl shadow-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Web Fleet Console</span>
            </button>
            <button
              onClick={() => setViewMode('MOBILE_APP')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-2 ${
                viewMode === 'MOBILE_APP'
                  ? 'bg-white text-black shadow-xl shadow-white/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App</span>
            </button>
          </div>

          {/* Simulate Strike Trigger */}
          <button
            onClick={triggerAcousticTap}
            className="px-4 py-2 text-xs font-black rounded-xl bg-white text-black hover:bg-slate-200 active:scale-95 transition flex items-center gap-1.5 shadow-xl shadow-white/10"
            title="Simulate 48kHz Acoustic Impulse"
          >
            <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Tap Strike</span>
          </button>

          {/* Logout / Exit */}
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dedicated Content Viewport */}
      <main className="max-w-7xl mx-auto w-full flex-1 relative z-10">
        {viewMode === 'WEB_APP' ? (
          /* Pure Full-Width Desktop Web Fleet Console (Zero Phone Mockup) */
          <WebDashboardView
            percentage={percentage}
            onTriggerTap={triggerAcousticTap}
            onExportReport={handleExportReport}
          />
        ) : (
          /* Dedicated Clean Mobile Application Simulator */
          <div className="flex justify-center py-2 animate-in fade-in duration-300">
            <MobileAppView
              percentage={percentage}
              onTriggerTap={triggerAcousticTap}
              method={method}
              onMethodChange={setMethod}
              onLogout={handleLogout}
            />
          </div>
        )}
      </main>

      {/* Strict Monochromatic Minimalist Footer */}
      <footer className="mt-16 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-slate-500 max-w-7xl mx-auto w-full font-mono relative z-10">
        <div>
          THUMP Neural Engine v2.4.0 • Zero-Hardware Acoustic AI & BLE IoT Dual-Platform
        </div>
        <div className="flex space-x-6">
          <span className="hover:text-white transition cursor-pointer">48kHz PCM Stream</span>
          <span className="hover:text-white transition cursor-pointer">Snapdragon NPU INT8</span>
          <span className="hover:text-white transition cursor-pointer">iQOO India 2026</span>
        </div>
      </footer>
    </div>
  );
}
