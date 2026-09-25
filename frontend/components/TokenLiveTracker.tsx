'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/language-context';
import {
  Clock,
  MapPin,
  Users,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TokenTrackerProps {
  tokenData: any;
  onRefresh?: () => void;
  compact?: boolean;
}

export const TokenLiveTracker: React.FC<TokenTrackerProps> = ({
  tokenData,
  onRefresh,
  compact = false,
}) => {
  const { language, t } = useLanguage();

  if (!tokenData || !tokenData.token) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-emerald-950">
          {language === 'hi' ? 'आज के लिए कोई सक्रिय टोकन नहीं' : (language === 'mr' ? 'आजसाठी कोणताही सक्रिय टोकन नाही' : 'No Active Procurement Token Today')}
        </h3>
        <p className="text-xs text-emerald-800 max-w-sm mx-auto">
          {language === 'hi'
            ? 'बिना इंतज़ार अपनी फसल बेचने के लिए स्मार्ट केंद्र चुनें और टोकन स्लॉट बुक करें।'
            : 'Avoid waiting in long mandi lines. Schedule a guaranteed appointment slot.'}
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Link
            href="/farmer/book"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            {t('book_slot')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/farmer/recommendation"
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-200 transition"
          >
            {t('get_recommendation')}
          </Link>
        </div>
      </div>
    );
  }

  const {
    token,
    centre,
    currentServing,
    nextInLine,
    queuePosition,
    farmersAhead,
    estimatedWaitMinutes,
    estimatedCallTime,
    recommendedDepartureTime,
    travelEstimateMinutes,
    bufferMinutes,
    arrivalStatus,
    statusMessage,
    subMessage,
  } = tokenData;

  const isDepartureAlert = arrivalStatus === 'START_TRAVEL' || arrivalStatus === 'GET_READY';
  const isDoNotLeave = arrivalStatus === 'DO_NOT_LEAVE_YET';

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-sm overflow-hidden text-emerald-950">
      {/* Top Banner: No-Wait Smart Arrival Guidance (Section 12) */}
      <div
        className={`px-4 py-3 flex items-start justify-between gap-2.5 text-white ${
          isDepartureAlert
            ? 'bg-amber-600'
            : isDoNotLeave
            ? 'bg-emerald-800'
            : 'bg-emerald-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            {isDepartureAlert ? (
              <Truck className="w-5 h-5 text-white animate-bounce" />
            ) : isDoNotLeave ? (
              <Clock className="w-5 h-5 text-white" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white/20">
              {language === 'hi' ? 'प्रस्थान सलाह' : 'Departure Guide'}
            </span>
            <h3 className="text-sm font-black leading-tight mt-0.5">{statusMessage}</h3>
            <p className="text-[11px] text-white/90 leading-tight">{subMessage}</p>
          </div>
        </div>

        {isDoNotLeave && (
          <div className="bg-white/10 backdrop-blur-xs rounded-xl px-2.5 py-1.5 border border-white/20 text-right shrink-0">
            <span className="text-[9px] text-emerald-200 font-bold block">Depart At</span>
            <span className="text-xs font-black text-white">{recommendedDepartureTime}</span>
          </div>
        )}
      </div>

      {/* Main Token Info Card */}
      <div className="p-4 space-y-4">
        {/* Token Badge & Mandi */}
        <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              YOUR TOKEN
            </span>
            <span className="text-3xl font-black text-emerald-900 tracking-tight">
              {token.tokenNumber}
            </span>
            <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{centre.name}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-emerald-200 text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-full block w-fit ml-auto">
              {token.status}
            </span>
            <span className="text-xs text-emerald-700 font-medium block mt-1">
              Slot: {token.appointmentTime}
            </span>
            <span className="text-[11px] text-emerald-800 font-bold block">
              {token.booking?.crop} • {token.booking?.quantity} qtl
            </span>
          </div>
        </div>

        {/* 4-Box Queue Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              Farmers Ahead
            </span>
            <span className="text-2xl font-black text-emerald-950 block mt-0.5">{farmersAhead}</span>
            <span className="text-[10px] text-emerald-700 font-medium">Position #{queuePosition}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              Est. Wait
            </span>
            <span className="text-2xl font-black text-emerald-700 block mt-0.5">
              {estimatedWaitMinutes} <span className="text-xs font-normal">min</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">Turn ~{estimatedCallTime}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Now Serving</span>
            <span className="text-xl font-black text-emerald-900 block mt-0.5">
              {currentServing ? currentServing.tokenNumber : 'B-035'}
            </span>
            <span className="text-[10px] text-emerald-700">Counter #1</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Next in Line</span>
            <span className="text-xl font-black text-amber-600 block mt-0.5">
              {nextInLine ? nextInLine.tokenNumber : 'B-036'}
            </span>
            <span className="text-[10px] text-emerald-700">Counter #2</span>
          </div>
        </div>

        {/* Action Button */}
        {!compact && (
          <div className="pt-1">
            <Link
              href="/farmer/token"
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
            >
              <Clock className="w-4 h-4" /> {t('track_my_token')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
