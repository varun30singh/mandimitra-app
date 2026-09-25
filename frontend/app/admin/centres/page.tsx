'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { MapPin, Plus, Edit, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AdminCentresPage() {
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
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Infrastructure & Yard Configuration
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-serif mt-1">
            Procurement Centre Management
          </h1>
        </div>

        <button
          onClick={() => alert('New centre provisioning wizard')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Procurement Centre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {centres.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {c.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{c.name}</h3>
                <p className="text-xs text-slate-700">{c.address}, {c.district}</p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-700 block">Yard Capacity:</span>
                <span className="font-bold text-slate-900">{c.capacityUtilization}% of {c.capacity || 100}</span>
              </div>
              <div>
                <span className="text-slate-700 block">Active Counters:</span>
                <span className="font-bold text-emerald-700">{c.activeCounters} Platforms</span>
              </div>
              <div>
                <span className="text-slate-700 block">Avg Speed:</span>
                <span className="font-bold text-slate-900">{c.processingSpeed} min</span>
              </div>
              <div>
                <span className="text-slate-700 block">Hours:</span>
                <span className="font-bold text-slate-900">08:00 - 18:00</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-700">
                Supported: <strong>{c.supportedCrops?.join(', ')}</strong>
              </span>
              <button
                onClick={() => alert(`Edit configuration for ${c.name}`)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Configuration
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
