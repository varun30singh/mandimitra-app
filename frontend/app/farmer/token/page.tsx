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
    <div className="space-y-4 bg-white text-emerald-950">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            ● Real-Time Queue Sync
          </span>
          <h1 className="text-xl font-black text-emerald-950 font-serif">
            {language === 'hi' ? 'मेरा डिजिटल टोकन' : (language === 'mr' ? 'माझा डिजिटल टोकन' : 'My Digital Token')}
          </h1>
        </div>

        <button
          onClick={loadToken}
          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
          Refresh
        </button>
      </div>

      {/* Main Live Card */}
      <TokenLiveTracker tokenData={tokenDetails} onRefresh={loadToken} />

      {/* Digital Mandi Gate Pass QR Code Card */}
      {tokenDetails && (
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-200">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            MANDI ENTRY PASS QR
          </div>

          <p className="text-xs text-emerald-800 max-w-xs mx-auto">
            {language === 'hi'
              ? 'मंडी प्रवेश द्वार पर यह डिजिटल पास दिखाएँ।'
              : 'Show this digital pass at the entrance weighbridge gate.'}
          </p>

          {/* QR Box */}
          <div className="bg-emerald-900 text-white p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 border-emerald-600 shadow-sm mx-auto w-44">
            <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shadow-inner">
              <div className="grid grid-cols-6 gap-1 w-full h-full p-1 bg-emerald-950 rounded-xs">
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
          </div>

          {tokenDetails.token.status === 'BOOKED' && (
            <button
              onClick={handleGateCheckIn}
              disabled={checkingIn}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              {checkingIn ? 'Checking in...' : (language === 'hi' ? 'मैं मंडी पहुँच गया हूँ (चेक-इन)' : 'I Have Arrived at Mandi (Check In)')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TokenTrackerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-emerald-700">Loading token...</div>}>
      <TokenTrackerContent />
    </Suspense>
  );
}
