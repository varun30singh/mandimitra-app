'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import {
  Clock,
  Users,
  Play,
  CheckCircle2,
  AlertCircle,
  SkipForward,
  UserCheck,
  Wheat,
  MapPin,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export default function OperatorQueueConsole() {
  const [centreId, setCentreId] = useState('');
  const [centres, setCentres] = useState<any[]>([]);
  const [liveQueue, setLiveQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(1);

  // Load centres
  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      if (res.length > 0) {
        // Default to Mandi Centre B (Niphad)
        const centreB = res.find((c: any) => c.code === 'MANDI-NPH') || res[0];
        setCentreId(centreB.id);
      }
    });
  }, []);

  const loadLiveQueue = async () => {
    if (!centreId) return;
    try {
      const res = await fetchApi(`/queue/live/${centreId}`);
      setLiveQueue(res);
    } catch (err) {
      console.error('Error fetching live queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveQueue();
    const interval = setInterval(loadLiveQueue, 5000);
    return () => clearInterval(interval);
  }, [centreId]);

  // Action: Call Next Token
  const handleCallNext = async () => {
    setActionLoading(true);
    try {
      await fetchApi('/queue/call-next', {
        method: 'POST',
        body: JSON.stringify({
          centreId,
          counterNumber: selectedCounter,
          operatorName: 'Suresh Gaikwad',
        }),
      });
      await loadLiveQueue();
    } catch (err: any) {
      alert(err.message || 'Error calling next token');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Check in farmer
  const handleCheckIn = async (tokenId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/queue/${tokenId}/check-in`, {
        method: 'POST',
        body: JSON.stringify({ operatorName: 'Gate Operator' }),
      });
      await loadLiveQueue();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Start processing
  const handleStartProcessing = async (tokenId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/queue/${tokenId}/start-processing`, {
        method: 'POST',
        body: JSON.stringify({ counterNumber: selectedCounter }),
      });
      await loadLiveQueue();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Complete Procurement
  const handleComplete = async (tokenId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/queue/${tokenId}/complete`, {
        method: 'POST',
        body: JSON.stringify({
          quantity: 85.0,
          grade: 'Grade A',
          moistureContent: 11.2,
          ratePerQuintal: 2275.0,
          operatorName: 'Suresh Gaikwad',
        }),
      });
      await loadLiveQueue();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Skip Token
  const handleSkip = async (tokenId: string) => {
    setActionLoading(true);
    try {
      await fetchApi(`/queue/${tokenId}/skip`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Farmer not present at counter' }),
      });
      await loadLiveQueue();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const selectedCentre = centres.find((c) => c.id === centreId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Centre Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Operator Yard Control Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif mt-1">
            Live Queue Management & Calling Desk
          </h1>
          <p className="text-xs text-slate-700">
            Real-time FIFO token progression, counter assignments, and procurement status transitions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Yard Centre:</span>
            <select
              value={centreId}
              onChange={(e) => setCentreId(e.target.value)}
              className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            >
              {centres.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">My Counter:</span>
            <select
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(parseInt(e.target.value, 10))}
              className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl px-3 py-2 text-xs font-bold"
            >
              <option value={1}>Counter #1</option>
              <option value={2}>Counter #2</option>
              <option value={3}>Counter #3</option>
              <option value={4}>Counter #4</option>
            </select>
          </div>

          <button
            onClick={loadLiveQueue}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Calling Bar (Section 10: Now Serving B-035, Next B-036) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Call Next Action Card */}
        <div className="bg-gradient-to-br from-emerald-800 to-green-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
              Calling Console • Counter #{selectedCounter}
            </div>
            <h3 className="text-xl font-extrabold mt-1">Ready to Call Next Farmer?</h3>
            <p className="text-xs text-emerald-100 mt-1">
              Advances the next checked-in farmer in queue and broadcasts real-time turn announcement alert.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-700">
            <button
              onClick={handleCallNext}
              disabled={actionLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-emerald-950 font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base"
            >
              <Play className="w-5 h-5 fill-emerald-950" /> Call Next Waiting Token
            </button>
          </div>
        </div>

        {/* Currently Processing at Counters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Now Serving (Processing)
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              At Scales
            </span>
          </div>

          <div className="my-3">
            {liveQueue?.nowServing?.length > 0 ? (
              <div className="space-y-2">
                {liveQueue.nowServing.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <div className="text-2xl font-black text-emerald-800">{t.tokenNumber}</div>
                      <div className="text-xs text-slate-700 font-medium">
                        {t.farmer?.fullName} • Counter #{t.counterNumber || 1}
                      </div>
                    </div>
                    <button
                      onClick={() => handleComplete(t.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-700 italic">
                No token currently undergoing weighing/assaying.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-700 flex justify-between pt-2 border-t border-slate-100">
            <span>Completed Today: {liveQueue?.completedCount || 0}</span>
            <span>Avg Speed: ~{selectedCentre?.avgProcessingMinutes}m</span>
          </div>
        </div>

        {/* Called & Approaching Counters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Called (Proceeding to Counter)
            </span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Called Turn
            </span>
          </div>

          <div className="my-3">
            {liveQueue?.nextTokens?.length > 0 ? (
              <div className="space-y-2">
                {liveQueue.nextTokens.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                    <div>
                      <div className="text-2xl font-black text-amber-700">{t.tokenNumber}</div>
                      <div className="text-xs text-slate-700 font-medium">
                        {t.farmer?.fullName} (Counter #{t.counterNumber})
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartProcessing(t.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => handleSkip(t.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                        title="Skip / No-Show"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-700 italic">
                No tokens currently in CALLED state.
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-700 flex justify-between pt-2 border-t border-slate-100">
            <span>Next In Line: {liveQueue?.waitingTokens?.[0]?.tokenNumber || 'None'}</span>
            <span>Total Waiting: {liveQueue?.totalWaiting || 0}</span>
          </div>
        </div>
      </div>

      {/* Active Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Live Queue Lineup for {selectedCentre?.name}
          </h2>
          <span className="text-xs text-slate-700 font-mono">
            {liveQueue?.waitingTokens?.length || 0} farmers lined up
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Pos</th>
                <th className="px-4 py-3">Token #</th>
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Crop / Qtl</th>
                <th className="px-4 py-3">Slot Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Operator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liveQueue?.waitingTokens?.map((tok: any, idx: number) => {
                const isRamesh = tok.farmer?.fullName === 'Ramesh Kumar';

                return (
                  <tr
                    key={tok.id}
                    className={`hover:bg-slate-50 transition ${
                      isRamesh ? 'bg-amber-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-slate-700">#{idx + 1}</td>
                    <td className="px-4 py-3 font-mono font-black text-base text-slate-900">
                      {tok.tokenNumber}
                      {isRamesh && (
                        <span className="ml-2 text-[10px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded">
                          Ramesh
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{tok.farmer?.fullName}</div>
                      <div className="text-[11px] text-slate-700">{tok.farmer?.mobile}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {tok.booking?.crop || 'Wheat'} ({tok.booking?.quantity || 50} qtl)
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {tok.appointmentTime}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tok.status === 'CHECKED_IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tok.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {tok.status === 'BOOKED' && (
                          <button
                            onClick={() => handleCheckIn(tok.id)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1.5 rounded-lg transition"
                          >
                            Gate Check-in
                          </button>
                        )}
                        <button
                          onClick={() => handleStartProcessing(tok.id)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-2xs"
                        >
                          Serve Now
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
