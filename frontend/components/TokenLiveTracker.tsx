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
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {language === 'hi' ? 'आज के लिए कोई सक्रिय टोकन नहीं' : (language === 'mr' ? 'आजसाठी कोणताही सक्रिय टोकन नाही' : 'No Active Procurement Token Today')}
        </h3>
        <p className="text-sm text-slate-700 mt-1 max-w-md mx-auto">
          {language === 'hi'
            ? 'बिना इंतज़ार अपनी फसल बेचने के लिए स्मार्ट केंद्र चुनें और टोकन स्लॉट बुक करें।'
            : (language === 'mr'
            ? 'मंडीत तासन् तास न थांबता शेड्युलिंगसाठी त्वरित स्लॉट बुक करा.'
            : 'Avoid waiting in long mandi lines. Schedule a smart appointment slot and get your digital token.')}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/farmer/book"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
          >
            {t('book_slot')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/farmer/recommendation"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> {t('get_recommendation')}
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
    <div className="bg-gradient-to-b from-white to-emerald-50/30 rounded-3xl border-2 border-emerald-200 shadow-md overflow-hidden">
      {/* Top Banner: No-Wait Smart Arrival Guidance (Section 12) */}
      <div
        className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white ${
          isDepartureAlert
            ? 'bg-gradient-to-r from-amber-600 to-orange-600'
            : isDoNotLeave
            ? 'bg-gradient-to-r from-emerald-800 to-teal-800'
            : 'bg-gradient-to-r from-emerald-700 to-green-700'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            {isDepartureAlert ? (
              <Truck className="w-6 h-6 text-white animate-bounce" />
            ) : isDoNotLeave ? (
              <Clock className="w-6 h-6 text-emerald-200" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20">
                {language === 'hi' ? 'स्मार्ट प्रस्थान सलाह' : (language === 'mr' ? 'स्मार्ट प्रवासाचा सल्ला' : 'Smart Departure Guidance')}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-0.5">{statusMessage}</h3>
            <p className="text-xs text-white/90">{subMessage}</p>
          </div>
        </div>

        {isDoNotLeave && (
          <div className="bg-white/10 backdrop-blur-xs rounded-xl px-4 py-2 border border-white/20 text-right shrink-0">
            <div className="text-[11px] text-emerald-200 font-medium">
              {language === 'hi' ? 'घर से निकलने का समय' : (language === 'mr' ? 'निघण्याची शिफारस वेळ' : 'Recommended Departure')}
            </div>
            <div className="text-base font-bold text-white">{recommendedDepartureTime}</div>
            <div className="text-[10px] text-emerald-300">
              ({travelEstimateMinutes}m {language === 'hi' ? 'यात्रा' : 'travel'} + {bufferMinutes}m buffer)
            </div>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Token Badge */}
          <div className="bg-emerald-800 text-white rounded-2xl p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-center text-xs text-emerald-200 font-medium">
                <span>{language === 'hi' ? 'आपका टोकन' : (language === 'mr' ? 'तुमचा टोकन' : 'YOUR TOKEN')}</span>
                <span className="bg-emerald-700 px-2 py-0.5 rounded-full text-white font-bold">
                  {token.status}
                </span>
              </div>
              <div className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-amber-300">
                {token.tokenNumber}
              </div>
              <div className="text-xs text-emerald-100 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-semibold">{centre.name}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs">
              <span className="text-emerald-200">
                {token.booking?.crop} • {token.booking?.quantity} qtl
              </span>
              <span className="text-emerald-100 font-medium">Slot: {token.appointmentTime}</span>
            </div>
          </div>

          {/* Real-Time Queue Status Matrix */}
          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'hi' ? 'आगे किसान' : (language === 'mr' ? 'पुढे शेतकरी' : 'Farmers Ahead')}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{farmersAhead}</div>
              <div className="text-[11px] text-slate-700">
                {language === 'hi' ? 'कतार स्थिति' : (language === 'mr' ? 'रांगेतील क्रमांक' : 'Queue Pos')}: #{queuePosition}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {t('estimated_wait')}
              </div>
              <div className="text-3xl font-extrabold text-blue-600 mt-1">
                {estimatedWaitMinutes} <span className="text-sm font-normal text-slate-700">min</span>
              </div>
              <div className="text-[11px] text-slate-700">
                ~{centre.avgProcessingMinutes}m / {language === 'hi' ? 'किसान' : 'farmer'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-amber-600" />
                {t('estimated_turn')}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {estimatedCallTime}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">
                {language === 'hi' ? 'डायनामिक गणना' : 'Dynamic ETA'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'hi' ? 'काउंटर पर' : (language === 'mr' ? 'सध्या सुरू' : 'Now Serving')}
              </div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                {currentServing ? currentServing.tokenNumber : 'B-035'}
              </div>
              <div className="text-[11px] text-slate-700">
                {language === 'hi' ? 'अगला' : 'Next'}: {nextInLine ? nextInLine.tokenNumber : 'B-036'}
              </div>
            </div>
          </div>
        </div>

        {/* Live Queue Visual Stepper (Section 10) */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-3">
            <span>LIVE APPOINTMENT TIMELINE & SERVICE FLOW</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Realtime Sync
            </span>
          </div>

          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: token.status === 'COMPLETED' ? '100%' : '65%' }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">Booked</span>
              <span className="text-[10px] text-slate-600">{token.appointmentTime}</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-1">
                {language === 'hi' ? 'गेट चेक-इन' : 'Gate Checked-in'}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">In Yard</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white ring-4 ring-amber-100 flex items-center justify-center font-bold text-xs shadow-md animate-pulse">
                {queuePosition}
              </div>
              <span className="text-[11px] font-bold text-amber-700 mt-1">
                {language === 'hi' ? 'आपकी बारी' : 'Your Turn'}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">{estimatedCallTime}</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">
                {language === 'hi' ? 'तौल व गुणवत्ता' : 'Assaying & Weighing'}
              </span>
              <span className="text-[10px] text-slate-600">Counter 1-4</span>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">
                {language === 'hi' ? 'डीबीटी भुगतान' : 'DBT Payment'}
              </span>
              <span className="text-[10px] text-slate-600">Direct Benefit</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        {!compact && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Link
                href="/farmer/token"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
              >
                <Clock className="w-4 h-4" /> {t('track_my_token')}
              </Link>
              <Link
                href="/farmer/recommendation"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" /> {t('get_recommendation')}
              </Link>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium py-1.5 px-3 rounded-lg hover:bg-emerald-50 transition"
              >
                ↻ Refresh Live Queue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
