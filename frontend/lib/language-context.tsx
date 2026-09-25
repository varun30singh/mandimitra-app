'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

export const translations: Translations = {
  app_name: {
    en: 'MandiMitra',
    hi: 'मंडीमित्र',
    mr: 'मंडीमित्र',
  },
  tagline: {
    en: 'Smart Procurement Scheduling & Queue Management',
    hi: 'स्मार्ट खरीद शेड्यूलिंग और कतार प्रबंधन',
    mr: 'स्मार्ट खरेदी शेड्युलिंग आणि रांग व्यवस्थापन',
  },
  good_morning: {
    en: 'Good Morning',
    hi: 'शुभ प्रभात',
    mr: 'शुभ प्रभात',
  },
  your_procurement: {
    en: 'Your Procurement',
    hi: 'आपकी खरीद',
    mr: 'तुमची खरेदी',
  },
  token: {
    en: 'Token',
    hi: 'टोकन',
    mr: 'टोकन',
  },
  centre: {
    en: 'Procurement Centre',
    hi: 'खरीद केंद्र',
    mr: 'खरेदी केंद्र',
  },
  estimated_turn: {
    en: 'Estimated Turn',
    hi: 'अनुमानित समय',
    mr: 'अंदाजे वेळ',
  },
  estimated_wait: {
    en: 'Estimated Wait',
    hi: 'अनुमानित प्रतीक्षा',
    mr: 'अंदाजे प्रतीक्षा',
  },
  status: {
    en: 'Status',
    hi: 'स्थिति',
    mr: 'स्थिती',
  },
  track_my_token: {
    en: 'Track My Token',
    hi: 'मेरा टोकन ट्रैक करें',
    mr: 'माझा टोकन ट्रॅक करा',
  },
  get_recommendation: {
    en: 'Get Centre Recommendation',
    hi: 'स्मार्ट केंद्र अनुशंसा देखें',
    mr: 'स्मार्ट केंद्र शिफारस मिळवा',
  },
  nearby_centres: {
    en: 'Nearby Procurement Centres',
    hi: 'निकटतम खरीद केंद्र',
    mr: 'जवळची खरेदी केंद्रे',
  },
  book_slot: {
    en: 'Book Slot',
    hi: 'स्लॉट बुक करें',
    mr: 'स्लॉट बुक करा',
  },
  my_procurement: {
    en: 'Procurement',
    hi: 'फसल खरीद',
    mr: 'धान्य खरेदी',
  },
  payments: {
    en: 'Payments',
    hi: 'भुगतान (DBT)',
    mr: 'पेमेंट (DBT)',
  },
  profile: {
    en: 'Profile',
    hi: 'प्रोफाइल',
    mr: 'प्रोफाइल',
  },
  assisted_kiosk: {
    en: 'CSC Assisted',
    hi: 'सीएससी सहायता',
    mr: 'सीएससी मदत',
  },
  ivr_helpline: {
    en: 'IVR Voice Helpline',
    hi: 'आईवीआर हेल्पलाइन',
    mr: 'आयव्हीआर हेल्पलाइन',
  },
  low_wait: {
    en: 'Low wait',
    hi: 'कम प्रतीक्षा',
    mr: 'कमी प्रतीक्षा',
  },
  moderate: {
    en: 'Moderate',
    hi: 'मध्यम',
    mr: 'मध्यम',
  },
  busy: {
    en: 'Busy',
    hi: 'व्यस्त',
    mr: 'व्यस्त',
  },
  full: {
    en: 'Full — No slots',
    hi: 'पूर्ण — स्लॉट उपलब्ध नहीं',
    mr: 'पूर्ण — जागा शिल्लक नाही',
  },
  why_recommended: {
    en: 'Why is this recommended?',
    hi: 'यह केंद्र क्यों अनुशंसित है?',
    mr: 'हे केंद्र का शिफारस केले आहे?',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('hi');

  useEffect(() => {
    const saved = localStorage.getItem('mandimitra_lang') as Language;
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mandimitra_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
