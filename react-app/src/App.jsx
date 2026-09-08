import React, { useState } from 'react';
import { 
  Zap, 
  Download, 
  Smartphone, 
  LayoutDashboard, 
  Sliders, 
  LogOut,
  Radio
} from 'lucide-react';
import LoginPage from './components/LoginPage';
import OnboardingScreen1 from './components/OnboardingScreen1';
import MobileAppView from './components/MobileAppView';
import WebDashboardView from './components/WebDashboardView';

export default function App() {
  const [user, setUser] = useState({ identifier: '+91 98401 23456', name: 'Bala Murugan', role: 'ENGINEER' }); // initialized so studio is visible immediately
  const [inOnboarding, setInOnboarding] = useState(false);
  const [viewMode, setViewMode] = useState('SPLIT'); // 'SPLIT' | 'MOBILE_ONLY' | 'WEB_ONLY'
  const [percentage, setPercentage] = useState(62.0);
  const [method, setMethod] = useState('ACOUSTIC'); // 'ACOUSTIC' | 'SCALE'
  const [userCylinder, setUserCylinder] = useState({
    name: 'Kitchen Cylinder #01',
    brand: 'Indane',
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
    <div className="min-h-screen bg-[#060708] text-slate-100 flex flex-col p-4 lg:p-8">
      
      {/* Universal Top Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl shadow-xl shadow-white/5">
            TH
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                THUMP // <span className="text-slate-400 font-medium">Gas OS Pro</span>
              </h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white/10 text-white border border-white/20 uppercase tracking-widest">
                React 18 Suite
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-white">{user.identifier || user.email}</strong> • Active: <strong className="text-white">{userCylinder.name} ({userCylinder.brand})</strong>
            </p>
          </div>
        </div>

        {/* View Mode & Control Buttons */}
        <div className="flex items-center space-x-3">
          {/* View Switcher Pill */}
          <div className="bg-[#14171d] p-1 rounded-full border border-white/10 flex items-center">
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === 'SPLIT' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split Studio
            </button>
            <button
              onClick={() => setViewMode('MOBILE_ONLY')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === 'MOBILE_ONLY' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              iQOO Phone
            </button>
            <button
              onClick={() => setViewMode('WEB_ONLY')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                viewMode === 'WEB_ONLY' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fleet Console
            </button>
          </div>

          <button
            onClick={triggerAcousticTap}
            className="px-4 py-2 text-xs font-bold rounded-full bg-white text-black hover:bg-slate-200 active:scale-95 transition flex items-center gap-1.5 shadow-lg shadow-white/5"
          >
            <Zap className="w-3.5 h-3.5" /> Tap Strike
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Multi-Pane Viewport */}
      <main className="max-w-7xl mx-auto w-full flex-1">
        {viewMode === 'SPLIT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <MobileAppView
                percentage={percentage}
                onTriggerTap={triggerAcousticTap}
                method={method}
                onMethodChange={setMethod}
                onLogout={handleLogout}
              />
            </div>
            <div className="lg:col-span-7">
              <WebDashboardView
                percentage={percentage}
                onTriggerTap={triggerAcousticTap}
                onExportReport={handleExportReport}
              />
            </div>
          </div>
        )}

        {viewMode === 'MOBILE_ONLY' && (
          <div className="flex justify-center">
            <MobileAppView
              percentage={percentage}
              onTriggerTap={triggerAcousticTap}
              method={method}
              onMethodChange={setMethod}
              onLogout={handleLogout}
            />
          </div>
        )}

        {viewMode === 'WEB_ONLY' && (
          <WebDashboardView
            percentage={percentage}
            onTriggerTap={triggerAcousticTap}
            onExportReport={handleExportReport}
          />
        )}
      </main>

      {/* Monochromatic Footer */}
      <footer className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center text-xs text-slate-500 max-w-7xl mx-auto w-full">
        <div>THUMP Neural Engine v2.4.0 • Zero-Hardware Acoustic AI + ESP32 BLE Hardware Suite</div>
        <div className="flex space-x-4">
          <span className="hover:text-slate-300 transition cursor-pointer">Security Protocol</span>
          <span className="hover:text-slate-300 transition cursor-pointer">48kHz Calibration</span>
          <span className="hover:text-slate-300 transition cursor-pointer">iQOO NPU Docs</span>
        </div>
      </footer>
    </div>
  );
}
