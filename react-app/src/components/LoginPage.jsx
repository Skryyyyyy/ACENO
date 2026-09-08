import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onStartOnboarding }) {
  // Step: 'LOGIN' | 'OTP'
  const [step, setStep] = useState('LOGIN');
  
  // Login Form States
  const [identifier, setIdentifier] = useState('+91 98401 23456');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP States
  const [otp, setOtp] = useState(['4', '8', '2', '1', '7', '3']);
  const [timer, setTimer] = useState(24);
  const [resendActive, setResendActive] = useState(false);
  const otpInputsRef = useRef([]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendActive(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      setTimer(24);
      setResendActive(false);
    }, 400);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onStartOnboarding) {
        onStartOnboarding({ identifier, role: 'ENGINEER', verified: true });
      } else {
        onLoginSuccess({ identifier, role: 'ENGINEER', verified: true });
      }
    }, 500);
  };

  const handleResend = () => {
    if (!resendActive) return;
    setTimer(24);
    setResendActive(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#060708] relative overflow-hidden select-none">
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-white/[0.015] rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-[#0e1014] border border-white/10 rounded-[38px] p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* ========================================================= */}
        {/* STEP 1: WELCOME BACK / LOGIN SCREEN                       */}
        {/* ========================================================= */}
        {step === 'LOGIN' && (
          <div>
            {/* Header Typography */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Your cylinders are waiting.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Mobile / Email Field */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                  Mobile / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#14171d] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-white/30 transition placeholder:text-slate-600 font-medium font-mono"
                  />
                </div>
              </div>

              {/* Password Field with Eye Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-[#14171d] border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/30 transition placeholder:text-slate-600 font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => alert('PIN Reset link sent to your registered mobile number.')}
                  className="text-xs text-slate-400 hover:text-white font-medium transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-7 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-4 bg-[#0e1014] text-xs font-bold text-slate-500 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setStep('OTP');
                }, 400);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#14171d] hover:bg-[#1d2129] border border-white/10 text-white text-xs font-bold transition flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.56 0 2.96.57 4.07 1.51l3.05-3.05C17.27 1.71 14.81 1 12 1 7.52 1 3.73 3.56 1.84 7.29l3.66 2.84C6.38 7.42 8.97 5 12 5z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.92 3.41-8.7z"/>
                <path fill="#FBBC05" d="M5.5 14.87c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.84 7.45C1.07 9 0.63 10.74 0.63 12.58s.44 3.58 1.21 5.13l3.66-2.84z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.45 1.16-4.22 1.16-3.03 0-5.62-2.42-6.5-5.13L1.84 16.08C3.73 19.81 7.52 22.37 12 22.37z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* New to THUMP? Sign up */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                New to THUMP?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onStartOnboarding) {
                      onStartOnboarding({ identifier, role: 'ENGINEER', isNew: true });
                    }
                  }}
                  className="font-bold text-white hover:underline ml-1"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: OTP VERIFICATION SCREEN                           */}
        {/* ========================================================= */}
        {step === 'OTP' && (
          <div>
            {/* Top Back Arrow Button */}
            <button
              onClick={() => setStep('LOGIN')}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition flex items-center justify-center mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Header Typography */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Verify your number
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                We sent a 6-digit code to{' '}
                <strong className="text-white font-mono">{identifier}</strong>
              </p>
            </div>

            {/* 6-Digit OTP Box Grid [ 4 ] [ 8 ] [ 2 ] [ 1 ] [ 7 ] [ 3 ] */}
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="grid grid-cols-6 gap-2 my-6">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-full h-14 bg-[#14171d] border border-white/15 focus:border-white rounded-2xl text-center text-xl font-black mono text-white focus:outline-none transition shadow-inner"
                  />
                ))}
              </div>

              {/* Resend Code in 00:24 */}
              <div className="text-center">
                {resendActive ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-xs font-bold text-white hover:underline flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend code now
                  </button>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Resend code in{' '}
                    <strong className="text-white mono">
                      00:{timer < 10 ? `0${timer}` : timer}
                    </strong>
                  </span>
                )}
              </div>

              {/* Exact 'Verify' Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-white/5 mt-4"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Verify</span>
                )}
              </button>

              {/* Wrong number? Change it */}
              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setStep('LOGIN')}
                  className="text-xs text-slate-400 hover:text-white transition font-medium"
                >
                  Wrong number? <span className="text-white font-bold underline">Change it</span>
                </button>
              </div>
            </form>

            {/* Security Badge */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center space-x-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Biometric & Multi-Factor Security</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
