'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import hiTranslations from '../locales/hi.json';
import mrTranslations from '../locales/mr.json';

export type Language = 'en' | 'hi' | 'mr';

// Initialize i18next instance if not already initialized
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      mr: { translation: mrTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });
}

export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'en';
  }
  const langs = navigator.languages || [navigator.language || 'en'];
  for (const lang of langs) {
    const code = (lang || '').toLowerCase();
    if (code.startsWith('mr')) return 'mr'; // Marathi
    if (code.startsWith('hi')) return 'hi'; // Hindi
    if (code.startsWith('en')) return 'en'; // English
  }
  return 'en';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, any>) => string;
  translateStatus: (status?: string) => string;
  translateMessage: (msg?: string) => string;
  translateCrop: (crop?: string) => string;
  i18n: typeof i18n;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translateStatus: (status?: string) => status || '',
  translateMessage: (msg?: string) => msg || '',
  translateCrop: (crop?: string) => crop || '',
  i18n,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // 1. If user explicitly chose a language via the profile drawer, respect that
    const userChosen = localStorage.getItem('mandimitra_lang_chosen');
    const saved = localStorage.getItem('mandimitra_lang') as Language;

    let initialLang: Language = 'en';
    if (userChosen === 'true' && saved && ['en', 'hi', 'mr'].includes(saved)) {
      initialLang = saved;
    } else {
      initialLang = detectDeviceLanguage();
      localStorage.setItem('mandimitra_lang', initialLang);
    }

    setLanguageState(initialLang);
    i18n.changeLanguage(initialLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('mandimitra_lang', lang);
    localStorage.setItem('mandimitra_lang_chosen', 'true');
  };

  const t = (key: string, options?: Record<string, any>): string => {
    // If key exists directly in translation resources
    const translated = i18n.t(key, { ...options, lng: language });
    if (translated && translated !== key) {
      return translated;
    }

    // Dynamic interpolation fallback if key is directly in JSON
    const currentResource =
      language === 'hi' ? hiTranslations : language === 'mr' ? mrTranslations : enTranslations;
    if (currentResource[key as keyof typeof currentResource]) {
      let str = currentResource[key as keyof typeof currentResource];
      if (options) {
        Object.keys(options).forEach((param) => {
          str = str.replace(new RegExp(`{{${param}}}|{${param}}`, 'g'), String(options[param]));
        });
      }
      return str;
    }

    return key;
  };

  // Helper to translate status enums (BOOKED, CHECKED_IN, etc.)
  const translateStatus = (status?: string): string => {
    if (!status) return '';
    const normalized = status.toUpperCase().trim();
    switch (normalized) {
      case 'BOOKED':
        return t('status_booked');
      case 'CHECKED_IN':
      case 'CHECKED-IN':
        return t('status_checked_in');
      case 'WAITING':
        return t('status_waiting');
      case 'CALLED':
        return t('status_called');
      case 'PROCESSING':
        return t('status_processing');
      case 'COMPLETED':
        return t('status_completed');
      case 'SKIPPED':
        return t('status_skipped');
      case 'CANCELLED':
      case 'CANCELED':
        return t('status_cancelled');
      case 'AVAILABLE':
        return t('slot_available');
      case 'LIMITED':
        return t('slot_limited');
      case 'FULL':
        return t('slot_full');
      case 'LOW':
        return t('wait_low');
      case 'MODERATE':
        return t('wait_moderate');
      case 'BUSY':
        return t('wait_busy');
      default:
        return status;
    }
  };

  // Helper to dynamically translate backend messages (statusMessage, subMessage, arrival status)
  const translateMessage = (msg?: string): string => {
    if (!msg) return '';
    const trimmed = msg.trim();

    // 1. Exact string matches
    if (trimmed === 'Checked In — Waiting in Yard' || trimmed === 'Checked In - Waiting in Yard') {
      return t('status_msg_checked_in_yard');
    }
    if (trimmed === "You don't need to leave yet." || trimmed === "You don't need to leave yet") {
      return t('status_msg_do_not_leave');
    }
    if (trimmed === 'Your turn is approaching! Please start travelling.') {
      return t('status_msg_turn_approaching');
    }
    if (trimmed === 'Get ready to leave soon.') {
      return t('status_msg_get_ready');
    }
    if (trimmed === 'Procurement Completed!') {
      return t('status_msg_completed');
    }
    if (trimmed === 'Checked in at weighbridge gate') {
      return t('status_msg_gate_checked_in');
    }
    if (trimmed === 'Prepare to depart soon') {
      return t('status_msg_prepare_depart');
    }
    if (trimmed === 'Please bring your tractor/vehicle to the weighing platform immediately.') {
      return t('sub_msg_called_immediate');
    }
    if (trimmed === 'Quality assaying and weighing are in progress.') {
      return t('sub_msg_processing_progress');
    }
    if (trimmed === 'Your produce was inspected and accepted. Check payments tab for DBT status.') {
      return t('sub_msg_procurement_accepted');
    }
    if (trimmed === 'Morning Arrival') {
      return t('time_window_morning');
    }
    if (trimmed === 'Mid-day Arrival') {
      return t('time_window_midday');
    }
    if (trimmed === 'Afternoon Arrival') {
      return t('time_window_afternoon');
    }

    // 2. Pattern matching for dynamic sentences
    // e.g. "Your Turn is Called! Proceed to Counter 1"
    const turnCalledMatch = trimmed.match(/Your Turn is Called! Proceed to Counter\s*(\d+)/i);
    if (turnCalledMatch) {
      return t('status_msg_turn_called', { counter: turnCalledMatch[1] });
    }

    // e.g. "Currently at Counter 1"
    const inProcessingMatch = trimmed.match(/Currently at Counter\s*(\d+)/i);
    if (inProcessingMatch) {
      return t('status_msg_in_processing', { counter: inProcessingMatch[1] });
    }

    // e.g. "5 farmers ahead of you. Relax in the farmer waiting shed."
    const aheadYardMatch = trimmed.match(/(\d+)\s+farmers ahead of you\.\s*Relax in the farmer waiting shed\./i);
    if (aheadYardMatch) {
      return t('sub_msg_farmers_ahead_yard', { count: aheadYardMatch[1] });
    }

    // e.g. "Only 3 farmers ahead of you at Niphad APMC."
    const onlyAheadMatch = trimmed.match(/Only\s+(\d+)\s+farmers ahead of you at\s+(.+)\./i);
    if (onlyAheadMatch) {
      return t('sub_msg_only_farmers_ahead', { count: onlyAheadMatch[1], centre: onlyAheadMatch[2] });
    }

    // e.g. "About 5 farmers ahead. Departure recommended at 10:30 AM."
    const aboutAheadMatch = trimmed.match(/About\s+(\d+)\s+farmers ahead\.\s*Departure recommended at\s+(.+)\./i);
    if (aboutAheadMatch) {
      return t('sub_msg_about_farmers_ahead', { count: aboutAheadMatch[1], time: aboutAheadMatch[2] });
    }

    // e.g. "Your turn is expected around 11:15 AM. We'll notify you when to depart."
    const turnExpectedMatch = trimmed.match(/Your turn is expected around\s+(.+?)\.\s*We'll notify you when to depart\./i);
    if (turnExpectedMatch) {
      return t('sub_msg_turn_expected', { time: turnExpectedMatch[1] });
    }

    return trimmed;
  };

  // Helper to translate crops
  const translateCrop = (crop?: string): string => {
    if (!crop) return '';
    const normalized = crop.toLowerCase().trim();
    if (normalized.includes('wheat') || normalized.includes('गेहूँ') || normalized.includes('गहू')) {
      return t('wheat_name');
    }
    if (normalized.includes('onion') || normalized.includes('प्याज') || normalized.includes('कांदा')) {
      return t('onion_name');
    }
    if (normalized.includes('soybean') || normalized.includes('सोयाबीन')) {
      return t('soybean_name');
    }
    if (normalized.includes('gram') || normalized.includes('chana') || normalized.includes('चना') || normalized.includes('हरभरा')) {
      return t('gram_name');
    }
    return crop;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateStatus,
        translateMessage,
        translateCrop,
        i18n,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default i18n;
