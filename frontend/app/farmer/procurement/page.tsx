'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { Wheat, CheckCircle2, Clock, MapPin, ArrowRight, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';

export default function FarmerProcurementPage() {
  const { language, t, translateStatus, translateCrop } = useLanguage();
  const [procurements, setProcurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProcurements = useCallback(async () => {
    try {
      setRefreshing(true);
      const orders = await fetchApi('/procurement/farmer/active');
      if (Array.isArray(orders) && orders.length > 0) {
        setProcurements(orders);
      } else {
        // Fallback: fetch general /orders
        const rawOrders = await fetchApi('/orders');
        if (Array.isArray(rawOrders)) {
          const mapped = rawOrders.map((o: any) => {
            const cropName = o.crop || 'Wheat';
            const rate = cropName === 'Soybean' ? 5708 : cropName === 'Gram' ? 5875 : 2585;
            const qty = o.quantity || 25;
            const amt = o.amount || Math.round(qty * rate);
            return {
              id: o.id,
              procurementNumber: `MM-ORD-00${o.id}`,
              crop: cropName,
              quantity: qty,
              totalAmount: amt,
              ratePerQuintal: Math.round(amt / qty),
              grade: 'FAQ Grade-A',
              moistureContent: 11.8,
              status: o.status || 'PENDING',
              centre: {
              id: 'centre-14',
              name: o.centreName || 'Meerut Grain Mandi #14',
            },
            buyerId: o.buyerId,
            brokerId: o.brokerId,
            listingId: o.listingId,
            createdAt: o.createdAt,
          };
        });
        setProcurements(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to load procurements:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProcurements();

    // Live sync when an order is created or updated by broker/buyer/operator
    const handleOrderEvent = () => {
      loadProcurements();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mandimitra_orders_updated', handleOrderEvent);
      window.addEventListener('storage', handleOrderEvent);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mandimitra_orders_updated', handleOrderEvent);
        window.removeEventListener('storage', handleOrderEvent);
      }
    };
  }, [loadProcurements]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-serif">
            {t('procurement_history_title')}
          </h1>
          <p className="text-sm text-slate-700 mt-1">
            {t('procurement_history_sub')}
          </p>
        </div>

        <button
          onClick={loadProcurements}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Live Orders</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-700 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span>{t('loading_procurement')}</span>
        </div>
      ) : procurements.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Wheat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-800">{t('no_procurement')}</p>
          <p className="text-xs text-slate-700 mt-1">New orders placed by brokers or buyers will automatically appear here in real time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {procurements.map((p) => {
            const isApproved = p.status === 'APPROVED' || p.status === 'COMPLETED' || p.status === 'VERIFIED';
            const isPending = p.status === 'PENDING';

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-200 transition"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs bg-slate-100 font-bold px-2.5 py-1 rounded text-slate-800">
                      {p.procurementNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {p.status || 'PENDING'}
                    </span>
                    {p.buyerId && (
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        Buyer #{p.buyerId}
                      </span>
                    )}
                    {p.brokerId && (
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        Broker #{p.brokerId}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-emerald-600" />
                    {translateCrop(p.crop)} — {p.quantity} {t('qtl')}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700 pt-2">
                    <div>
                      <span className="text-slate-700 block">{t('centre_label')}</span>
                      <span className="font-bold text-slate-900">{p.centre?.name || 'Mandi Centre'}</span>
                    </div>
                    <div>
                      <span className="text-slate-700 block">{t('grade_quality')}</span>
                      <span className="font-bold text-emerald-700">{p.grade || 'FAQ Grade-A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-700 block">{t('moisture_content')}</span>
                      <span className="font-bold text-slate-900">{p.moistureContent || '12.0'}%</span>
                    </div>
                    <div>
                      <span className="text-slate-700 block">{t('msp_rate')}</span>
                      <span className="font-bold text-slate-900">₹{p.ratePerQuintal || 2585}/{t('qtl')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                  <span className="text-xs text-slate-700 block">{t('total_payout')}</span>
                  <span className="text-2xl font-black text-emerald-700">₹{Number(p.totalAmount || 0).toLocaleString('en-IN')}</span>
                  <Link
                    href="/farmer/payments"
                    className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-end gap-1"
                  >
                    {t('view_dbt_status')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
