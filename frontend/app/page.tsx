'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/language-context';
import {
  Wheat,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  PhoneCall,
  Activity,
  ArrowRight,
  TrendingDown,
  Truck,
  Users,
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 border border-emerald-500/40 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-300 backdrop-blur-xs">
            <Sparkles className="w-4 h-4" />
            Smart India Hackathon 2026 • AI-Powered Agri-Procurement
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto font-serif leading-tight">
            "Don't make farmers wait at the mandi.{' '}
            <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy">
              Let the system predict, schedule and guide them.
            </span>"
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            MandiMitra transforms crop procurement with intelligent queue forecasting, dynamic slot booking, no-wait departure alerts, and trilingual assisted voice access.
          </p>

          {/* Quick Demo Launch Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/farmer/dashboard"
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition flex items-center gap-2 text-base"
            >
              👨‍🌾 Farmer Dashboard (Ramesh Kumar) <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/admin/queue"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold px-6 py-3.5 rounded-2xl transition flex items-center gap-2 text-base"
            >
              📋 Mandi Operator Call Console
            </Link>

            <Link
              href="/admin/digital-twin"
              className="bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/40 font-bold px-5 py-3.5 rounded-2xl transition flex items-center gap-2 text-base"
            >
              🏛️ Yard Digital Twin
            </Link>

            <Link
              href="/ivr-simulator"
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold px-5 py-3.5 rounded-2xl transition flex items-center gap-2 text-base"
            >
              <PhoneCall className="w-5 h-5" /> Dial Voice IVR Helpline
            </Link>
          </div>

          {/* Core Farmer Value Questions */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-left max-w-5xl mx-auto">
            {[
              { q: 'Where should I go?', a: 'Smart Recommendation engine picks least congested mandi', icon: MapPin },
              { q: 'When should I go?', a: 'Dynamic 30-min procurement slots prevent bottlenecks', icon: Calendar },
              { q: 'How long will I wait?', a: 'Real-time countdown based on active counters & speed', icon: Clock },
              { q: 'What is my token?', a: 'Digital token with live position & counter number', icon: Users },
              { q: 'When should I leave?', a: 'Smart departure alert calculates travel time + buffer', icon: Truck },
              { q: 'What about payment?', a: 'Direct Benefit Transfer (DBT) tracker to bank account', icon: ShieldCheck },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
                <item.icon className="w-4 h-4 text-amber-300 mb-1" />
                <h4 className="text-xs font-bold text-white">{item.q}</h4>
                <p className="text-[10px] text-emerald-200 mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: Traditional Mandi vs MandiMitra */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Eliminating the 8-Hour Mandi Queue Ordeal
          </h2>
          <p className="text-sm text-slate-700">
            Real impact for 140+ million Indian farmers facing seasonal procurement bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-lg">
              <TrendingDown className="w-6 h-6 text-rose-600" />
              Traditional Mandi System
            </div>
            <ul className="space-y-3 text-sm text-rose-900">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Farmers arrive blindly at 4:00 AM without knowing queue length or centre overload.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Tractors and bullock carts parked for 6–10 hours outside the gate burning fuel.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Physical paper tokens get lost, manipulated, or cut in line arbitrarily.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                Uncertainty regarding quality assaying, weight, and bank payment disbursement.
              </li>
            </ul>
          </div>

          {/* MandiMitra */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              MandiMitra Smart Platform
            </div>
            <ul className="space-y-3 text-sm text-emerald-950">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                AI recommends the best centre based on distance, queue size, speed, and capacity.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <strong>No-Wait Departure Alert:</strong> "Don't leave home yet. Depart at 11:15 AM."
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                Live digital token updates in real-time as counters call and process farmers ahead.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                100% accessible via IVR voice calls, CSC Panchayat kiosks, and WhatsApp/SMS.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
              End-to-End Hackathon Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built on 12 Critical Differentiators
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '1. Smart Recommendation Engine',
                desc: 'Multi-factor weighted optimization across distance, queue density, processing speed, and yard headroom with full explainability.',
                link: '/farmer/recommendation',
                badge: 'Algorithm',
              },
              {
                title: '2. Live Queue & Calling Console',
                desc: 'Real-time FIFO queue tracking with Now Serving, Next, and operator controls to call, start, and complete procurement.',
                link: '/admin/queue',
                badge: 'Real-Time',
              },
              {
                title: '3. No-Wait Departure Alerts',
                desc: 'Calculates exact home departure times using queue countdown, vehicle travel time, and 15-minute buffers so farmers leave only when ready.',
                link: '/farmer/token',
                badge: 'Prediction',
              },
              {
                title: '4. Yard Digital Twin',
                desc: 'Physical twin of the mandi yard showing active weighbridges, trucks in yard, moisture assayers, and bottleneck risk index.',
                link: '/admin/digital-twin',
                badge: 'Digital Twin',
              },
              {
                title: '5. Deterministic Demand Engine',
                desc: 'Analyzes 15-min, 30-min, 60-min, slot, morning, and afternoon temporal windows to suggest counter allocations and traffic redirection.',
                link: '/admin/demand',
                badge: 'Demand Intelligence',
              },
              {
                title: '6. Grounded Multilingual Chatbot',
                desc: 'Trilingual assistant (English, Hindi, Marathi) with strict database priority — queries live tokens and payments without hallucination.',
                link: '/farmer/dashboard',
                badge: 'Grounded AI',
              },
              {
                title: '7. Voice IVR Helpline Simulator',
                desc: 'Non-smartphone voice telephony menu with DTMF keypad inputs (Press 1 for English, 2 for Hindi, 3 for Marathi) with SMS response.',
                link: '/ivr-simulator',
                badge: 'Voice IVR',
              },
              {
                title: '8. CSC / Panchayat Assisted Kiosk',
                desc: 'Specialized interface for Village Level Entrepreneurs (VLEs) to assist digitally illiterate farmers with tracked operator accountability.',
                link: '/farmer/assisted',
                badge: 'Inclusive Tech',
              },
              {
                title: '9. Transparent DBT Tracker',
                desc: 'End-to-end audit trail from weighing and quality grading to treasury approval and Aadhaar-linked direct benefit bank transfer.',
                link: '/farmer/payments',
                badge: 'FinTech',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Link
                    href={f.link}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    Explore Feature <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
