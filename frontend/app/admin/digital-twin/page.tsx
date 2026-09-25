'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import {
  Sparkles,
  Activity,
  Truck,
  Users,
  Clock,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export default function DigitalTwinPage() {
  const [centreId, setCentreId] = useState('');
  const [centres, setCentres] = useState<any[]>([]);
  const [twinData, setTwinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      if (res.length > 0) {
        setCentreId(res[0].id);
      }
    });
  }, []);

  const loadTwin = async () => {
    if (!centreId) return;
    try {
      setLoading(true);
      const res = await fetchApi(`/centres/${centreId}/digital-twin`);
      setTwinData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTwin();
    const interval = setInterval(loadTwin, 6000);
    return () => clearInterval(interval);
  }, [centreId]);

  if (!twinData) return null;

  const { centre, digitalTwin } = twinData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Section 14: Mandi Yard Digital Twin Simulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
            Real-Time Mandi Operations Digital Twin
          </h1>
          <p className="text-xs text-slate-700">
            Real-time physical representation of gate arrivals, weighing platforms, quality assaying, and yard capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={centreId}
            onChange={(e) => setCentreId(e.target.value)}
            className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900"
          >
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={loadTwin}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Digital Twin Operational State Matrix (Section 14) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Total Capacity</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{digitalTwin.capacity}</span>
          <span className="text-[10px] text-slate-700">Farmers max</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Current in Yard</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{digitalTwin.currentInYard}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Vehicles/Farmers</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Utilization</span>
          <span className={`text-2xl font-black mt-1 block ${digitalTwin.utilizationPercentage > 85 ? 'text-rose-600' : 'text-blue-700'}`}>
            {digitalTwin.utilizationPercentage}%
          </span>
          <span className="text-[10px] text-slate-700">Headroom {100 - digitalTwin.utilizationPercentage}%</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Active Counters</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{digitalTwin.activeCounters}/5</span>
          <span className="text-[10px] text-emerald-600 font-medium">Scales Open</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Avg Processing</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{digitalTwin.avgProcessingTime}</span>
          <span className="text-[10px] text-slate-700">min / farmer</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Avg Waiting</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{digitalTwin.avgWaitTime}</span>
          <span className="text-[10px] text-slate-700">min estimated</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Throughput</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">{digitalTwin.throughputFarmersPerHour}</span>
          <span className="text-[10px] text-slate-700">farmers / hour</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-700 uppercase block">Served Today</span>
          <span className="text-2xl font-black text-emerald-800 mt-1 block">{digitalTwin.completedCount}</span>
          <span className="text-[10px] text-slate-700">of {digitalTwin.todayTotalFarmers} total</span>
        </div>
      </div>

      {/* Visual Mandi Yard Simulation Graphic */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-300">
              PHYSICAL MANDI YARD TWIN TOPOLOGY
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{centre.name}</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-200">
              Demand Status: <strong className="text-amber-300">{digitalTwin.demandLevel}</strong>
            </span>
            <span className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full text-emerald-300">
              Next Hour Projection: {digitalTwin.predictedDemandNextHour}
            </span>
          </div>
        </div>

        {/* 4 Physical Zones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Zone 1: Entry Gate */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>ZONE 1: ENTRY GATE</span>
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{digitalTwin.waitingCount}</div>
            <p className="text-[11px] text-emerald-200">
              Tractors checked in with digital QR pass. Zero unauthorized entry.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
              RFID Plate Scanner: ACTIVE
            </div>
          </div>

          {/* Zone 2: Waiting Shed */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>ZONE 2: FARMER SHED</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{digitalTwin.waitingCount} Waiting</div>
            <p className="text-[11px] text-emerald-200">
              Digital display shows live token ticker and audio announcements.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
              Comfort Level: OPTIMAL
            </div>
          </div>

          {/* Zone 3: Assaying & Weighbridge Counters */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>ZONE 3: WEIGHBRIDGES</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{digitalTwin.activeCounters} Active Platforms</div>
            <p className="text-[11px] text-emerald-200">
              Electronic moisture analysis and calibrated digital weigh scale.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
              Scale Calibration: CERTIFIED
            </div>
          </div>

          {/* Zone 4: Exit & DBT Disbursement */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>ZONE 4: DBT SETTLEMENT</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-white">{digitalTwin.completedCount} Procured</div>
            <p className="text-[11px] text-emerald-200">
              Direct Benefit Transfer slip generated & queued for treasury clearing.
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
              Direct Treasury API: CONNECTED
            </div>
          </div>
        </div>

        {/* Operational Bottleneck / Recommendation Box */}
        <div className="bg-amber-400/10 border border-amber-300/30 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong>AI Yard Orchestrator Recommendation:</strong> {digitalTwin.recommendedAction}
          </div>
        </div>
      </div>
    </div>
  );
}
