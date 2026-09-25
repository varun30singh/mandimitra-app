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
  // Brand & Header
  app_name: {
    en: 'MANDI MITRA',
    hi: 'मंडी मित्र',
    mr: 'मंडी मित्र',
  },
  tagline: {
    en: 'Mandi Mitra • Farmer Service',
    hi: 'मंडी मित्र • किसान सेवा',
    mr: 'मंडी मित्र • शेतकरी सेवा',
  },
  verified: {
    en: '✓ Verified',
    hi: '✓ सत्यापित',
    mr: '✓ पडताळणीकृत',
  },
  good_morning: {
    en: 'Good Morning',
    hi: 'शुभ प्रभात',
    mr: 'शुभ प्रभात',
  },

  // Navigation (5 Bottom Items)
  nav_home: {
    en: 'Home',
    hi: 'होम',
    mr: 'मुख्य',
  },
  nav_book: {
    en: 'Book',
    hi: 'स्लॉट बुक',
    mr: 'स्लॉट बुक',
  },
  nav_chatbot: {
    en: 'Chatbot',
    hi: 'सहायक',
    mr: 'सहाय्यक',
  },
  nav_centres: {
    en: 'Centres',
    hi: 'मंडी केंद्र',
    mr: 'खरेदी केंद्र',
  },
  nav_token: {
    en: 'My Token',
    hi: 'मेरा टोकन',
    mr: 'माझा टोकन',
  },

  // Dashboard & Highlights
  your_procurement: {
    en: 'Your Procurement',
    hi: 'आपकी खरीद',
    mr: 'तुमची धान्य खरेदी',
  },
  live_queue_sync: {
    en: 'Live Queue Sync',
    hi: 'लाइव कतार स्थिति',
    mr: 'थेट रांगेची स्थिती',
  },
  book_slot: {
    en: 'Book Slot',
    hi: 'स्लॉट बुक करें',
    mr: 'स्लॉट बुक करा',
  },
  book_slot_sub: {
    en: '30-min guaranteed',
    hi: '30-मिनट गारंटी',
    mr: '30-मिनिट हमी',
  },
  best_mandi: {
    en: 'Best Mandi',
    hi: 'सर्वश्रेष्ठ मंडी',
    mr: 'सर्वोत्तम मंडी',
  },
  zero_wait_prediction: {
    en: 'Zero wait prediction',
    hi: 'शून्य प्रतीक्षा अनुमान',
    mr: 'किमान प्रतीक्षा अंदाज',
  },
  nearby_centres: {
    en: 'Nearby Mandi Centres',
    hi: 'निकटतम मंडी केंद्र',
    mr: 'जवळची खरेदी केंद्रे',
  },
  nearby_sub: {
    en: 'Real-time live queue and wait times across all mandis',
    hi: 'सभी मंडियों में वास्तविक समय की कतार और प्रतीक्षा समय',
    mr: 'सर्व खरेदी केंद्रांवरील थेट रांग आणि प्रतीक्षा वेळ',
  },
  view_all: {
    en: 'View All →',
    hi: 'सभी देखें →',
    mr: 'सर्व पहा →',
  },
  away: {
    en: 'away',
    hi: 'दूर',
    mr: 'लांब',
  },
  speed: {
    en: 'Speed',
    hi: 'गति',
    mr: 'वेग',
  },
  per_farmer: {
    en: 'm/farmer',
    hi: 'मिनट/किसान',
    mr: 'मि/शेतकरी',
  },
  select: {
    en: 'Select',
    hi: 'चुनें',
    mr: 'निवडा',
  },
  ai_pick: {
    en: 'AI Pick',
    hi: 'स्मार्ट सुझाव',
    mr: 'स्मार्ट शिफारस',
  },
  best_choice: {
    en: 'Best Choice',
    hi: 'सर्वोत्तम विकल्प',
    mr: 'सर्वोत्तम पर्याय',
  },

  // Queue Metrics
  farmers_ahead: {
    en: 'Farmers Ahead',
    hi: 'आगे किसान',
    mr: 'पुढील शेतकरी',
  },
  est_wait: {
    en: 'Est. Wait',
    hi: 'अनुमानित प्रतीक्षा',
    mr: 'अंदाजे प्रतीक्षा',
  },
  now_serving: {
    en: 'Now Serving',
    hi: 'वर्तमान टोकन',
    mr: 'सध्याचा टोकन',
  },
  next_in_line: {
    en: 'Next in Line',
    hi: 'अगला टोकन',
    mr: 'पुढील टोकन',
  },
  counter: {
    en: 'Counter',
    hi: 'काउंटर',
    mr: 'काउंटर',
  },
  position: {
    en: 'Position',
    hi: 'स्थान',
    mr: 'क्रमांक',
  },
  turn: {
    en: 'Turn ~',
    hi: 'बारी ~',
    mr: 'पाळी ~',
  },
  min: {
    en: 'min',
    hi: 'मिनट',
    mr: 'मिनिट',
  },
  queue: {
    en: 'Queue',
    hi: 'कतार',
    mr: 'रांग',
  },
  wait: {
    en: 'Wait',
    hi: 'प्रतीक्षा',
    mr: 'प्रतीक्षा',
  },
  capacity: {
    en: 'Capacity',
    hi: 'क्षमता',
    mr: 'क्षमता',
  },
  open_slots: {
    en: 'Open Slots',
    hi: 'उपलब्ध स्लॉट',
    mr: 'उपलब्ध जागा',
  },
  slot_label: {
    en: 'Slot',
    hi: 'स्लॉट',
    mr: 'स्लॉट',
  },
  wait_low: {
    en: 'Low Wait',
    hi: 'कम प्रतीक्षा',
    mr: 'कमी प्रतीक्षा',
  },
  wait_moderate: {
    en: 'Moderate',
    hi: 'मध्यम',
    mr: 'मध्यम',
  },
  wait_busy: {
    en: 'Busy',
    hi: 'व्यस्त',
    mr: 'व्यस्त',
  },
  wait_full: {
    en: 'Full',
    hi: 'पूर्ण',
    mr: 'पूर्ण',
  },

  // Token Tracker Page
  my_digital_token: {
    en: 'My Digital Token',
    hi: 'मेरा डिजिटल टोकन',
    mr: 'माझा डिजिटल टोकन',
  },
  your_token: {
    en: 'YOUR TOKEN',
    hi: 'आपका टोकन',
    mr: 'तुमचा टोकन',
  },
  refresh: {
    en: 'Refresh',
    hi: 'रिफ्रेश',
    mr: 'ताजे करा',
  },
  departure_guide: {
    en: 'Departure Guide',
    hi: 'प्रस्थान सलाह',
    mr: 'प्रस्थान सल्ला',
  },
  depart_at: {
    en: 'Depart At',
    hi: 'प्रस्थान समय',
    mr: 'निघण्याची वेळ',
  },
  mandi_entry_pass: {
    en: 'MANDI ENTRY PASS QR',
    hi: 'मंडी प्रवेश पास क्यूआर',
    mr: 'मंडी प्रवेश पास क्यूआर',
  },
  pass_instructions: {
    en: 'Show this digital pass at the entrance weighbridge gate.',
    hi: 'मंडी प्रवेश द्वार व धर्मकाँटा तौल पर यह डिजिटल पास दिखाएँ।',
    mr: 'खरेदी केंद्राच्या प्रवेशद्वारावर हा डिजिटल पास दाखवा.',
  },
  i_have_arrived: {
    en: 'I Have Arrived at Mandi (Check In)',
    hi: 'मैं मंडी पहुँच गया हूँ (चेक-इन)',
    mr: 'मी खरेदी केंद्रावर पोहोचलो आहे (चेक-इन)',
  },
  checking_in: {
    en: 'Checking in...',
    hi: 'चेक-इन हो रहा है...',
    mr: 'चेक-इन होत आहे...',
  },
  no_active_token: {
    en: 'No Active Procurement Token Today',
    hi: 'आज के लिए कोई सक्रिय टोकन नहीं',
    mr: 'आजसाठी कोणताही सक्रिय टोकन नाही',
  },
  no_token_sub: {
    en: 'Avoid waiting in long mandi lines. Schedule a guaranteed appointment slot.',
    hi: 'लंबी कतारों से बचें। गारंटीकृत 30-मिनट का खरीद स्लॉट बुक करें।',
    mr: 'लांब रांगा टाळा. हमीभाव खरेदीसाठी ३० मिनिटांचा स्लॉट बुक करा.',
  },
  track_my_token: {
    en: 'Track My Token',
    hi: 'टोकन स्थिति ट्रैक करें',
    mr: 'टोकन स्थिती ट्रॅक करा',
  },
  get_recommendation: {
    en: 'Smart Recommendation',
    hi: 'स्मार्ट केंद्र सुझाव',
    mr: 'स्मार्ट केंद्र शिफारस',
  },

  // Booking Flow
  book_procurement_slot: {
    en: 'Book Procurement Slot',
    hi: 'खरीद स्लॉट बुकिंग',
    mr: 'खरेदी स्लॉट बुकिंग',
  },
  book_sub: {
    en: 'Select centre, crop, and guaranteed 30-minute arrival window.',
    hi: 'अपनी पसंद का केंद्र, फसल और 30-मिनट का आगमन स्लॉट चुनें।',
    mr: 'पसंतीचे केंद्र, पीक आणि हमी दिलेली ३० मिनिटांची वेळ निवडा.',
  },
  step_1_centre: {
    en: '1. Select Procurement Centre',
    hi: '1. खरीद केंद्र चुनें',
    mr: '१. खरेदी केंद्र निवडा',
  },
  recommended_centre_b: {
    en: 'Recommended: Centre B',
    hi: 'अनुशंसित: केंद्र B',
    mr: 'शिफारस केलेले: केंद्र B',
  },
  step_2_crop: {
    en: '2. Crop & Quantity',
    hi: '2. फसल एवं मात्रा',
    mr: '२. पीक आणि प्रमाण',
  },
  step_3_slot: {
    en: '3. Select 30-Min Arrival Slot',
    hi: '3. 30-मिनट का आगमन स्लॉट चुनें',
    mr: '३. ३० मिनिटांचा आगमन स्लॉट निवडा',
  },
  today: {
    en: 'Today',
    hi: 'आज',
    mr: 'आज',
  },
  loading_slots: {
    en: 'Loading available slots...',
    hi: 'उपलब्ध स्लॉट लोड हो रहे हैं...',
    mr: 'उपलब्ध स्लॉट लोड होत आहेत...',
  },
  approx_quantity: {
    en: 'Approx Quantity (Quintals)',
    hi: 'अनुमानित मात्रा (क्विंटल)',
    mr: 'अंदाजे प्रमाण (क्विंटल)',
  },
  confirm_generate_token: {
    en: 'Confirm & Generate Token',
    hi: 'पुष्टि करें एवं टोकन प्राप्त करें',
    mr: 'खात्री करा आणि टोकन मिळवा',
  },
  generating_token: {
    en: 'Generating Token...',
    hi: 'टोकन तैयार हो रहा है...',
    mr: 'टोकन तयार होत आहे...',
  },
  instant_guarantee: {
    en: '✓ Instant digital token • Anti-overbooking buffer protected',
    hi: '✓ त्वरित डिजिटल टोकन • ओवरबुकिंग सुरक्षा रक्षित',
    mr: '✓ झटपट डिजिटल टोकन • सुरक्षित क्षमता नियोजन',
  },
  spots: {
    en: 'spots',
    hi: 'स्थान',
    mr: 'जागा',
  },

  // Crops
  crop_wheat: {
    en: 'Wheat (MSP: ₹2,275)',
    hi: 'गेहूँ (सरकारी MSP: ₹2,275)',
    mr: 'गहू (हमीभाव MSP: ₹2,275)',
  },
  crop_onion: {
    en: 'Onion (Graded Red)',
    hi: 'प्याज (लाल ग्रेड)',
    mr: 'कांदा (दर्जेदार लाल)',
  },
  crop_soybean: {
    en: 'Soybean (MSP: ₹4,892)',
    hi: 'सोयाबीन (सरकारी MSP: ₹4,892)',
    mr: 'सोयाबीन (हमीभाव MSP: ₹4,892)',
  },
  crop_gram: {
    en: 'Gram / Chana (MSP: ₹5,440)',
    hi: 'चना (सरकारी MSP: ₹5,440)',
    mr: 'हरभरा / चना (हमीभाव MSP: ₹5,440)',
  },

  // Profile Modal
  profile_title: {
    en: 'Farmer Profile & Settings',
    hi: 'किसान प्रोफाइल एवं सेटिंग्स',
    mr: 'शेतकरी प्रोफाइल आणि सेटिंग्ज',
  },
  edit_profile_tab: {
    en: 'Edit Profile',
    hi: 'नाम एवं विवरण',
    mr: 'नाव व माहिती',
  },
  language_tab: {
    en: 'Language',
    hi: 'भाषा (Language)',
    mr: 'भाषा (Language)',
  },
  password_tab: {
    en: 'Password',
    hi: 'पासवर्ड / पिन',
    mr: 'पासवर्ड / पिन',
  },
  farmer_full_name: {
    en: 'Farmer Full Name',
    hi: 'किसान का पूरा नाम',
    mr: 'शेतकऱ्याचे संपूर्ण नाव',
  },
  village: {
    en: 'Village',
    hi: 'गाँव (Village)',
    mr: 'गाव (Village)',
  },
  taluka: {
    en: 'Taluka',
    hi: 'तहसील (Taluka)',
    mr: 'तालुका (Taluka)',
  },
  district: {
    en: 'District',
    hi: 'ज़िला (District)',
    mr: 'जिल्हा (District)',
  },
  primary_crop: {
    en: 'Primary Crop',
    hi: 'मुख्य फसल',
    mr: 'मुख्य पीक',
  },
  save_profile: {
    en: 'Save Profile Changes',
    hi: 'परिवर्तन सहेजें',
    mr: 'बदल जतन करा',
  },
  saving: {
    en: 'Saving...',
    hi: 'सहेजा जा रहा है...',
    mr: 'जतन करत आहे...',
  },
  current_pin: {
    en: 'Current Password / PIN',
    hi: 'वर्तमान पासवर्ड / पिन',
    mr: 'सध्याचा पासवर्ड / पिन',
  },
  new_pin: {
    en: 'New Password / PIN',
    hi: 'नया पासवर्ड / पिन',
    mr: 'नवीन पासवर्ड / पिन',
  },
  confirm_pin: {
    en: 'Confirm New Password',
    hi: 'पासवर्ड पुनः दर्ज करें',
    mr: 'पासवर्ड पुन्हा टाका',
  },
  update_password: {
    en: 'Update Password / PIN',
    hi: 'पासवर्ड अपडेट करें',
    mr: 'पासवर्ड अपडेट करा',
  },
  aadhaar_verified: {
    en: 'Aadhaar-Linked Verified Mobile',
    hi: 'आधार-लिंक्ड सत्यापित मोबाइल',
    mr: 'आधार-संलग्न पडताळणीकृत मोबाइल',
  },
  select_preferred_lang: {
    en: 'Select Preferred Language',
    hi: 'पसंदीदा भाषा चुनें',
    mr: 'पसंतीची भाषा निवडा',
  },

  // Login & Registration
  farmer_login_heading: {
    en: 'Farmer Login',
    hi: 'किसान लॉगिन',
    mr: 'शेतकरी लॉगिन',
  },
  enter_phone: {
    en: 'Enter Phone Number',
    hi: 'फ़ोन नंबर दर्ज करें',
    mr: 'फोन नंबर टाका',
  },
  enter_password: {
    en: 'Enter Password',
    hi: 'पासवर्ड दर्ज करें',
    mr: 'पासवर्ड टाका',
  },
  phone_placeholder: {
    en: 'Enter 10-digit mobile number',
    hi: '10 अंकों का मोबाइल नंबर दर्ज करें',
    mr: '10 अंकी मोबाइल नंबर टाका',
  },
  password_placeholder: {
    en: 'Enter your password',
    hi: 'अपना पासवर्ड दर्ज करें',
    mr: 'आपला पासवर्ड टाका',
  },
  login_button: {
    en: 'Login',
    hi: 'लॉगिन करें',
    mr: 'लॉगिन करा',
  },
  new_user_question: {
    en: 'New user? ',
    hi: 'नया खाता? ',
    mr: 'नवीन शेतकरी? ',
  },
  create_new_account: {
    en: 'Create new account',
    hi: 'नया खाता बनाएँ',
    mr: 'नवीन खाते तयार करा',
  },
  create_account_heading: {
    en: 'Create Farmer Account',
    hi: 'नया किसान खाता बनाएँ',
    mr: 'नवीन शेतकरी खाते तयार करा',
  },
  create_account_sub: {
    en: 'Enter your details to register as a verified farmer',
    hi: 'सत्यापित किसान के रूप में पंजीकरण करने के लिए अपना विवरण दर्ज करें',
    mr: 'नोंदणीकृत शेतकरी म्हणून खात्यासाठी आपली माहिती भरा',
  },
  name_field: {
    en: 'Full Name',
    hi: 'पूरा नाम',
    mr: 'पूर्ण नाव',
  },
  aadhaar_field: {
    en: 'Aadhaar Card Number',
    hi: 'आधार कार्ड नंबर',
    mr: 'आधार कार्ड नंबर',
  },
  phone_field: {
    en: 'Phone Number',
    hi: 'फ़ोन नंबर',
    mr: 'फोन नंबर',
  },
  password_field: {
    en: 'Password',
    hi: 'पासवर्ड',
    mr: 'पासवर्ड',
  },
  re_password_field: {
    en: 'Re-enter Password',
    hi: 'पासवर्ड पुनः दर्ज करें',
    mr: 'पासवर्ड पुन्हा टाका',
  },
  area_field: {
    en: 'Area where living (Village / Taluka)',
    hi: 'रहने का क्षेत्र (गाँव / तहसील)',
    mr: 'राहण्याचे ठिकाण (गाव / तालुका)',
  },
  submit_button: {
    en: 'Submit',
    hi: 'सबमिट करें',
    mr: 'सबमिट करा',
  },
  already_have_account: {
    en: 'Already have an account? ',
    hi: 'पहले से खाता है? ',
    mr: 'आधीच खाते आहे? ',
  },
  login_here: {
    en: 'Login here',
    hi: 'यहाँ लॉगिन करें',
    mr: 'येथे लॉगिन करा',
  },

  // Chatbot
  chatbot_assistant: {
    en: 'MandiMitra AI Assistant',
    hi: 'मंडीमित्र एआई सहायक',
    mr: 'मंडीमित्र एआय सहाय्यक',
  },
  companion_sub: {
    en: 'Smart Procurement Companion',
    hi: 'कतार एवं खरीद साथी',
    mr: 'रांग व खरेदी मार्गदर्शक',
  },
  ask_placeholder: {
    en: 'Ask e.g. "Where is my token?"...',
    hi: 'यहाँ लिखें (जैसे: "मेरा टोकन कहाँ है?")...',
    mr: 'येथे टाईप करा (उदा: "माझा टोकन कुठे आहे?")...',
  },
  prompt_where_is_token: {
    en: 'Where is my token?',
    hi: 'मेरा टोकन कहाँ है?',
    mr: 'माझा टोकन कुठे आहे?',
  },
  prompt_best_mandi: {
    en: 'Best Mandi Centre',
    hi: 'सर्वोत्तम मंडी केंद्र',
    mr: 'सर्वोत्तम खरेदी केंद्र',
  },
  prompt_wheat_msp: {
    en: 'Wheat MSP Rate 2026',
    hi: 'गेहूँ सरकारी MSP भाव',
    mr: 'गहू हमीभाव (MSP)',
  },
  prompt_documents: {
    en: 'Documents Required',
    hi: 'आवश्यक दस्तावेज',
    mr: 'लागणारी कागदपत्रे',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'en';
  }
  // Check navigator languages
  const langs = navigator.languages || [navigator.language || 'en'];
  for (const lang of langs) {
    const code = (lang || '').toLowerCase();
    if (code.startsWith('mr')) return 'mr'; // Marathi
    if (code.startsWith('hi')) return 'hi'; // Hindi
    if (code.startsWith('en')) return 'en'; // English
  }
  return 'en';
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // 1. If user explicitly chose a language via the profile drawer, respect that
    const userChosen = localStorage.getItem('mandimitra_lang_chosen');
    const saved = localStorage.getItem('mandimitra_lang') as Language;

    if (userChosen === 'true' && saved && ['en', 'hi', 'mr'].includes(saved)) {
      setLanguageState(saved);
      return;
    }

    // 2. Otherwise automatically detect the phone's system language
    const deviceLang = detectDeviceLanguage();
    setLanguageState(deviceLang);
    localStorage.setItem('mandimitra_lang', deviceLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mandimitra_lang', lang);
    localStorage.setItem('mandimitra_lang_chosen', 'true');
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
