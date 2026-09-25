'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { Wheat, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function FarmerProcurementPage() {
  const { language, t } = useLanguage();
  const [procurements, setProcurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/farmers/MH-NAS-2026-0812')
      .then((farmer) => fetchApi(`/procurement/farmer/${farmer.id}`))
      .then((res) => setProcurements(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-serif">
          {language === 'hi' ? 'मेरी फसल खरीद रिकॉर्ड' : (language === 'mr' ? 'माझे धान्य खरेदी नोंदी' : 'My Procurement History & Quality Records')}
        </h1>
        <p className="text-sm text-slate-700 mt-1">
          Verified weights, moisture assaying, and government MSP procurement slips.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-700">Loading procurement history...</div>
      ) : procurements.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-sm text-slate-700">No completed procurement records found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {procurements.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 font-bold px-2.5 py-1 rounded text-slate-800">
                    {p.procurementNumber}
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {p.status}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-emerald-600" />
                  {p.crop} — {p.quantity} Quintals
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700 pt-2">
                  <div>
                    <span className="text-slate-700 block">Centre:</span>
                    <span className="font-bold text-slate-900">{p.centre?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Grade / Quality:</span>
                    <span className="font-bold text-emerald-700">{p.grade}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">Moisture Content:</span>
                    <span className="font-bold text-slate-900">{p.moistureContent}% (Standard)</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block">MSP Rate:</span>
                    <span className="font-bold text-slate-900">₹{p.ratePerQuintal}/qtl</span>
                  </div>
                </div>
              </div>

              <div className="text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                <span className="text-xs text-slate-700 block">Total Payout Amount:</span>
                <span className="text-2xl font-black text-emerald-700">₹{p.totalAmount.toLocaleString('en-IN')}</span>
                <Link
                  href="/farmer/payments"
                  className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-end gap-1"
                >
                  View DBT Status <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
