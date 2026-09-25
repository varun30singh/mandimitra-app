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
  ArrowRight,
  MapPin,
  Clock,
  Users,
} from 'lucide-react';

export default function RecommendationPage() {
  const { language, t } = useLanguage();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSliders, setShowSliders] = useState(false);
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
    <div className="space-y-4 bg-white text-emerald-950">
      {/* Header */}
      <div className="px-1 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-emerald-700" />
          AI Smart Recommendation
        </div>
        <h1 className="text-xl font-black text-emerald-950 font-serif">
          {language === 'hi' ? 'स्मार्ट खरीद केंद्र अनुशंसा' : (language === 'mr' ? 'स्मार्ट खरेदी केंद्र शिफारस' : 'Smart Centre Recommendation')}
        </h1>
        <p className="text-xs text-emerald-700">
          {language === 'hi'
            ? 'कतार की लंबाई, प्रतीक्षारत किसान, तौल की गति और उपलब्ध स्लॉट का समग्र विश्लेषण।'
            : 'Multi-factor algorithm optimizes distance, queue backlog, and wait time.'}
        </p>
      </div>

      {/* Top Highlight Card */}
      {topRec && (
        <SmartRecommendationCard recommendation={topRec} />
      )}

      {/* Configurable Weight Sliders Toggle */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-100 shadow-xs space-y-3">
        <button
          type="button"
          onClick={() => setShowSliders(!showSliders)}
          className="w-full flex items-center justify-between text-xs font-bold text-emerald-950"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-700" />
            {showSliders ? 'Hide Algorithm Weights' : 'Adjust Priority Weights (Tuning)'}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {showSliders ? '▲ Close' : '▼ Expand'}
          </span>
        </button>

        {showSliders && (
          <div className="space-y-3 pt-2 border-t border-emerald-100">
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-emerald-900 mb-1">
                <span>Distance Priority</span>
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
              <div className="flex justify-between text-[11px] font-semibold text-emerald-900 mb-1">
                <span>Queue Length Priority</span>
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
              <div className="flex justify-between text-[11px] font-semibold text-emerald-900 mb-1">
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
              <div className="flex justify-between text-[11px] font-semibold text-emerald-900 mb-1">
                <span>Available Capacity</span>
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
          </div>
        )}
      </div>

      {/* Ranked Centres List */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-black text-emerald-950 px-1">
          All Mandi Centres Ranked
        </h2>

        <div className="space-y-3">
          {recommendations.map((r, index) => (
            <div
              key={r.centre.id}
              className={`bg-white rounded-2xl p-4 border transition ${
                r.isTopRecommendation
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                  : 'border-emerald-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    index === 0
                      ? 'bg-amber-400 text-emerald-950'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-emerald-950">{r.centre.name}</h3>
                    <p className="text-[11px] text-emerald-700">{r.centre.taluka} • {r.metrics.distanceKm} km away</p>
                  </div>
                </div>

                <span className="bg-emerald-700 text-white text-[11px] font-black px-2.5 py-1 rounded-xl">
                  {r.recommendationScore} pts
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-center text-xs mt-3">
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Queue</span>
                  <span className="font-extrabold text-emerald-950">{r.metrics.queueLength}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Wait</span>
                  <span className="font-extrabold text-emerald-700">~{r.metrics.estimatedWaitMinutes}m</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-semibold block">Capacity</span>
                  <span className="font-extrabold text-emerald-950">{r.metrics.capacityUtilization}%</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end">
                <Link
                  href={`/farmer/book?centreId=${r.centre.id}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
                >
                  Book Slot <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
