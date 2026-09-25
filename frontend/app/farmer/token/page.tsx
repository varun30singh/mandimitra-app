'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { TokenLiveTracker } from '../../../components/TokenLiveTracker';
import {
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Truck,
  PhoneCall,
  Share2,
} from 'lucide-react';

function TokenTrackerContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const paramToken = searchParams.get('token');

  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const loadToken = async () => {
    try {
      setLoading(true);
      if (paramToken) {
        const res = await fetchApi(`/queue/token/${paramToken}`);
        setTokenDetails(res);
      } else {
        const farmer = await fetchApi('/farmers/MH-NAS-2026-0812');
        const activeRes = await fetchApi(`/queue/farmer/${farmer.id}/active`);
        setTokenDetails(activeRes);
      }
    } catch (err) {
      console.error('Failed to load token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
    const interval = setInterval(loadToken, 6000);
    return () => clearInterval(interval);
  }, [paramToken]);

  const handleGateCheckIn = async () => {
    if (!tokenDetails?.token?.id) return;
    try {
      setCheckingIn(true);
      await fetchApi(`/queue/${tokenDetails.token.id}/check-in`, {
        method: 'POST',
        body: JSON.stringify({ operatorName: 'Gate Self-Kiosk' }),
      });
      await loadToken();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Live Queue Tracking • Active Turn Countdown
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-serif mt-1">
            {language === 'hi' ? 'डिजिटल टोकन एवं आगमन स्टेटस' : (language === 'mr' ? 'डिजिटल टोकन व आगमन स्थिती' : 'Digital Token & Live Queue Tracker')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadToken}
            className="text-xs bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Live Card */}
      <TokenLiveTracker tokenData={tokenDetails} onRefresh={loadToken} />

      {/* Digital Mandi Gate Pass / QR Code Card */}
      {tokenDetails && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-mono text-xs px-3 py-1 rounded-md">
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              MANDI ENTRY PASS QR CODE
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {language === 'hi' ? 'मंडी प्रवेश द्वार पर यह पास दिखाएँ' : 'Scan at Mandi Gate / Weighbridge'}
            </h3>
            <p className="text-xs text-slate-700 max-w-md">
              {language === 'hi'
                ? 'केंद्र पर पहुँचने पर गेट ऑपरेटर या सेल्फ़-चेकइन कियोस्क पर यह टोकन दिखाएँ।'
                : 'Present this digital pass at the entrance weighbridge for priority RFID vehicle barcode tag.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              {tokenDetails.token.status === 'BOOKED' && (
                <button
                  onClick={handleGateCheckIn}
                  disabled={checkingIn}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  {checkingIn ? 'Checking in...' : (language === 'hi' ? 'मैं मंडी पहुँच गया हूँ (चेक-इन)' : 'I Have Arrived at Mandi (Check In)')}
                </button>
              )}
            </div>
          </div>

          {/* Simulated QR Code Graphic */}
          <div className="bg-emerald-950 text-white p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 border-4 border-amber-300 shadow-md text-center w-52">
            <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center shadow-inner">
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-slate-900 rounded-sm">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-2xs ${
                      (i % 2 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-xs font-mono font-bold text-amber-300">
              {tokenDetails.token.tokenNumber}
            </div>
            <div className="text-[10px] text-emerald-200">MH-GOV-PROC-2026</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TokenTrackerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="p-12 text-center text-slate-700">Loading token tracker...</div>}>
        <TokenTrackerContent />
      </Suspense>
    </div>
  );
}
