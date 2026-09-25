'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import {
  User,
  ShieldCheck,
  Wheat,
  Lock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'farmer' | 'admin'>('farmer');

  // Farmer OTP form
  const [mobile, setMobile] = useState('9822012345');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);

  // Admin / Operator form
  const [adminMobile, setAdminMobile] = useState('9876543210');
  const [password, setPassword] = useState('admin123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetchApi('/auth/farmer/otp/request', {
        method: 'POST',
        body: JSON.stringify({ mobile }),
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/auth/farmer/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp }),
      });
      if (res.accessToken) {
        localStorage.setItem('mandimitra_token', res.accessToken);
        localStorage.setItem('mandimitra_user', JSON.stringify(res.user));
      }
      router.push('/farmer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ mobile: adminMobile, password }),
      });
      if (res.accessToken) {
        localStorage.setItem('mandimitra_token', res.accessToken);
        localStorage.setItem('mandimitra_user', JSON.stringify(res.user));
      }
      if (res.user.role === 'OPERATOR') {
        router.push('/admin/queue');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (type: 'farmer' | 'operator' | 'admin' | 'csc') => {
    if (type === 'farmer') {
      setMobile('9822012345');
      setOtp('123456');
      router.push('/farmer/dashboard');
    } else if (type === 'operator') {
      setAdminMobile('9876543211');
      setPassword('operator123');
      router.push('/admin/queue');
    } else if (type === 'admin') {
      setAdminMobile('9876543210');
      setPassword('admin123');
      router.push('/admin/dashboard');
    } else if (type === 'csc') {
      router.push('/farmer/assisted');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Wheat className="w-6 h-6 text-amber-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-serif">
          Sign In to MandiMitra
        </h1>
        <p className="text-xs text-slate-700">
          Smart Procurement, Live Queue Tracking & Digital Mandi Assistance
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('farmer')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'farmer' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👨‍🌾 Farmer Login (Mobile + OTP)
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'admin' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🏛️ Officer / Operator Login
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {activeTab === 'farmer' ? (
          !otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Farmer 10-Digit Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="9822012345"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition"
              >
                {loading ? 'Sending OTP...' : 'Send OTP (Demo: 123456)'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                OTP sent to +91-{mobile}. Hint: Use <strong>123456</strong> for testing.
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-xl font-mono tracking-widest font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="123456"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Enter'}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Officer Mobile</label>
              <input
                type="text"
                value={adminMobile}
                onChange={(e) => setAdminMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                placeholder="9876543210"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl shadow-xs transition"
            >
              {loading ? 'Authenticating...' : 'Sign In as Officer'}
            </button>
          </form>
        )}
      </div>

      {/* One-Click Hackathon Evaluator Launchers */}
      <div className="bg-slate-100 rounded-3xl p-5 border border-slate-200 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          One-Click Hackathon Evaluator Access
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => quickDemoLogin('farmer')}
            className="text-left text-xs bg-white hover:bg-emerald-50 p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 transition"
          >
            👨‍🌾 Farmer (Ramesh)
            <span className="block text-[10px] text-slate-700 font-normal">Token B-042</span>
          </button>

          <button
            onClick={() => quickDemoLogin('operator')}
            className="text-left text-xs bg-white hover:bg-emerald-50 p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 transition"
          >
            📋 Mandi Operator
            <span className="block text-[10px] text-slate-700 font-normal">Niphad Gate</span>
          </button>

          <button
            onClick={() => quickDemoLogin('admin')}
            className="text-left text-xs bg-white hover:bg-emerald-50 p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 transition"
          >
            🏛️ District Officer
            <span className="block text-[10px] text-slate-700 font-normal">Full Analytics</span>
          </button>

          <button
            onClick={() => quickDemoLogin('csc')}
            className="text-left text-xs bg-white hover:bg-emerald-50 p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 transition"
          >
            🤝 CSC Kiosk VLE
            <span className="block text-[10px] text-slate-700 font-normal">Assisted Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
