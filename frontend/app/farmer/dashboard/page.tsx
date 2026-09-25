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
  Wheat,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const farmerRes = await fetchApi('/farmers/MH-NAS-2026-0812');
      setFarmer(farmerRes);

      const activeTok = await fetchApi(`/queue/farmer/${farmerRes.id}/active`);
      setTokenData(activeTok);

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
    <div className="space-y-5 bg-white text-emerald-950">
      {/* Top Greeting Card */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {t('good_morning')},
            </span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
              ✓ Verified
            </span>
          </div>

          <h1 className="text-2xl font-black text-emerald-950 font-serif">
            {farmer ? farmer.fullName : 'Ramesh Kumar'}
          </h1>

          <div className="flex items-center gap-2 text-xs text-emerald-800">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {farmer ? `${farmer.village}, ${farmer.taluka}` : 'Pimpalgaon, Niphad'}
            </span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">गेहूँ (Wheat)</span>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={refreshing}
          className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Main Token & Procurement Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-black text-emerald-950 flex items-center gap-1.5">
            <Wheat className="w-4 h-4 text-emerald-600" />
            {t('your_procurement')}
          </h2>
          <span className="text-[11px] font-bold text-emerald-700">
            Live Queue Sync
          </span>
        </div>

        <TokenLiveTracker
          tokenData={tokenData}
          onRefresh={loadDashboardData}
          compact={false}
        />
      </div>

      {/* Quick Booking Action Strip */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/farmer/book"
          className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold p-4 rounded-2xl shadow-xs transition flex flex-col justify-between"
        >
          <Calendar className="w-5 h-5 text-amber-300 mb-2" />
          <div>
            <div className="text-sm font-black leading-tight">{t('book_slot')}</div>
            <div className="text-[11px] text-emerald-100 mt-0.5">30-min guaranteed</div>
          </div>
        </Link>

        <Link
          href="/farmer/recommendation"
          className="bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-bold p-4 rounded-2xl border border-emerald-200 shadow-xs transition flex flex-col justify-between"
        >
          <Sparkles className="w-5 h-5 text-emerald-600 mb-2" />
          <div>
            <div className="text-sm font-black leading-tight">
              {language === 'hi' ? 'सर्वश्रेष्ठ मंडी चुनें' : 'Best Mandi'}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Zero wait prediction</div>
          </div>
        </Link>
      </div>

      {/* Nearby Centres Cards */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-black text-emerald-950 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            {t('nearby_centres')}
          </h2>
          <Link
            href="/farmer/centres"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {centres.slice(0, 3).map((c) => {
            let badgeBg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            if (c.waitLevel === 'Moderate') badgeBg = 'bg-amber-100 text-amber-900 border-amber-300';
            else if (c.waitLevel === 'Busy') badgeBg = 'bg-orange-100 text-orange-900 border-orange-300';
            else if (c.waitLevel === 'Full') badgeBg = 'bg-rose-100 text-rose-900 border-rose-300';

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-emerald-950">{c.name}</h3>
                    <div className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                      <span>{c.distanceKm} km away</span>
                      <span>•</span>
                      <span>{c.taluka}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                    {c.waitLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-emerald-50/50 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block">Queue</span>
                    <span className="font-extrabold text-emerald-950">{c.currentQueue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block">Est. Wait</span>
                    <span className="font-extrabold text-emerald-700">~{c.estimatedWaitMinutes}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-800 font-semibold block">Open Slots</span>
                    <span className="font-extrabold text-emerald-950">{c.availableSlots}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-emerald-700 text-[11px]">
                    Speed: ~{c.processingSpeed}m/farmer
                  </span>
                  <Link
                    href={`/farmer/book?centreId=${c.id}`}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 text-xs shadow-2xs"
                  >
                    Select <ArrowRight className="w-3 h-3" />
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
