'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { MapPin, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="space-y-4 bg-white text-emerald-950">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-emerald-950 font-serif">
            {t('nearby_centres')}
          </h1>
          <p className="text-xs text-emerald-700">
            Real-time live queue and wait times across all mandis
          </p>
        </div>

        <Link
          href="/farmer/recommendation"
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          {language === 'hi' ? 'स्मार्ट सुझाव' : 'AI Pick'}
        </Link>
      </div>

      <div className="space-y-3">
        {centres.map((c) => {
          let badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
          if (c.waitLevel === 'Moderate') badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
          else if (c.waitLevel === 'Busy') badgeColor = 'bg-orange-100 text-orange-900 border-orange-300';
          else if (c.waitLevel === 'Full') badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';

          return (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <h3 className="text-base font-black text-emerald-950 mt-1">{c.name}</h3>
                  <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{c.distanceKm} km away</span>
                    <span>•</span>
                    <span>{c.taluka}</span>
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                  {c.waitLevel}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-emerald-50/50 p-2.5 rounded-2xl text-center text-xs">
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Queue</span>
                  <span className="font-extrabold text-emerald-950">{c.currentQueue}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Wait</span>
                  <span className="font-extrabold text-emerald-700">~{c.estimatedWaitMinutes}m</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Capacity</span>
                  <span className="font-extrabold text-emerald-950">{c.capacityUtilization}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Slots</span>
                  <span className="font-extrabold text-emerald-700">{c.availableSlots}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-emerald-700 text-[11px]">
                  Speed: ~{c.processingSpeed}m/farmer
                </span>
                <Link
                  href={`/farmer/book?centreId=${c.id}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 text-xs shadow-xs"
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
