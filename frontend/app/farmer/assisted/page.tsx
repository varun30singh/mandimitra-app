'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import {
  User,
  Search,
  Printer,
  CheckCircle2,
  Calendar,
  Wheat,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AssistedKioskPage() {
  const { language } = useLanguage();
  const [operatorId, setOperatorId] = useState('CSC-VLE-NAS-04');
  const [assistedBy, setAssistedBy] = useState('Common Service Centre (Pimpalgaon Baswant)');
  const [searchMobile, setSearchMobile] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [village, setVillage] = useState('Pimpalgaon');
  const [centres, setCentres] = useState<any[]>([]);
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState(60);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchedFarmer, setSearchedFarmer] = useState<any>(null);

  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      if (res.length > 0) setSelectedCentreId(res[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedCentreId) return;
    fetchApi(`/slots/centre/${selectedCentreId}`).then((res) => {
      setSlots(res);
      const avail = res.find((s: any) => s.status !== 'Full');
      if (avail) setSelectedSlotId(avail.id);
    });
  }, [selectedCentreId]);

  const handleFarmerLookup = async () => {
    if (!searchMobile) return;
    try {
      const res = await fetchApi(`/farmers/search?q=${searchMobile}`);
      if (res && res.length > 0) {
        setSearchedFarmer(res[0]);
        setFarmerName(res[0].fullName);
        setVillage(res[0].village);
      } else {
        setSearchedFarmer(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssistedBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchMobile || !selectedCentreId || !selectedSlotId) return;

    setLoading(true);
    try {
      const res = await fetchApi('/assisted/book', {
        method: 'POST',
        body: JSON.stringify({
          operatorId,
          assistedBy,
          farmerMobile: searchMobile,
          farmerName: farmerName || 'Assisted Rural Farmer',
          village: village || 'Niphad Rural',
          centreId: selectedCentreId,
          slotId: selectedSlotId,
          crop,
          quantity: parseFloat(quantity.toString()),
        }),
      });

      setBookingResult(res);
    } catch (err: any) {
      alert(err.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-1.5 bg-blue-700/60 border border-blue-400/40 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-2">
          <User className="w-3.5 h-3.5" />
          Section 24: Inclusive Assisted Access Mode
        </div>
        <h1 className="text-3xl font-black font-serif">
          CSC / Gram Panchayat / Cooperative Assisted Booking Kiosk
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl mt-1">
          Authorized Village Level Entrepreneurs (VLE) can look up farmers, schedule slots, and print physical confirmation tokens for farmers without smartphones.
        </p>

        <div className="mt-4 pt-4 border-t border-blue-700/60 flex flex-wrap gap-4 text-xs text-blue-200">
          <span><strong>VLE Station:</strong> {assistedBy}</span>
          <span>•</span>
          <span><strong>Operator ID:</strong> {operatorId}</span>
          <span>•</span>
          <span className="text-amber-300 font-bold">Audit Tracking: ENABLED</span>
        </div>
      </div>

      {!bookingResult ? (
        <form onSubmit={handleAssistedBook} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Step 1: Farmer Search / Registration */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              1. Farmer Mobile Search / Identification
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={searchMobile}
                onChange={(e) => setSearchMobile(e.target.value)}
                placeholder="Enter Farmer 10-Digit Mobile (e.g. 9822012345)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                required
              />
              <button
                type="button"
                onClick={handleFarmerLookup}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition"
              >
                Lookup Farmer
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Farmer name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Village / Gram Panchayat</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Centre & Slot */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              2. Centre & Dynamic Slot Allocation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Procurement Centre</label>
                <select
                  value={selectedCentreId}
                  onChange={(e) => setSelectedCentreId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                  {centres.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.distanceKm} km - Queue: {c.currentQueue})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Appointment Slot</label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium"
                >
                  {slots.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.status === 'Full'}>
                      {s.startTime} - {s.endTime} ({s.status} - {s.remainingCapacity} spots)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
                >
                  <option value="Wheat">Wheat / गेहूँ (MSP ₹2,275)</option>
                  <option value="Onion">Onion / प्याज (Graded Red)</option>
                  <option value="Soybean">Soybean / सोयाबीन</option>
                  <option value="Gram">Gram / चना</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Quantity (Quintals)</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-700">
              Audit log will record Operator ID and CSC Station name.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition"
            >
              {loading ? 'Issuing Token...' : 'Generate & Print Token Slip'}
            </button>
          </div>
        </form>
      ) : (
        /* Printable Slip Confirmation */
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-md space-y-6">
          <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              CSC Procurement Token Slip
            </h2>
            <p className="text-xs text-slate-700">
              MANDIMITRA OFFICIAL GOVERNMENT PROCUREMENT APPOINTMENT
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-700 block">Token Number:</span>
              <span className="text-3xl font-black text-emerald-800">{bookingResult.token.tokenNumber}</span>
            </div>

            <div>
              <span className="text-xs text-slate-700 block">Farmer Name / Mobile:</span>
              <span className="text-base font-bold text-slate-900">{farmerName} ({searchMobile})</span>
            </div>

            <div>
              <span className="text-xs text-slate-700 block">Assigned Mandi Centre:</span>
              <span className="text-sm font-bold text-slate-900">{bookingResult.centre.name}</span>
            </div>

            <div>
              <span className="text-xs text-slate-700 block">Slot Time:</span>
              <span className="text-sm font-bold text-emerald-700">{bookingResult.slot.startTime} - {bookingResult.slot.endTime}</span>
            </div>

            <div>
              <span className="text-xs text-slate-700 block">Produce:</span>
              <span className="text-sm font-bold text-slate-900">{crop} • {quantity} Quintals</span>
            </div>

            <div>
              <span className="text-xs text-slate-700 block">Assisted By (VLE):</span>
              <span className="text-xs font-semibold text-slate-800">{assistedBy}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" /> Print Physical Token Slip
            </button>

            <button
              onClick={() => setBookingResult(null)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Book for Another Farmer →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
