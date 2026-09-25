'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { SmartRecommendationCard } from '../../../components/SmartRecommendationCard';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  Percent,
} from 'lucide-react';

export default function RecommendationPage() {
  const { language, t } = useLanguage();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weights, setWeights] = useState({
    distance: 0.20,
    queue: 0.25,
    speed: 0.15,
    capacity: 0.20,
    slotAvailability: 0.20,
  });

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/recommendations/calculate', {
        method: 'POST',
        body: JSON.stringify({
          lat: 20.1700,
          lng: 74.0500,
          weights,
        }),
      });
      setRecommendations(res);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [weights]);

  const topRec = recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          MandiMitra Decision Intelligence
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
          {language === 'hi' ? 'स्मार्ट खरीद केंद्र अनुशंसा' : (language === 'mr' ? 'स्मार्ट खरेदी केंद्र शिफारस' : 'Smart Centre Recommendation Engine')}
        </h1>
        <p className="text-sm text-slate-700 max-w-3xl">
          {language === 'hi'
            ? 'केवल निकटतम केंद्र नहीं, बल्कि कतार की लंबाई, प्रतीक्षारत किसान, तौल की गति और यार्ड में उपलब्ध स्थान का समग्र विश्लेषण।'
            : 'We do not simply recommend the closest centre. MandiMitra optimizes distance, queue backlog, processing throughput, and capacity headroom to minimize your total trip time.'}
        </p>
      </div>

      {/* Top Highlight Card (Section 8) */}
      {topRec && (
        <SmartRecommendationCard recommendation={topRec} />
      )}

      {/* Configurable Weight Sliders (Section 8: The weights must be configurable) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              Interactive Scoring Weights (Algorithmic Tuning)
            </h2>
          </div>
          <span className="text-xs text-slate-700">
            Adjust priorities to see real-time recommendation recalculation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Distance Weight</span>
              <span className="text-emerald-700 font-bold">{Math.round(weights.distance * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.distance}
              onChange={(e) => setWeights({ ...weights, distance: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Queue Length Weight</span>
              <span className="text-emerald-700 font-bold">{Math.round(weights.queue * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.queue}
              onChange={(e) => setWeights({ ...weights, queue: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Processing Speed</span>
              <span className="text-emerald-700 font-bold">{Math.round(weights.speed * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.speed}
              onChange={(e) => setWeights({ ...weights, speed: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Remaining Capacity</span>
              <span className="text-emerald-700 font-bold">{Math.round(weights.capacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.capacity}
              onChange={(e) => setWeights({ ...weights, capacity: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Slot Availability</span>
              <span className="text-emerald-700 font-bold">{Math.round(weights.slotAvailability * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={weights.slotAvailability}
              onChange={(e) => setWeights({ ...weights, slotAvailability: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Comparative Ranking Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Comparative Ranking & Factor Breakdown
        </h2>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Rank / Centre</th>
                  <th className="px-4 py-4">Overall Score</th>
                  <th className="px-4 py-4">Distance</th>
                  <th className="px-4 py-4">Active Queue</th>
                  <th className="px-4 py-4">Est. Wait</th>
                  <th className="px-4 py-4">Capacity Util</th>
                  <th className="px-4 py-4">Slots</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendations.map((r, index) => (
                  <tr
                    key={r.centre.id}
                    className={`hover:bg-slate-50 transition ${
                      r.isTopRecommendation ? 'bg-emerald-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-emerald-950 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">{r.centre.name}</div>
                          <div className="text-[11px] text-slate-700 font-mono">{r.centre.code}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`font-black text-sm px-2.5 py-1 rounded-lg ${
                        index === 0
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.recommendationScore}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {r.metrics.distanceKm} km
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {r.metrics.queueLength} farmers
                    </td>

                    <td className="px-4 py-4 font-semibold text-emerald-700">
                      ~{r.metrics.estimatedWaitMinutes} min
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.metrics.capacityUtilization > 85 ? 'bg-rose-500' : (r.metrics.capacityUtilization > 65 ? 'bg-amber-500' : 'bg-emerald-500')
                            }`}
                            style={{ width: `${r.metrics.capacityUtilization}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{r.metrics.capacityUtilization}%</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-amber-700">
                      {r.metrics.availableSlotsCount} open
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/farmer/book?centreId=${r.centre.id}`}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 ${
                          index === 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Book Slot <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
