'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/language-context';
import {
  Sparkles,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: any;
  showBookButton?: boolean;
}

export const SmartRecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  showBookButton = true,
}) => {
  const { language, t } = useLanguage();

  if (!recommendation) return null;

  const { centre, recommendationScore, metrics, reasons, summaryExplainability } = recommendation;

  return (
    <div className="bg-white rounded-3xl p-5 text-emerald-950 shadow-md border-2 border-emerald-300 relative overflow-hidden space-y-4">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between">
        <span className="bg-emerald-100 text-emerald-900 font-extrabold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          {language === 'hi' ? 'सर्वश्रेष्ठ अनुशंसित' : (language === 'mr' ? 'सर्वोत्तम शिफारस' : 'RECOMMENDED FOR YOU')}
        </span>

        <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Score: {recommendationScore}/100
        </span>
      </div>

      {/* Centre Name & Distance */}
      <div className="flex items-baseline justify-between gap-2 border-b border-emerald-100 pb-3">
        <div>
          <h2 className="text-xl font-black text-emerald-950 font-serif">
            {centre.name}
          </h2>
          <p className="text-xs text-emerald-700 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {centre.address}, {centre.taluka}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-emerald-800">{metrics.distanceKm} km</span>
          <span className="text-[10px] text-emerald-600 block">away</span>
        </div>
      </div>

      {/* 4 Metric Boxes */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-800 font-bold block">Current Queue</span>
          <span className="text-lg font-black text-emerald-950 mt-0.5 block">{metrics.queueLength} farmers</span>
        </div>

        <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-800 font-bold block">Estimated Wait</span>
          <span className="text-lg font-black text-emerald-700 mt-0.5 block">~{metrics.estimatedWaitMinutes} min</span>
        </div>

        <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-800 font-bold block">Yard Capacity</span>
          <span className="text-lg font-black text-emerald-950 mt-0.5 block">{metrics.capacityUtilization}%</span>
        </div>

        <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100">
          <span className="text-[10px] text-emerald-800 font-bold block">Next Slot</span>
          <span className="text-lg font-black text-emerald-800 mt-0.5 block">{metrics.nextAvailableSlot}</span>
        </div>
      </div>

      {/* Explainability Bullets (Section 8: Why recommended?) */}
      <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200 space-y-2">
        <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          {t('why_recommended')}
        </h3>

        <div className="space-y-1.5">
          {reasons && reasons.map((reason: any, idx: number) => {
            const text = reason[language] || reason.en;
            return (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-emerald-950 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {showBookButton && (
        <Link
          href={`/farmer/book?centreId=${centre.id}`}
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-black py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 text-xs"
        >
          {language === 'hi' ? 'इस केंद्र पर स्लॉट बुक करें' : 'Book Recommended Slot'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};
