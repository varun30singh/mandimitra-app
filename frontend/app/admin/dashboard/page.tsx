'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import {
  Users,
  Clock,
  Wheat,
  ShieldAlert,
  Percent,
  TrendingUp,
  Activity,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/analytics/dashboard')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (!data) {
    return <div className="p-12 text-center text-slate-700">Loading district procurement dashboard...</div>;
  }

  const { overview, hourlyDistribution, centreUtilization, cropDistribution, throughputMetrics } = data;
  const COLORS = ['#15803d', '#d97706', '#2563eb', '#9333ea', '#e11d48'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Agricultural Marketing & State Procurement Division
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-serif mt-1">
            District Mandi Command & Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/digital-twin"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Yard Digital Twin
          </Link>
          <Link
            href="/admin/queue"
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600" /> Live Calling Desk
          </Link>
        </div>
      </div>

      {/* Top Metric Cards (Section 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Farmers Today</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{overview.totalFarmersToday}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">+18% vs yesterday</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Active Tokens</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-700 mt-2">{overview.activeTokens}</div>
          <div className="text-[11px] text-slate-700 mt-1">In yard or scheduled</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Average Wait</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{overview.avgWaitMinutes} <span className="text-sm font-normal text-slate-700">min</span></div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">-42m below avg</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Centres at Risk</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">{overview.centresAtRisk}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Overloaded yard</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Procurements</span>
            <Wheat className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">{overview.completedProcurements}</div>
          <div className="text-[11px] text-slate-700 mt-1">Accepted & weighed</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Capacity Util</span>
            <Percent className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700 mt-2">{overview.capacityUtilization}%</div>
          <div className="text-[11px] text-slate-700 mt-1">Balanced load</div>
        </div>
      </div>

      {/* Main Charts Row (Hourly Arrivals + Centre Load) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Arrivals & Completed Throughput Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Hourly Arrival Distribution & Processing Rate
              </h2>
              <p className="text-xs text-slate-700">Scheduled farmer arrivals vs throughput served</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 bg-emerald-600 rounded-sm" /> Arrivals
              </span>
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-3 h-3 bg-blue-500 rounded-sm" /> Completed
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="arrivals" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorArrivals)" />
                <Area type="monotone" dataKey="served" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorServed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Procurement Distribution Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Crop Procurement Breakdown</h2>
            <p className="text-xs text-slate-700">Procured quintals under MSP scheme</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  dataKey="quantityQuintals"
                  nameKey="crop"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {cropDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {cropDistribution.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.crop}
                </span>
                <span className="font-bold text-slate-900">{item.quantityQuintals} qtl</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Centre Utilization & Pressure Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Procurement Centre Yard Utilization (%)
            </h2>
            <p className="text-xs text-slate-700">Load balancing and overload indicators</p>
          </div>
          <Link
            href="/admin/centres"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
          >
            Manage Centres <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={centreUtilization} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="utilization" fill="#15803d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
