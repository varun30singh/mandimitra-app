'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export default function DemandIntelligencePage() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDemand = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/demand/summary');
      setSummaries(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemand();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-700" />
            Section 13: Deterministic Demand Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Temporal Window Demand Intelligence & Queue Pressure
          </h1>
          <p className="text-xs text-slate-700">
            Temporal demand modeling across 15-min, 30-min, 60-min, morning, and afternoon windows.
          </p>
        </div>

        <button
          onClick={loadDemand}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-600" /> Refresh Demand Model
        </button>
      </div>

      {/* Grid of Centre Demand Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaries.map((d) => {
          const isCritical = d.currentDemand === 'CRITICAL' || d.queuePressure >= 0.8;
          const isHigh = d.currentDemand === 'HIGH';

          return (
            <div
              key={d.centreId}
              className={`bg-white rounded-3xl p-6 border shadow-xs space-y-6 ${
                isCritical
                  ? 'border-rose-300 ring-2 ring-rose-200'
                  : isHigh
                  ? 'border-amber-300'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{d.centreName}</h3>
                  <div className="text-xs text-slate-700 mt-0.5">
                    Throughput: {d.processingThroughput} farmers/hr • Trend: <strong>{d.trend}</strong>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isCritical
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                      : isHigh
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  Demand: {d.currentDemand}
                </span>
              </div>

              {/* Gauge Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-semibold">Queue Pressure</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {Math.round(d.queuePressure * 100)}%
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${d.queuePressure > 0.8 ? 'bg-rose-600' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.round(d.queuePressure * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-semibold">Yard Capacity</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {Math.round(d.capacityUtilization * 100)}%
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${d.capacityUtilization > 0.8 ? 'bg-rose-600' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.round(d.capacityUtilization * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] text-slate-700 block font-semibold">Slot Pressure</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {Math.round(d.slotPressure * 100)}%
                  </span>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${Math.round(d.slotPressure * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Temporal Windows Table (Section 13) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Temporal Demand Horizons
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {d.temporalWindows.map((tw: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="font-semibold text-slate-900">{tw.label}</div>
                      <div className="text-[10px] text-slate-700">{tw.timeRange}</div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">{tw.projectedArrivals} arr.</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                          tw.demandLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : (tw.demandLevel === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                        }`}>
                          {tw.demandLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Recommended Operational Action:</span>
                <p className="text-slate-700">{d.recommendedAction}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
