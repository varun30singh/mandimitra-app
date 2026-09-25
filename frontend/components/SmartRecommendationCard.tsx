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
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl border-2 border-amber-300 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-emerald-950 font-black text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-950" />
            {language === 'hi' ? 'आपके लिए सर्वश्रेष्ठ अनुशंसित' : (language === 'mr' ? 'तुमच्यासाठी सर्वोत्तम शिफारस' : 'RECOMMENDED FOR YOU')}
          </span>
          <span className="text-xs text-emerald-200">
            Smart India Hackathon AI Model
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
          <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-bold text-amber-300">
            Score: {recommendationScore}/100
          </span>
        </div>
      </div>

      {/* Centre Title & Distance */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {centre.name}
          </h2>
          <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            {centre.address}, {centre.taluka}, {centre.district}
          </p>
        </div>

        <div className="text-right sm:shrink-0">
          <span className="text-2xl font-black text-amber-300">{metrics.distanceKm} km</span>
          <span className="text-xs text-emerald-200 block">{language === 'hi' ? 'दूरी' : 'away'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <Users className="w-3 h-3 text-amber-300" />
            {language === 'hi' ? 'वर्तमान कतार' : 'Current Queue'}
          </div>
          <div className="text-xl font-bold text-white mt-0.5">{metrics.queueLength} farmers</div>
          <div className="text-[10px] text-emerald-300">Low queue density</div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-300" />
            {language === 'hi' ? 'अनुमानित प्रतीक्षा' : 'Est. Waiting'}
          </div>
          <div className="text-xl font-bold text-white mt-0.5">~{metrics.estimatedWaitMinutes} min</div>
          <div className="text-[10px] text-emerald-300">{centre.activeCounters} active counters</div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <Percent className="w-3 h-3 text-amber-300" />
            {language === 'hi' ? 'यार्ड क्षमता' : 'Yard Capacity'}
          </div>
          <div className="text-xl font-bold text-white mt-0.5">{metrics.capacityUtilization}%</div>
          <div className="text-[10px] text-emerald-300">
            {100 - metrics.capacityUtilization}% headroom
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <div className="text-[11px] text-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-300" />
            {language === 'hi' ? 'अगला स्लॉट' : 'Next Open Slot'}
          </div>
          <div className="text-xl font-bold text-amber-300 mt-0.5">{metrics.nextAvailableSlot}</div>
          <div className="text-[10px] text-emerald-300">{metrics.availableSlotsCount} slots left</div>
        </div>
      </div>

      {/* EXPLAINABILITY SECTION (Section 8: Never display without explaining WHY) */}
      <div className="mt-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          {t('why_recommended')}
        </h3>

        <div className="space-y-2">
          {reasons && reasons.map((reason: any, idx: number) => {
            const text = reason[language] || reason.en;
            return (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-emerald-200/80 mt-3 pt-2.5 border-t border-white/10 italic">
          {summaryExplainability}
        </p>
      </div>

      {/* Book Slot CTA */}
      {showBookButton && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-emerald-200">
            {language === 'hi' ? 'न्यूनतम प्रतीक्षा समय की गारंटी के लिए स्लॉट अभी बुक करें।' : 'Book this slot now for verified zero-wait turnaround.'}
          </div>
          <Link
            href={`/farmer/book?centreId=${centre.id}`}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
          >
            {language === 'hi' ? 'इस केंद्र पर स्लॉट बुक करें' : (language === 'mr' ? 'या केंद्रावर स्लॉट बुक करा' : 'Book Slot at Recommended Centre')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
