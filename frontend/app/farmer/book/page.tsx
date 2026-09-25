'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import {
  Calendar,
  Clock,
  MapPin,
  Wheat,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function BookSlotContent() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCentreId = searchParams.get('centreId');

  const [centres, setCentres] = useState<any[]>([]);
  const [selectedCentreId, setSelectedCentreId] = useState<string>('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [crop, setCrop] = useState<string>('Wheat');
  const [quantity, setQuantity] = useState<number>(85);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load centres
  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      if (preselectedCentreId) {
        setSelectedCentreId(preselectedCentreId);
      } else if (res.length > 0) {
        // Default to Centre B (recommended)
        const centreB = res.find((c: any) => c.code === 'MANDI-NPH') || res[0];
        setSelectedCentreId(centreB.id);
      }
    });
  }, [preselectedCentreId]);

  // Load slots whenever centre changes
  useEffect(() => {
    if (!selectedCentreId) return;

    setLoadingSlots(true);
    setSelectedSlotId('');
    fetchApi(`/slots/centre/${selectedCentreId}`)
      .then((res) => {
        setSlots(res);
        // Pre-select first available slot
        const available = res.find((s: any) => s.status !== 'Full');
        if (available) setSelectedSlotId(available.id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [selectedCentreId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !selectedCentreId) return;

    setBookingLoading(true);
    setError(null);

    try {
      // Look up Ramesh farmer ID
      const farmer = await fetchApi('/farmers/MH-NAS-2026-0812');

      const result = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: farmer.id,
          centreId: selectedCentreId,
          slotId: selectedSlotId,
          crop,
          quantity: parseFloat(quantity.toString()),
        }),
      });

      // Redirect directly to Token page
      router.push(`/farmer/token?token=${result.token.tokenNumber}&new=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-white text-emerald-950">
      {/* Header */}
      <div className="px-1 space-y-0.5">
        <h1 className="text-xl font-black text-emerald-950 font-serif">
          {language === 'hi' ? 'खरीद स्लॉट बुकिंग' : (language === 'mr' ? 'खरेदी स्लॉट बुकिंग' : 'Book Procurement Slot')}
        </h1>
        <p className="text-xs text-emerald-700">
          {language === 'hi'
            ? 'अपनी पसंद का केंद्र, फसल और 30-मिनट का स्लॉट चुनें। टोकन तुरंत जारी होगा।'
            : 'Select centre, crop, and guaranteed 30-minute arrival window.'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-3 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleBooking} className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-5">
        {/* Step 1: Select Centre */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-emerald-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              1. {language === 'hi' ? 'खरीद केंद्र चुनें' : 'Select Procurement Centre'}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              {language === 'hi' ? 'अनुशंसित: केंद्र B' : 'Recommended: Centre B'}
            </span>
          </label>

          <div className="space-y-2">
            {centres.map((c) => {
              const selected = c.id === selectedCentreId;
              const isRecommended = c.code === 'MANDI-NPH';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentreId(c.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition relative ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500'
                      : 'border-emerald-100 hover:bg-emerald-50/30'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5" /> Best Choice
                    </span>
                  )}
                  <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">{c.name}</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">{c.address}, {c.taluka}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
                    <span>{c.distanceKm} km</span>
                    <span>•</span>
                    <span>Queue: {c.currentQueue}</span>
                    <span>•</span>
                    <span>Wait: ~{c.estimatedWaitMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Produce & Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Wheat className="w-3.5 h-3.5 text-emerald-600" />
              2. {language === 'hi' ? 'फसल प्रकार' : 'Crop Type'}
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="Wheat">Wheat / गेहूँ (MSP: ₹2,275/qtl)</option>
              <option value="Onion">Onion / प्याज (Graded Red)</option>
              <option value="Soybean">Soybean / सोयाबीन (MSP: ₹4,892/qtl)</option>
              <option value="Gram">Gram (Chana) / चना (MSP: ₹5,440/qtl)</option>
              <option value="Cotton">Cotton / कपास (MSP: ₹7,121/qtl)</option>
              <option value="Paddy">Paddy / धान (Common)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-950 block">
              3. {language === 'hi' ? 'अनुमानित मात्रा (क्विंटल)' : 'Approx Quantity (Quintals)'}
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2.5 text-xs font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              placeholder="e.g. 85"
            />
          </div>
        </div>

        {/* Step 3: Dynamic Procurement Slot Selection */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-bold text-emerald-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              4. {language === 'hi' ? '30-मिनट का आगमन स्लॉट चुनें' : 'Select 30-Min Arrival Slot'}
            </span>
            <span className="text-[10px] text-emerald-700">Today</span>
          </label>

          {loadingSlots ? (
            <div className="p-6 text-center text-xs text-emerald-700">
              Loading available slots...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => {
                const isSelected = s.id === selectedSlotId;
                const isFull = s.status === 'Full';
                const isLimited = s.status === 'Limited';

                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-700 text-white shadow-xs'
                        : isFull
                        ? 'border-emerald-100 bg-emerald-50/30 text-emerald-800/40 cursor-not-allowed opacity-60'
                        : isLimited
                        ? 'border-amber-300 bg-amber-50/70 hover:border-amber-400 text-emerald-950'
                        : 'border-emerald-200 bg-white hover:border-emerald-400 text-emerald-950'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">
                        {s.startTime} - {s.endTime}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-80">{s.timeWindow}</div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between text-[10px] font-semibold">
                      <span>{s.status}</span>
                      <span>{s.remainingCapacity} spots</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-2 border-t border-emerald-100 space-y-2">
          <button
            type="submit"
            disabled={bookingLoading || !selectedSlotId}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
          >
            {bookingLoading ? 'Generating Token...' : (language === 'hi' ? 'पुष्टि करें एवं टोकन प्राप्त करें' : 'Confirm & Generate Token')}
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-emerald-700 text-center">
            ✓ Instant digital token • Anti-overbooking protected
          </p>
        </div>
      </form>
    </div>
  );
}

export default function BookSlotPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-emerald-700">Loading booking wizard...</div>}>
      <BookSlotContent />
    </Suspense>
  );
}
