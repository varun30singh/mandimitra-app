'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { TokenLiveTracker } from '../../../components/TokenLiveTracker';
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  RefreshCw,
  Wheat,
  UserCheck,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load demo farmer (Ramesh Kumar - MH-NAS-2026-0812)
  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      // Fetch Ramesh profile
      const farmerRes = await fetchApi('/farmers/MH-NAS-2026-0812');
      setFarmer(farmerRes);

      // Fetch Ramesh active token details
      const activeTok = await fetchApi(`/queue/farmer/${farmerRes.id}/active`);
      setTokenData(activeTok);

      // Fetch nearby centres with live operational metrics
      const centresRes = await fetchApi('/centres?lat=20.1700&lng=74.0500');
      setCentres(centresRes);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Section: Good Morning, Farmer (Section 7) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
              {t('good_morning')},
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Verified
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {farmer ? farmer.fullName : 'Ramesh Kumar'}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700 pt-1">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
              ID: {farmer ? farmer.farmerId : 'MH-NAS-2026-0812'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {farmer ? `${farmer.village}, ${farmer.taluka}` : 'Pimpalgaon, Niphad, Nashik'}
            </span>
            <span>•</span>
            <span>Crop: Wheat (गेहूँ)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            {refreshing ? 'Updating live...' : 'Refresh Status'}
          </button>

          <Link
            href="/farmer/book"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> {t('book_slot')}
          </Link>
        </div>
      </div>

      {/* Main Card: Your Procurement (Section 7) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-emerald-600" />
            {t('your_procurement')}
          </h2>
          <span className="text-xs text-slate-700">Live Queue & Smart Departure</span>
        </div>

        <TokenLiveTracker
          tokenData={tokenData}
          onRefresh={loadDashboardData}
        />
      </div>

      {/* Nearby Centres List (Section 7) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              {t('nearby_centres')}
            </h2>
            <p className="text-xs text-slate-700">
              Live wait times, queue lengths, processing speed & capacity utilization
            </p>
          </div>

          <Link
            href="/farmer/recommendation"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('get_recommendation')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {centres.map((c) => {
            let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            if (c.waitLevel === 'Moderate') badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
            else if (c.waitLevel === 'Busy') badgeBg = 'bg-orange-100 text-orange-800 border-orange-200';
            else if (c.waitLevel === 'Full') badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-700 font-bold">{c.code}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                      {c.waitLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">{c.name}</h3>
                  <div className="text-xs text-slate-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{c.distanceKm} km away</span>
                    <span>•</span>
                    <span>{c.taluka}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-700 block">Queue Length:</span>
                      <span className="text-base font-extrabold text-slate-900">{c.currentQueue} farmers</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-700 block">Estimated Wait:</span>
                      <span className="text-base font-extrabold text-emerald-700">{c.estimatedWaitMinutes} min</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-700 block">Capacity Util:</span>
                      <span className="text-sm font-bold text-slate-800">{c.capacityUtilization}%</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-700 block">Open Slots:</span>
                      <span className="text-sm font-bold text-amber-600">{c.availableSlots} left</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-700">
                    Speed: ~{c.processingSpeed}m/farmer
                  </span>
                  <Link
                    href={`/farmer/book?centreId=${c.id}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    Select Slot <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
