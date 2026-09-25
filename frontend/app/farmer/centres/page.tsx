'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { MapPin, Clock, Users, ArrowRight, Sparkles, Sliders } from 'lucide-react';

export default function FarmerCentresPage() {
  const { language, t } = useLanguage();
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-serif">
            {t('nearby_centres')}
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Real-time live queue, wait times, and open slots for all procurement centres.
          </p>
        </div>

        <Link
          href="/farmer/recommendation"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {t('get_recommendation')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centres.map((c) => {
          let badgeColor = 'bg-emerald-100 text-emerald-800';
          if (c.waitLevel === 'Moderate') badgeColor = 'bg-amber-100 text-amber-800';
          else if (c.waitLevel === 'Busy') badgeColor = 'bg-orange-100 text-orange-800';
          else if (c.waitLevel === 'Full') badgeColor = 'bg-rose-100 text-rose-800';

          return (
            <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700">{c.code}</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                    {c.waitLevel}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">{c.name}</h3>
                <p className="text-xs text-slate-700 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {c.distanceKm} km • {c.address}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-700 block">Current Queue:</span>
                    <span className="text-base font-bold text-slate-900">{c.currentQueue} waiting</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Estimated Wait:</span>
                    <span className="text-base font-bold text-emerald-700">~{c.estimatedWaitMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Available Slots:</span>
                    <span className="text-sm font-bold text-amber-600">{c.availableSlots} open</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Capacity Util:</span>
                    <span className="text-sm font-bold text-slate-800">{c.capacityUtilization}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-700">Speed: ~{c.processingSpeed}m/farmer</span>
                <Link
                  href={`/farmer/book?centreId=${c.id}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 shadow-2xs"
                >
                  Book Slot <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
