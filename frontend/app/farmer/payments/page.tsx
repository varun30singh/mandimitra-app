'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { CreditCard, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function FarmerPaymentsPage() {
  const { language, t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/farmers/MH-NAS-2026-0812')
      .then((farmer) => fetchApi(`/payments/farmer/${farmer.id}`))
      .then((res) => setPayments(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-serif">
          {language === 'hi' ? 'डीबीटी प्रत्यक्ष लाभ अंतरण एवं भुगतान स्थिति' : (language === 'mr' ? 'डीबीटी थेट बँक खात्यात पेमेंट स्थिती' : 'Direct Benefit Transfer (DBT) & Payment Status')}
        </h1>
        <p className="text-sm text-slate-700 mt-1">
          Direct payment disbursement to your Aadhaar-linked registered bank account.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-700">Loading DBT payment records...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-sm text-slate-700">No payment records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {payments.map((pay) => {
            const isProcessing = pay.status === 'PROCESSING';

            return (
              <div
                key={pay.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-slate-100 font-bold px-2.5 py-1 rounded text-slate-800">
                      {pay.paymentNumber}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        isProcessing
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isProcessing ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {pay.status === 'PROCESSING' ? 'Payment Processing (DBT Initiated)' : 'Completed (Disbursed)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-700 block">Linked Procurement Crop:</span>
                    <h3 className="text-xl font-bold text-slate-900">
                      {pay.procurement?.crop} ({pay.procurement?.quantity} qtl)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-700 block">Bank Account:</span>
                      <span className="font-bold text-slate-900">•••• •••• •••• {pay.bankAccountLast4}</span>
                    </div>
                    <div>
                      <span className="text-slate-700 block">IFSC Code:</span>
                      <span className="font-bold text-slate-900">{pay.ifscCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-700 block">DBT Transaction Ref:</span>
                      <span className="font-mono text-slate-800 font-medium">{pay.transactionRef}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {pay.remarks}
                  </p>
                </div>

                <div className="text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                  <span className="text-xs text-slate-700 block">Disbursed Amount:</span>
                  <span className="text-3xl font-black text-emerald-700">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </span>
                  <div className="text-[11px] text-slate-700 mt-1">
                    {isProcessing ? 'Expected in 24-48 hours' : 'Successfully credited'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
