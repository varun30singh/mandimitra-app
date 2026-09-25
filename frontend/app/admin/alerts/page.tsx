'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    try {
      const res = await fetchApi('/alerts?includeResolved=true');
      setAlerts(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      await fetchApi(`/alerts/${id}/resolve`, { method: 'POST' });
      await loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
          Section 38: Real-Time Operational Bottleneck & Redirection Engine
        </span>
        <h1 className="text-3xl font-black text-slate-900 font-serif mt-1">
          Operational Alerts & Congestion Control
        </h1>
        <p className="text-xs text-slate-700 mt-1">
          Automatic alerts generated when queues exceed thresholds, capacity peaks, or moisture meters require recalibration.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => {
          const isCrit = a.severity === 'CRITICAL';

          return (
            <div
              key={a.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                a.isResolved ? 'opacity-60 bg-slate-50 border-slate-200' : (isCrit ? 'border-rose-300 ring-2 ring-rose-200' : 'border-slate-200')
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isCrit ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {a.severity} • {a.alertType}
                  </span>
                  {a.centre && (
                    <span className="text-xs font-semibold text-slate-700">
                      Centre: {a.centre.name}
                    </span>
                  )}
                  {a.isResolved && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      RESOLVED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-700">{a.message}</p>

                {a.suggestedAction && (
                  <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 text-xs">
                    <strong>Suggested Corrective Action:</strong> {a.suggestedAction}
                  </div>
                )}
              </div>

              {!a.isResolved && (
                <button
                  onClick={() => handleResolve(a.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shrink-0 shadow-xs"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
