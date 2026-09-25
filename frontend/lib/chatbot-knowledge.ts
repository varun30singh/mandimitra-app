/**
 * MandiMitra Comprehensive Multilingual Agricultural Knowledge Base
 * Covering 40+ topic domains with 800+ question variations across English, Hindi, and Marathi.
 */

export interface KnowledgeItem {
  id: string;
  category: string;
  keywords: string[];
  patterns: RegExp[];
  answers: {
    en: string;
    hi: string;
    mr: string;
  };
  followUpQuestions: {
    en: string[];
    hi: string[];
    mr: string[];
  };
}

export const DEFAULT_SUGGESTED_QUESTIONS: Record<'en' | 'hi' | 'mr', string[]> = {
  en: [
    'Where is my active token in the queue?',
    'What is the MSP rate for Wheat and Paddy?',
    'What documents are required at the mandi?',
    'How do I book a procurement slot?',
    'How does DBT payment transfer work?',
    'What is the maximum moisture limit for grains?',
  ],
  hi: [
    'मेरा सक्रिय टोकन कतार में कहाँ है?',
    'गेहूँ और धान का सरकारी MSP भाव क्या है?',
    'मंडी में कौन-कौन से दस्तावेज चाहिए?',
    'खरीद स्लॉट कैसे बुक करें?',
    'DBT बैंक खाता भुगतान कब तक आता है?',
    'फसल में नमी (Moisture) की अधिकतम सीमा क्या है?',
  ],
  mr: [
    'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
    'गहू आणि भाताचा शासकीय हमीभाव (MSP) काय आहे?',
    'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
    'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
    'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
    'धान्यामध्ये ओलावा (Moisture) किती टक्के चालतो?',
  ],
};

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // 1. TOKEN LIVE STATUS
  {
    id: 'token_live_status',
    category: 'token',
    keywords: [
      'token', 'queue', 'turn', 'number', 'waiting', 'ahead', 'position', 'status',
      'टोकन', 'कतार', 'नंबर', 'स्थिति', 'प्रतीक्षा', 'आगे', 'बारी',
      'रांग', 'क्रमांक', 'नंबर', 'प्रतीक्षा', 'पाळी', 'पुढे'
    ],
    patterns: [
      /token/i, /queue/i, /turn/i, /टोकन/i, /कतार/i, /रांग/i, /नंबर/i, /wait.*time/i, /kab.*aayega/i, /kadhi.*yenar/i
    ],
    answers: {
      en: 'Your active token status is tracked live on your dashboard. Currently, tokens are processed every 8-12 minutes per platform. When 3 or fewer farmers remain ahead of you, MandiMitra sends an SMS/WhatsApp travel alert recommending you begin travel to the yard.',
      hi: 'आपका सक्रिय टोकन लाइव ट्रैक किया जा रहा है। वर्तमान में प्रत्येक प्लेटफॉर्म पर प्रति किसान 8 से 12 मिनट लगते हैं। जब आपके आगे 3 या कम किसान रह जाते हैं, तो मंडीमित्र आपको एसएमएस और व्हाट्सएप पर यात्रा शुरू करने का अलर्ट भेजता है।',
      mr: 'तुमचा सक्रिय टोकन थेट ट्रॅक केला जात आहे. सध्या प्रत्येक वजन काट्यावर दर १० मिनिटांनी टोकन पुढे सरकते. जेव्हा तुमच्या पुढे ३ पेक्षा कमी शेतकरी राहतील, तेव्हा मंडीमित्र तुम्हाला प्रवासास निघण्याचा एसएमएस आणि व्हॉट्सॲप अलर्ट पाठवतो.'
    },
    followUpQuestions: {
      en: [
        'How do I check in at the weighbridge gate?',
        'What documents are needed when token is called?',
        'What happens if I miss my token call time?',
        'How to cancel or reschedule my booked slot?'
      ],
      hi: [
        'कांटे के मुख्य गेट पर चेक-इन कैसे करें?',
        'टोकन नंबर आने पर कौन से दस्तावेज दिखाने हैं?',
        'यदि समय पर न पहुँच पाएँ तो क्या टोकन रद्द होता है?',
        'स्लॉट समय कैसे बदलें या रद्द करें?'
      ],
      mr: [
        'वजनकाटा गेटवर चेक-इन कसे करावे?',
        'टोकन नंबर आल्यावर कोणती कागदपत्रे लागतात?',
        'वेळेवर न पोहोचल्यास टोकन रद्द होते का?',
        'बुक केलेला स्लॉट कसा बदलावा किंवा रद्द करावा?'
      ]
    }
  },

  // 2. GATE CHECK-IN PROCESS
  {
    id: 'gate_checkin',
    category: 'token',
    keywords: [
      'check in', 'checkin', 'gate', 'entry', 'pass', 'qr', 'entry pass',
      'चेक इन', 'गेट', 'प्रवेश', 'पास', 'क्यूआर',
      'चेक इन', 'प्रवेश', 'गेट पास', 'क्यूआर कोड'
    ],
    patterns: [
      /check.*in/i, /gate/i, /entry.*pass/i, /qr/i, /गेट/i, /प्रवेश/i, /गेट.*पास/i
    ],
    answers: {
      en: 'Gate Check-in Process:\n1. Arrive at the APMC entry gate during your 30-minute arrival window.\n2. Show your Digital Entry Pass QR code from the MandiMitra app to the gate scanner operator.\n3. The operator scans the QR code, verifies vehicle number, and directs your truck to Weighbridge 1 or the unloading bay.',
      hi: 'गेट चेक-इन प्रक्रिया:\n1. अपने आवंटित 30 मिनट के समय में मंडी के मुख्य प्रवेश द्वार पर पहुँचें।\n2. मंडीमित्र ऐप में प्राप्त डिजिटल एंट्री पास का QR कोड गेट ऑपरेटर को दिखाएँ।\n3. ऑपरेटर QR कोड स्कैन कर वाहन नंबर सत्यापित करेगा और आपकी ट्रॉली को तौल कांटे की ओर रवाना करेगा।',
      mr: 'गेट चेक-इन प्रक्रिया:\n१. तुमच्या ३० मिनिटांच्या वेळेत खरेदी केंद्राच्या मुख्य प्रवेशद्वारावर पोहोचा.\n२. मंडीमित्र ॲपमधील डिजिटल एंट्री पासचा QR कोड गेट ऑपरेटरला दाखवा.\n३. ऑपरेटर QR कोड स्कॅन करून वाहनाचा क्रमांक नोंदवेल आणि वाहन वजन काट्याकडे पाठवेल.'
    },
    followUpQuestions: {
      en: [
        'How is moisture tested at the weighbridge?',
        'What is gross weight and tare weight?',
        'Where is my active token in the queue?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'तौल कांटे पर नमी की जाँच कैसे होती है?',
        'सकल वजन (Gross) और खाली वजन (Tare) क्या है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'वजनकाट्यावर धान्यातील ओलावा कसा तपासतात?',
        'वाहनाचे एकूण वजन आणि रिकामे वजन कसे काढतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 3. MISSED TOKEN / GRACE PERIOD
  {
    id: 'token_expiry',
    category: 'token',
    keywords: [
      'late', 'miss', 'missed', 'expired', 'grace', 'time out', 'delay',
      'देर', 'छूट गया', 'लेट', 'समाप्त', 'विलंब',
      'उशीर', 'वेळ संपली', 'हुकले', 'टोकन संपले'
    ],
    patterns: [
      /miss.*token/i, /late/i, /grace/i, /expire/i, /उशीर/i, /लेट/i, /देर/i, /छूट/i
    ],
    answers: {
      en: 'If you arrive late for your token call, you are granted a 45-minute grace buffer. During grace, you can report directly to Counter 1. If delayed by more than 45 minutes, your token moves to the "Buffer Queue" and will be served after the current hourly batch.',
      hi: 'यदि आप अपने टोकन समय पर नहीं पहुँच पाते हैं, तो आपको 45 मिनट का ग्रेस समय मिलता है। इस दौरान आप काउंटर 1 पर रिपोर्ट कर सकते हैं। 45 मिनट से अधिक देरी होने पर आपका टोकन बफर कतार में डाल दिया जाता है और वर्तमान बैच समाप्त होने के बाद बुलाया जाता है।',
      mr: 'जर तुम्ही वेळेवर पोहोचू शकला नाही, तर ४५ मिनिटांचा सवलत वेळ (Grace Period) मिळतो. त्यादरम्यान काऊंटर १ वर संपर्क साधावा. ४५ मिनिटांपेक्षा जास्त उशीर झाल्यास टोकन बफर रांगेत जाते व चालू बॅचनंतर बोलावले जाते.'
    },
    followUpQuestions: {
      en: [
        'How do I reschedule a delivery slot?',
        'What documents are needed when token is called?',
        'What are the mandi operating hours?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'डिलीवरी स्लॉट को दोबारा कैसे रीशेड्यूल करें?',
        'टोकन आने पर कौन से दस्तावेज प्रस्तुत करें?',
        'मंडी खुलने और बंद होने का समय क्या है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'स्लॉटची तारीख किंवा वेळ कशी बदलावी?',
        'टोकन आल्यावर कोणती कागदपत्रे सादर करावीत?',
        'खरेदी केंद्राच्या कामकाजाची वेळ काय आहे?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 4. SLOT BOOKING PROCESS
  {
    id: 'slot_booking_process',
    category: 'slots',
    keywords: [
      'book slot', 'slot booking', 'appointment', 'how to book', 'schedule', 'delivery date',
      'स्लॉट बुक', 'बुकिंग कैसे करें', 'तारीख', 'समय', 'अपॉइंटमेंट',
      'स्लॉट बुकिंग', 'कसे बुक करावे', 'वेळ बुक', 'तारीख निवड'
    ],
    patterns: [
      /how.*book/i, /slot.*book/i, /appointment/i, /स्लॉट.*बुक/i, /कसे.*बुक/i, /बुकिंग/i
    ],
    answers: {
      en: 'To book a procurement slot:\n1. Go to "Book Slot" in the MandiMitra menu.\n2. Choose your preferred Procurement Centre.\n3. Pick an available date and 30-minute time window.\n4. Enter your crop type and estimated quantity in quintals.\n5. Click "Confirm Booking" to generate your Digital Entry QR Pass.',
      hi: 'खरीद स्लॉट बुक करने का तरीका:\n1. मंडीमित्र ऐप में "Book Slot" पर जाएँ।\n2. अपना पसंदीदा खरीद केंद्र चुनें।\n3. उपलब्ध तारीख और 30 मिनट का समय स्लॉट चुनें।\n4. फसल का नाम और अनुमानित क्विंटल मात्रा दर्ज करें।\n5. "Confirm Booking" दबाकर तुरंत अपना डिजिटल क्यूआर पास प्राप्त करें।',
      mr: 'धान्य विक्री स्लॉट बुक करण्याची पद्धत:\n१. मंडीमित्र मेनूमधील "Book Slot" पर्यायावर जा.\n२. तुमचे जवळचे खरेदी केंद्र निवडा.\n३. उपलब्ध तारीख आणि ३० मिनिटांची वेळ निवडा.\n४. शेतमालाचे नाव आणि अंदाजे क्विंटल वजन भरा.\n५. "Confirm Booking" वर क्लिक करून लगेच डिजिटल QR पास मिळवा.'
    },
    followUpQuestions: {
      en: [
        'What is the maximum quantity allowed per slot?',
        'Can I cancel or reschedule my slot?',
        'What documents are required at the mandi?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'एक स्लॉट में अधिकतम कितने क्विंटल की अनुमति है?',
        'क्या बुक किया हुआ स्लॉट रद्द या बदला जा सकता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'एका स्लॉटमध्ये जास्तीत जास्त किती क्विंटल धान्य आणता येते?',
        'बुक केलेला स्लॉट रद्द किंवा पुढे ढकलता येतो का?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'गहू आणि भाताचा शासकीय हमीभाव (MSP) काय आहे?'
      ]
    }
  },

  // 5. SLOT CAPACITY & TRUCK LIMIT
  {
    id: 'slot_capacity',
    category: 'slots',
    keywords: [
      'capacity', 'truck limit', 'quantity limit', 'max quintal', 'trolley', 'vehicle limit',
      'क्षमता', 'अधिकतम वजन', 'ट्रॉली लिमिट', 'क्विंटल सीमा',
      'मर्यादा', 'क्षमता', 'जास्तीत जास्त वजन', 'ट्रॅक्टर मर्यादा'
    ],
    patterns: [
      /capacity/i, /truck.*limit/i, /max.*quintal/i, /trolley/i, /क्षमता/i, /मर्यादा/i, /क्विंटल.*सीमा/i
    ],
    answers: {
      en: 'Each slot allows up to 35-40 metric tonnes (approx. 350-400 quintals) per truck, or up to 80-120 quintals per tractor-trolley. If you have a larger harvest, you can split it across two consecutive slots on the same day.',
      hi: 'प्रत्येक स्लॉट में एक बड़े ट्रक के लिए 35-40 टन (लगभग 350-400 क्विंटल) अथवा ट्रैक्टर-ट्रॉली के लिए 80-120 क्विंटल तक की अनुमति है। यदि आपके पास अधिक उपज है, तो आप उसी दिन दो लगातार स्लॉट बुक कर सकते हैं।',
      mr: 'प्रत्येक स्लॉटमध्ये मोठ्या ट्रकसाठी ३५ ते ४० टन (सुमारे ३५०-४०० क्विंटल) किंवा ट्रॅक्टर-ट्रॉलीसाठी ८० ते १२० क्विंटलपर्यंत मर्यादा असते. माल जास्त असल्यास एकाच दिवशी सलग दोन स्लॉट बुक करता येतात.'
    },
    followUpQuestions: {
      en: [
        'How do I book a procurement slot?',
        'How is moisture tested at the weighbridge?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'खरीद स्लॉट कैसे बुक करें?',
        'तौल कांटे पर नमी की जाँच कैसे होती है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'वजनकाट्यावर ओलावा कसा तपासतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 6. ALL MSP SUMMARY
  {
    id: 'msp_all_summary',
    category: 'msp',
    keywords: [
      'msp', 'rate', 'price', 'rates', 'minimum support price', 'bhav', 'dar',
      'एमएसपी', 'भाव', 'दर', 'सरकारी रेट', 'हमीभाव', 'किंमत'
    ],
    patterns: [
      /msp/i, /rate/i, /price/i, /भाव/i, /हमीभाव/i, /सरकारी.*दर/i, /minimum.*support/i
    ],
    answers: {
      en: 'Official 2025-2026 Government MSP Rates (per quintal):\n• Wheat: ₹2,275 - ₹2,425\n• Paddy (Common): ₹2,300 | Grade A: ₹2,320\n• Mustard: ₹5,650 - ₹5,950\n• Soybean: ₹4,892\n• Gram (Chana): ₹5,440\n• Cotton (Medium): ₹7,121 | (Long): ₹7,521\n• Maize: ₹2,225\n• Groundnut: ₹6,783\n• Tur (Arhar): ₹7,550\n• Moong: ₹8,682\n• Urad: ₹7,400',
      hi: 'वर्ष 2025-2026 के लिए सरकारी न्यूनतम समर्थन मूल्य (MSP प्रति क्विंटल):\n• गेहूँ (Wheat): ₹2,275 - ₹2,425\n• धान (Paddy Common): ₹2,300 | ग्रेड ए: ₹2,320\n• सरसों (Mustard): ₹5,650 - ₹5,950\n• सोयाबीन (Soybean): ₹4,892\n• चना (Gram): ₹5,440\n• कपास (Cotton): ₹7,121 - ₹7,521\n• मक्का (Maize): ₹2,225\n• मूँगफली (Groundnut): ₹6,783\n• तुअर (Arhar): ₹7,550\n• मूँग (Moong): ₹8,682\n• उड़द (Urad): ₹7,400',
      mr: 'सन २०२५-२०२६ चे शासकीय हमीभाव (MSP प्रति क्विंटल):\n• गहू (Wheat): ₹२,२७५ - ₹२,४२५\n• भात / धान (Paddy): ₹२,३०० | ग्रेड ए: ₹२,३२०\n• मोहरी (Mustard): ₹५,६५० - ₹५,९५०\n• सोयाबीन (Soybean): ₹४,८९२\n• हरभरा / चना (Gram): ₹५,४४०\n• कापूस (Cotton): ₹७,१२१ - ₹७,५२१\n• मका (Maize): ₹२,२२५\n• भुईमूग (Groundnut): ₹६,७८३\n• तूर (Tur): ₹७,५५०\n• मूग (Moong): ₹८,६८२\n• उडीद (Urad): ₹७,४००'
    },
    followUpQuestions: {
      en: [
        'What is the moisture limit for wheat and soybean?',
        'How does DBT payment transfer work?',
        'What documents are required at the mandi?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'गेहूँ और सोयाबीन में नमी की सीमा क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'गहू आणि सोयाबीनसाठी ओलावा मर्यादा काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 7. WHEAT MSP & QUALITY
  {
    id: 'msp_wheat',
    category: 'msp',
    keywords: [
      'wheat', 'gehu', 'gehoon', 'gahu', 'गेहूँ', 'गहू', 'wheat msp', 'wheat moisture'
    ],
    patterns: [
      /wheat/i, /gehu/i, /गेहूँ/i, /गहू/i
    ],
    answers: {
      en: 'Wheat MSP is fixed at ₹2,275/quintal (Rabi 2025-26 up to ₹2,425). Fair Average Quality (FAQ) standards require maximum 12% moisture. Grains with 12-14% moisture face a proportional weight deduction of 0.5% per 1% moisture. Wheat above 14% moisture is rejected.',
      hi: 'गेहूँ का न्यूनतम समर्थन मूल्य ₹2,275 प्रति क्विंटल (रबी 2025-26 हेतु ₹2,425) निर्धारित है। मानक गुणवत्ता (FAQ) के तहत नमी अधिकतम 12% होनी चाहिए। 12% से 14% नमी होने पर 0.5% प्रति प्रतिशत वजन कटौती होती है। 14% से अधिक नमी होने पर माल अस्वीकृत हो सकता है।',
      mr: 'गव्हाचा हमीभाव ₹२,२७५ प्रति क्विंटल (रब्बी २०२५-२६ साठी ₹२,४२५) आहे. FAQ नियमांनुसार ओलावा कमाल १२% असणे आवश्यक आहे. १२% ते १४% ओलावा असल्यास प्रति टक्क्याला ०.५% कपात होते. १४% पेक्षा जास्त ओलावा असल्यास गहू नाकारला जाऊ शकतो.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture limit for Paddy and Soybean?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'धान और सोयाबीन में नमी की सीमा क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'भात आणि सोयाबीनसाठी ओलावा मर्यादा काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 8. PADDY / RICE MSP & QUALITY
  {
    id: 'msp_paddy',
    category: 'msp',
    keywords: [
      'paddy', 'rice', 'dhan', 'bhat', 'tandul', 'धान', 'चावल', 'भात', 'तांदूळ'
    ],
    patterns: [
      /paddy/i, /rice/i, /dhan/i, /धान/i, /चावल/i, /भात/i, /तांदूळ/i
    ],
    answers: {
      en: 'Paddy MSP: Common Grade is ₹2,300/quintal and Grade A is ₹2,320/quintal. Maximum permissible moisture content is 17%. Foreign matter allowance is up to 1.0%, and damaged/discolored grain is capped at 5%.',
      hi: 'धान का सरकारी समर्थन मूल्य: सामान्य धान ₹2,300 प्रति क्विंटल तथा ग्रेड-ए धान ₹2,320 प्रति क्विंटल है। नमी की अधिकतम सीमा 17% निर्धारित है। बाह्य कचरा (Foreign matter) 1.0% तक और बदरंग दाने 5% तक अनुमन्य हैं।',
      mr: 'भाताचा (धान) हमीभाव: साधारण प्रत ₹२,३०० प्रति क्विंटल व ग्रेड-ए प्रत ₹२,३२० प्रति क्विंटल आहे. ओलावा कमाल १७% पर्यंत ग्राह्य धरला जातो. काडीकचरा १.०% व डागी दाणे ५% पर्यंत स्वीकार्य आहेत.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Wheat and Mustard?',
        'How is moisture tested at the weighbridge?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'गेहूँ और सरसों का सरकारी MSP भाव क्या है?',
        'तौल कांटे पर नमी की जाँच कैसे होती है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'गहू आणि मोहरीचा शासकीय हमीभाव काय आहे?',
        'वजनकाट्यावर ओलावा कसा तपासतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 9. SOYBEAN MSP & QUALITY
  {
    id: 'msp_soybean',
    category: 'msp',
    keywords: [
      'soybean', 'soya', 'soyabean', 'सोयाबीन', 'सोया'
    ],
    patterns: [
      /soybean/i, /soya/i, /सोयाबीन/i
    ],
    answers: {
      en: 'Soybean MSP is ₹4,892 per quintal. FAQ procurement parameters: Moisture must not exceed 12%. Foreign matter max 2%, damaged/green immature seeds max 3%. Ensure pods are fully dried in sunlight before bringing them to the APMC.',
      hi: 'सोयाबीन का न्यूनतम समर्थन मूल्य ₹4,892 प्रति क्विंटल है। सरकारी खरीद मानक: नमी 12% से अधिक नहीं होनी चाहिए। कचरा अधिकतम 2% और हरे/अपरिपक्व दाने अधिकतम 3% अनुमन्य हैं। मंडी लाने से पूर्व माल को धूप में अच्छी तरह सुखा लें।',
      mr: 'सोयाबीनचा हमीभाव ₹४,८९२ प्रति क्विंटल आहे. खरेदी निकष: ओलावा कमाल १२% असावा. काडीकचरा २% व हिरवे/अपरिपक्व दाणे ३% पर्यंत चालतात. केंद्रावर आणण्यापूर्वी सोयाबीन उन्हात नीट वाळवून घ्यावे.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture deduction formula?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'नमी की अधिकता पर कटौती का फॉर्मूला क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'ओलावा जास्त असल्यास वजनात कपात कशी होते?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 10. MUSTARD MSP
  {
    id: 'msp_mustard',
    category: 'msp',
    keywords: [
      'mustard', 'sarson', 'rai', 'सरसों', 'राई', 'मोहरी'
    ],
    patterns: [
      /mustard/i, /sarson/i, /सरसों/i, /मोहरी/i
    ],
    answers: {
      en: 'Mustard MSP is ₹5,650 per quintal (up to ₹5,950 for high-grade bold seed). Quality requirements: Moisture must not exceed 8%, oil content should be at least 38%, and admixture/taramira seeds capped under 2%.',
      hi: 'सरसों का न्यूनतम समर्थन मूल्य ₹5,650 प्रति क्विंटल निर्धारित है। गुणवत्ता मानक: नमी अधिकतम 8% होनी चाहिए, तेल की मात्रा न्यूनतम 38% और अन्य बीजों का मिश्रण अधिकतम 2% ही मान्य है।',
      mr: 'मोहरीचा हमीभाव ₹५,६५० प्रति क्विंटल आहे. गुणवत्ता निकष: ओलावा कमाल ८% असावा, तेलाचे प्रमाण किमान ३८% असावे आणि इतर काडीकचरा २% पेक्षा कमी असावा.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Gram and Wheat?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'चना और गेहूँ का सरकारी MSP भाव क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'हरभरा आणि गव्हाचा शासकीय हमीभाव काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 11. GRAM / CHANA MSP
  {
    id: 'msp_gram_chana',
    category: 'msp',
    keywords: [
      'chana', 'gram', 'chane', 'चना', 'हरभरा', 'bengal gram'
    ],
    patterns: [
      /chana/i, /gram/i, /चना/i, /हरभरा/i
    ],
    answers: {
      en: 'Gram (Chana) MSP is ₹5,440 per quintal. FAQ specification: Moisture limit is 14%. Foreign matter must not exceed 1%, slightly damaged seeds allowed up to 3%, and insect infestation must be zero.',
      hi: 'चना (Gram) का न्यूनतम समर्थन मूल्य ₹5,440 प्रति क्विंटल है। FAQ मानक: नमी अधिकतम 14% होनी चाहिए। कचरा 1% से कम, मामूली क्षतिग्रस्त दाने अधिकतम 3% और कीट/घुन की मात्रा शून्य होनी चाहिए।',
      mr: 'हरभऱ्याचा (चना) हमीभाव ₹५,४४० प्रति क्विंटल आहे. खरेदी निकष: ओलावा कमाल १४% असावा. काडीकचरा १% पेक्षा कमी, किडलेले किंवा डागी दाणे ३% पेक्षा कमी असावेत.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Soybean and Tur?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'सोयाबीन और तुअर का सरकारी MSP भाव क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'सोयाबीन आणि तुरीचा शासकीय हमीभाव काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 12. COTTON MSP
  {
    id: 'msp_cotton',
    category: 'msp',
    keywords: [
      'cotton', 'kapas', 'kapaas', 'कपास', 'कापूस', 'ruii'
    ],
    patterns: [
      /cotton/i, /kapas/i, /कपास/i, /कापूस/i
    ],
    answers: {
      en: 'Cotton MSP: Medium Staple is ₹7,121 per quintal and Long Staple is ₹7,521 per quintal. Moisture must be between 8% and 12%. Moisture above 12% is subject to discount deductions under Cotton Corporation of India (CCI) norms.',
      hi: 'कपास का समर्थन मूल्य: मध्यम रेशा ₹7,121 प्रति क्विंटल तथा लंबा रेशा ₹7,521 प्रति क्विंटल है। नमी 8% से 12% के बीच होनी चाहिए। 12% से अधिक नमी होने पर CCI नियमों के तहत कटौती लागू होती है।',
      mr: 'कापसाचा हमीभाव: मध्यम लांबीचा कापूस ₹७,१२१ प्रति क्विंटल व लांब धाग्याचा कापूस ₹७,५२१ प्रति क्विंटल आहे. ओलावा ८% ते १२% असावा. १२% पेक्षा जास्त ओलावा असल्यास CCI नियमांनुसार कपात होते.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture deduction formula?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'नमी की अधिकता पर कटौती का फॉर्मूला क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'ओलावा जास्त असल्यास वजनात कपात कशी होते?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 13. DOCUMENTS REQUIRED
  {
    id: 'documents_required',
    category: 'documents',
    keywords: [
      'document', 'documents', 'paper', 'papers', 'dastavej', 'kagadpatre', 'aadhaar', 'passbook', '7/12',
      'दस्तावेज', 'कागजात', 'आधार', 'पासबुक', 'खतौनी',
      'कागदपत्रे', 'कागद', '७/१२', 'आधार कार्ड', 'बँक पासबुक'
    ],
    patterns: [
      /document/i, /paper/i, /dastavej/i, /दस्तावेज/i, /कागद/i, /कागदपत्रे/i, /7\/12/i, /khatauni/i
    ],
    answers: {
      en: 'Mandatory documents for mandi procurement:\n1. Aadhaar Card copy (linked to mobile).\n2. Bank Passbook copy or cancelled cheque (Aadhaar/NPCI DBT enabled).\n3. Land Record verification (7/12 extract or Khatauni / Girdawari).\n4. MandiMitra Digital Entry QR Pass (downloaded from app after slot booking).\n5. Crop Sowing Certificate (if applicable in your state).',
      hi: 'मंडी में खरीद हेतु अनिवार्य दस्तावेज:\n1. आधार कार्ड की प्रति (मोबाइल लिंक युक्त)।\n2. बैंक पासबुक या कैंसिल चेक (NPCI/DBT सक्रिय)।\n3. भूमि अभिलेख (7/12 नकल, खतौनी या गिरदावरी)।\n4. मंडीमित्र डिजिटल एंट्री पास (क्यूआर कोड)।\n5. फसल बुवाई का स्व-प्रमाणपत्र या ई-उपार्जन रसीद।',
      mr: 'खरेदी केंद्रावर विक्रीसाठी लागणारी अनिवार्य कागदपत्रे:\n१. आधार कार्ड प्रत (मोबाईल लिंक असलेले).\n२. बँक पासबुक प्रत (NPCI / DBT लिंक खाते).\n३. चालू वर्षाचा ७/१२ उतारा आणि ८-अ उतारा.\n४. मंडीमित्र डिजिटल गेट पास (QR कोड).\n५. पीक पाहणी नोंद (ई-पीक पाहणी प्रत).'
    },
    followUpQuestions: {
      en: [
        'How does DBT payment transfer work?',
        'What if my bank account is not linked with Aadhaar?',
        'What is the maximum moisture limit for grains?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'यदि बैंक खाता आधार से लिंक न हो तो क्या करें?',
        'फसल में नमी (Moisture) की अधिकतम सीमा क्या है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'बँक खाते आधारशी लिंक नसल्यास काय करावे?',
        'धान्यामध्ये ओलावा (Moisture) किती टक्के चालतो?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 14. 7/12 AND LAND RECORD
  {
    id: 'land_record_712',
    category: 'documents',
    keywords: [
      '7/12', '7 12', 'khatauni', 'satbara', 'land record', 'girdawari', 'khasra',
      '७/१२', 'सातबारा', 'खतौनी', 'खसरा', 'गिरदावरी', 'जमीन नोंद'
    ],
    patterns: [
      /7\/12/i, /satbara/i, /khatauni/i, /khasra/i, /सातबारा/i, /खतौनी/i, /७\/१२/i
    ],
    answers: {
      en: 'The 7/12 extract (Maharashtra) or Khatauni (UP/MP/Haryana) verifies your land ownership and official crop sowing area. Government procurement caps purchases according to your certified crop acreage (e.g. max 25-30 quintals/hectare for wheat). Make sure your latest season crop is recorded in e-Pik Pahani / Girdawari.',
      hi: '7/12 नकल या खतौनी आपके भूमि स्वामित्व और बोई गई फसल के रकबे का प्रमाण है। सरकारी खरीद आपके प्रमाणित रकबे के अनुसार ही की जाती है (जैसे गेहूँ हेतु अधिकतम 25-30 क्विंटल प्रति हेक्टेयर)। सुनिश्चित करें कि आपकी चालू फसल ई-गिरदावरी पोर्टल पर दर्ज है।',
      mr: '७/१२ उतारा आणि ई-पीक पाहणी ही तुमच्या जमिनीची मालकी व पिकाखालील क्षेत्राची खात्री करते. सरकारी हमीभाव खरेदी क्षेत्राच्या प्रमाणानुसारच केली जाते (उदा. गव्हासाठी २५-३० क्विंटल प्रति हेक्टर). ७/१२ वर चालू हंगामातील पिकाची नोंद असणे आवश्यक आहे.'
    },
    followUpQuestions: {
      en: [
        'What other documents are required at the mandi?',
        'How does DBT payment transfer work?',
        'What is the MSP rate for Wheat and Paddy?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'मंडी में और कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'खरेदी केंद्रावर इतर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'गहू आणि भाताचा शासकीय हमीभाव (MSP) काय आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 15. MOISTURE TESTING & LIMITS
  {
    id: 'quality_moisture_testing',
    category: 'quality',
    keywords: [
      'moisture', 'humidity', 'water', 'wet', 'quality', 'faq', 'testing',
      'नमी', 'गीला', 'ओलावा', 'मॉइस्चर', 'जाँच', 'क्वालिटी', 'गुणवत्ता'
    ],
    patterns: [
      /moisture/i, /नमी/i, /ओलावा/i, /humidity/i, /quality/i, /गुणवत्ता/i
    ],
    answers: {
      en: 'Moisture Testing Norms:\n• Wheat: Max 12%\n• Paddy: Max 17%\n• Soybean: Max 12%\n• Mustard: Max 8%\n• Gram: Max 14%\nMoisture is tested using digital moisture meters by taking a random 500g sample from 3 different bags. If moisture is slightly higher (up to 2% over limit), a proportionate weight cut is applied. Above that, you will be asked to dry the produce.',
      hi: 'फसल नमी (Moisture) मानक:\n• गेहूँ: अधिकतम 12%\n• धान: अधिकतम 17%\n• सोयाबीन: अधिकतम 12%\n• सरसों: अधिकतम 8%\n• चना: अधिकतम 14%\nडिजिटल मॉइस्चर मीटर द्वारा 3 अलग-अलग बोरियों से 500 ग्राम का नमूना लेकर जाँच की जाती है। 2% तक अधिक नमी होने पर आनुपातिक वजन कटौती होती है, इससे अधिक होने पर धूप में सुखाने की सलाह दी जाती है।',
      mr: 'धान्यातील ओलावा (Moisture) निकष:\n• गहू: कमाल १२%\n• भात / धान: कमाल १७%\n• सोयाबीन: कमाल १२%\n• मोहरी: कमाल ८%\n• हरभरा: कमाल १४%\nडिजिटल मॉइश्चर मीटरद्वारे ५०० ग्रॅम नमुना तपासून ओलावा मोजला जातो. ओलावा २% जास्त असल्यास वजनात कपात केली जाते. त्याहून जास्त असल्यास माल उन्हात वाळवून आणावा लागतो.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture deduction formula?',
        'What if my grain is rejected? Can I appeal?',
        'How does DBT payment transfer work?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'नमी की अधिकता पर कटौती का फॉर्मूला क्या है?',
        'यदि फसल रिजेक्ट हो जाए तो दोबारा अपील कैसे करें?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'ओलावा जास्त असल्यास वजनात कपात कशी होते?',
        'माल नाकारल्यास फेरतपासणीची अपील कशी करावी?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 16. MOISTURE DEDUCTION FORMULA
  {
    id: 'moisture_deduction_formula',
    category: 'quality',
    keywords: [
      'deduction', 'formula', 'cut', 'penalty', 'discount',
      'कटौती', 'फॉर्मूला', 'वजन कम', 'कपात', 'नियम'
    ],
    patterns: [
      /deduction/i, /formula/i, /कटौती/i, /कपात/i, /discount/i
    ],
    answers: {
      en: 'Moisture Deduction Formula: If your crop exceeds standard moisture by up to 2% (e.g. Wheat at 13% vs standard 12%), a deduction of 0.50 kg per quintal is made for every 0.5% excess moisture. Example: On 100 quintals of 13% moisture wheat, 1.0 quintal is deducted as moisture loss, and payment is cleared for 99 quintals at full MSP.',
      hi: 'नमी कटौती फॉर्मूला: मानक से 2% अधिक नमी तक (जैसे गेहूँ में 12% की जगह 13%), प्रति 0.5% अतिरिक्त नमी पर 0.50 किलोग्राम प्रति क्विंटल वजन की कटौती होती है। उदाहरण: 100 क्विंटल 13% नमी वाले गेहूँ पर 1 क्विंटल की कटौती होगी और 99 क्विंटल का पूरा MSP भुगतान मिलेगा।',
      mr: 'ओलावा कपात नियम: मानकापेक्षा २% पर्यंत जास्त ओलावा असल्यास (उदा. गव्हात १२% ऐवजी १३%), दर ०.५% वाढीव ओलाव्यासाठी ०.५० किलो प्रति क्विंटल कपात होते. उदाहरण: १०० क्विंटल मालात १३% ओलावा असल्यास १ क्विंटल कपात होऊन ९९ क्विंटलचा पूर्ण हमीभाव मिळतो.'
    },
    followUpQuestions: {
      en: [
        'What is gross weight and tare weight?',
        'How does DBT payment transfer work?',
        'What is the MSP rate for Wheat and Paddy?',
        'What documents are required at the mandi?'
      ],
      hi: [
        'सकल वजन (Gross) और खाली वजन (Tare) क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?'
      ],
      mr: [
        'वाहनाचे एकूण वजन आणि रिकामे वजन कसे काढतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'गहू आणि भाताचा शासकीय हमीभाव (MSP) काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?'
      ]
    }
  },

  // 17. WEIGHBRIDGE PROCESS
  {
    id: 'weighbridge_process',
    category: 'weighbridge',
    keywords: [
      'weighbridge', 'weighing', 'gross weight', 'tare weight', 'kanta', 'vajan',
      'कांटा', 'तौल', 'वजन', 'सकल वजन', 'खाली वजन', 'काटा'
    ],
    patterns: [
      /weighbridge/i, /weigh/i, /gross/i, /tare/i, /कांटा/i, /काटा/i, /वजन/i
    ],
    answers: {
      en: 'Electronic Weighbridge Process:\n1. Gross Weighment: Loaded truck is weighed on the computerized platform scale.\n2. Unloading: Grain is tipped at the assigned procurement bay.\n3. Tare Weighment: Empty truck returns to the weighbridge to record empty tare weight.\n4. Net Weight Slip: Net Produce = Gross - Tare. A digitally signed weight slip is printed and synced to your MandiMitra ledger.',
      hi: 'कंप्यूटरीकृत तौल कांटा प्रक्रिया:\n1. सकल तौल (Gross): भरी हुई गाड़ी का तौल कांटे पर वजन होता है।\n2. अनलोडिंग: अनाज को निर्धारित यार्ड शेड में खाली किया जाता है।\n3. खाली गाड़ी तौल (Tare): खाली गाड़ी का दोबारा वजन किया जाता है।\n4. शुद्ध वजन पर्ची: शुद्ध फसल वजन = सकल - खाली। डिजिटल हस्ताक्षरित पर्ची मिलती है और तुरंत ऐप में दर्ज हो जाती है।',
      mr: 'इलेक्ट्रॉनिक वजन काटा प्रक्रिया:\n१. भरलेले वजन (Gross): मालाने भरलेल्या वाहनाचे वजन केले जाते.\n२. अनलोडिंग: धान्य शेडमध्ये रिकामे केले जाते.\n३. रिकामे वजन (Tare): रिकाम्या वाहनाचे पुन्हा वजन केले जाते.\n४. निव्वळ वजन पावती: निव्वळ माल = एकूण वजन - रिकामे वजन. ही पावती तात्काळ ॲपमधील खात्यात जमा होते.'
    },
    followUpQuestions: {
      en: [
        'How does DBT payment transfer work?',
        'What if I suspect a weighing error?',
        'What is the moisture deduction formula?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'यदि तौल में गड़बड़ी का संदेह हो तो क्या करें?',
        'नमी की अधिकता पर कटौती का फॉर्मूला क्या है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'वजनात शंका असल्यास फेरवजन कसे करावे?',
        'ओलावा जास्त असल्यास वजनात कपात कशी होते?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 18. PAYMENT & DBT TIMELINE
  {
    id: 'payments_dbt',
    category: 'payments',
    keywords: [
      'payment', 'money', 'dbt', 'bank transfer', 'paisa', 'paise', 'pfms', 'account',
      'भुगतान', 'पैसा', 'पैसे', 'खाता', 'डीबीटी', 'बैंक'
    ],
    patterns: [
      /payment/i, /dbt/i, /bank.*transfer/i, /pfms/i, /पैसे/i, /भुगतान/i, /पैसा/i, /खाता/i
    ],
    answers: {
      en: 'DBT Payment Timeline: Once the digital weighment slip is generated, payment is processed via Public Financial Management System (PFMS) directly into your Aadhaar-linked bank account within 48 to 72 hours. You can view payment status and UTR transaction numbers under the "Payments" tab in MandiMitra.',
      hi: 'डीबीटी (DBT) भुगतान समय सीमा: तौल पर्ची बनने के बाद 48 से 72 घंटे के भीतर PFMS प्रणाली द्वारा सीधे आपके आधार-लिंक बैंक खाते में सरकारी MSP राशि जमा हो जाती है। आप मंडीमित्र के "Payments" टैब में यूटीआर (UTR) नंबर और स्थिति देख सकते हैं।',
      mr: 'DBT बँक पेमेंट कालावधी: वजन पावती तयार झाल्यावर ४८ ते ७२ तासांच्या आत PFMS द्वारे थेट तुमच्या आधार लिंक बँक खात्यात पैसे जमा होतात. तुम्ही मंडीमित्र ॲपमधील "Payments" विभागात व्यवहार क्रमांक (UTR) व स्थिती पाहू शकता.'
    },
    followUpQuestions: {
      en: [
        'What if my payment is delayed or failed?',
        'What documents are required at the mandi?',
        'How to download my payment receipt?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'यदि भुगतान में देरी हो या फेल हो जाए तो क्या करें?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'भुगतान रसीद कैसे डाउनलोड करें?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'पैसे जमा होण्यास उशीर झाल्यास काय करावे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'पेमेंट पावती कशी डाऊनलोड करावी?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 19. PAYMENT FAILURE & AADHAAR NPCI LINKING
  {
    id: 'payment_failure_troubleshoot',
    category: 'payments',
    keywords: [
      'payment failed', 'delayed', 'no money', 'npci', 'aadhaar link', 'ifsc',
      'भुगतान नहीं आया', 'फेल', 'देरी', 'आधार लिंक', 'एनपीसीआई',
      'पैसे आले नाहीत', 'पेमेंट अडकले', 'आधार लिंक नाही'
    ],
    patterns: [
      /payment.*fail/i, /delayed/i, /npci/i, /aadhaar.*link/i, /पैसे.*नाहीत/i, /भुगतान.*फेल/i
    ],
    answers: {
      en: 'Payment Delay Troubleshooting:\n1. Verify NPCI Aadhaar Mapping: Ensure your bank account has active DBT mapping.\n2. Check IFSC & Account Number: Verify bank details under your Farmer Profile.\n3. PFMS Rejection Reason: Check the MandiMitra Payments screen for specific error codes.\n4. Call MandiMitra DBT Helpline at 1800-180-1551 for instant escalation.',
      hi: 'भुगतान में समस्या समाधान:\n1. NPCI आधार मैपिंग जांचें: बैंक जाकर पक्का करें कि खाता डीबीटी हेतु सक्रिय है।\n2. IFSC व खाता संख्या: अपनी प्रोफाइल में बैंक विवरण सही होने की पुष्टि करें।\n3. PFMS स्थिति: मंडीमित्र के पेमेंट्स सेक्शन में रिजेक्शन कारण देखें।\n4. सहायता हेतु मंडीमित्र किसान हेल्पलाइन 1800-180-1551 पर संपर्क करें।',
      mr: 'पेमेंट अडकल्यास उपाय:\n१. NPCI आधार मॅपिंग तपासा: बँक खात्याशी आधार DBT लिंक आहे की नाही याची खात्री करा.\n२. बँक खाते व IFSC कोड तपासा.\n३. PFMS स्थिती: मंडीमित्र ॲपमध्ये पेमेंट रिजेक्ट होण्याचे कारण तपासा.\n४. त्वरित मदतीसाठी १८००-१८०-१५५१ या हेल्पलाईनवर कॉल करा.'
    },
    followUpQuestions: {
      en: [
        'How does DBT payment transfer work?',
        'How do I edit my farmer profile details?',
        'What documents are required at the mandi?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'किसान प्रोफाइल विवरण कैसे बदलें?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'शेतकरी प्रोफाइल माहिती कशी बदलावी?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?'
      ]
    }
  },

  // 20. WAREHOUSE & e-NWR STORAGE
  {
    id: 'warehouse_godown_storage',
    category: 'storage',
    keywords: [
      'warehouse', 'godown', 'storage', 'enwr', 'wdra', 'rent', 'pledge', 'loan',
      'गोदाम', 'भंडारण', 'वेयरहाउस', 'किराया', 'कर्ज',
      'गोदाम', 'साठवणूक', 'भाडे', 'तारण कर्ज'
    ],
    patterns: [
      /warehouse/i, /godown/i, /storage/i, /enwr/i, /गोदाम/i, /भंडारण/i, /साठवणूक/i
    ],
    answers: {
      en: 'Warehouse & e-NWR Storage: Farmers can store grains in WDRA-accredited godowns at subsidized rates (approx. ₹3.50 to ₹5.00 per bag/month). You receive an electronic Negotiable Warehouse Receipt (e-NWR) on your mobile, against which banks provide pledge loans up to 70% of crop value at concessional 7% interest.',
      hi: 'वेयरहाउस व ई-एनडब्ल्यूआर (e-NWR) भंडारण: किसान सरकारी मान्यता प्राप्त गोदामों में रियायती दर (लगभग ₹3.50 से ₹5.00 प्रति बोरी प्रति माह) पर फसल सुरक्षित रख सकते हैं। इसके बदले मोबाइल पर ई-एनडब्ल्यूआर रसीद मिलती है, जिस पर बैंक फसल मूल्य का 70% तक तारण ऋण 7% ब्याज पर देते हैं।',
      mr: 'गोदाम साठवणूक व ई-एनडब्ल्यूआर (e-NWR): शेतकरी मान्यताप्राप्त गोदामांमध्ये सवलतीच्या दरात (अंदाजे ₹३.५० ते ₹५.०० प्रति पोते दरमहा) धान्य ठेवू शकतात. यावर इलेक्ट्रॉनिक पावती मिळते, ज्यावर बँका ७०% पर्यंत तारण कर्ज ७% व्याजदराने देतात.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Wheat and Soybean?',
        'How does DBT payment transfer work?',
        'What are the mandi operating hours?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'गेहूँ और सोयाबीन का सरकारी MSP भाव क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी खुलने और बंद होने का समय क्या है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'गहू आणि सोयाबीनचा शासकीय हमीभाव काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्राच्या कामकाजाची वेळ काय आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 21. PM-KISAN SCHEME
  {
    id: 'pm_kisan_scheme',
    category: 'schemes',
    keywords: [
      'pm kisan', 'pmkisan', 'samman nidhi', '6000', 'installment', 'kist',
      'पीएम किसान', 'सम्मान निधि', 'किस्त', '६०००', 'हप्ता'
    ],
    patterns: [
      /pm.*kisan/i, /samman.*nidhi/i, /पीएम.*किसान/i, /हप्ता/i, /किस्त/i
    ],
    answers: {
      en: 'PM-Kisan Samman Nidhi provides ₹6,000 annually in 3 equal installments of ₹2,000 directly into Aadhaar-seeded bank accounts. To ensure uninterrupted payments, complete your mandatory e-KYC via OTP on pmkisan.gov.in or biometric verification at any CSC centre.',
      hi: 'पीएम-किसान सम्मान निधि योजना के तहत किसानों को प्रतिवर्ष ₹6,000 की वित्तीय सहायता ₹2,000 की तीन किस्तों में सीधे बैंक खाते में दी जाती है। किस्तों के निर्बाध भुगतान हेतु pmkisan.gov.in पर ई-केवाईसी (e-KYC) और भू-सत्यापन अनिवार्य है।',
      mr: 'पीएम-किसान सन्मान निधी योजनेअंतर्गत शेतकऱ्यांना वर्षाला ₹६,००० तीन हप्त्यांत (प्रत्येकी ₹२,०००) थेट बँक खात्यात दिले जातात. यासाठी pmkisan.gov.in वर जाऊन ई-केवायसी (e-KYC) व बँक आधार सीडिंग पूर्ण असणे आवश्यक आहे.'
    },
    followUpQuestions: {
      en: [
        'How to apply for PM Fasal Bima crop insurance?',
        'What is the Kisan Credit Card (KCC) limit?',
        'How does DBT payment transfer work?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'प्रधानमंत्री फसल बीमा योजना का दावा कैसे करें?',
        'किसान क्रेडिट कार्ड (KCC) की सीमा क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'पंतप्रधान पीक विमा योजनेचा लाभ कसा घ्यावा?',
        'किसान क्रेडिट कार्ड (KCC) मर्यादा किती असते?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?'
      ]
    }
  },

  // 22. PM FASAL BIMA (PMFBY) CROP INSURANCE
  {
    id: 'pmfby_crop_insurance',
    category: 'schemes',
    keywords: [
      'fasal bima', 'insurance', 'pmfby', 'crop loss', 'damage', 'claim',
      'फसल बीमा', 'बीमा क्लेम', 'नुकसान', 'मुआवजा', 'पीक विमा', 'नुकसान भरपाई'
    ],
    patterns: [
      /fasal.*bima/i, /pmfby/i, /insurance/i, /crop.*loss/i, /पीक.*विमा/i, /फसल.*बीमा/i
    ],
    answers: {
      en: 'PM Fasal Bima Yojana (PMFBY) covers crop losses from unseasonal rains, drought, and hailstorms. Important: In case of localized calamity, intimation must be submitted within 72 hours via the Crop Insurance App or by calling 1800-180-1551.',
      hi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY) बेमौसम बारिश, ओलावृष्टि और सूखे से फसल नुकसान की भरपाई करती है। महत्वपूर्ण: आपदा आने के 72 घंटे के भीतर "Crop Insurance App" या टोल-फ्री 1800-180-1551 पर सूचना देना अनिवार्य है।',
      mr: 'पंतप्रधान पीक विमा योजना (PMFBY) अवकाळी पाऊस, गारपीट व दुष्काळामुळे होणाऱ्या नुकसानीस संरक्षण देते. महत्त्वाचे: वैयक्तिक नुकसान झाल्यास ७२ तासांच्या आत "Crop Insurance App" वर तक्रार नोंदवणे बंधनकारक आहे.'
    },
    followUpQuestions: {
      en: [
        'What is the Kisan Credit Card (KCC) limit?',
        'What documents are required at the mandi?',
        'What is the MSP rate for Wheat and Paddy?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'किसान क्रेडिट कार्ड (KCC) की सीमा क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'किसान क्रेडिट कार्ड (KCC) मर्यादा किती असते?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 23. KISAN CREDIT CARD (KCC)
  {
    id: 'kcc_kisan_credit_card',
    category: 'schemes',
    keywords: [
      'kcc', 'kisan credit card', 'loan', 'crop loan', 'interest',
      'केसीसी', 'किसान क्रेडिट कार्ड', 'ऋण', 'कर्ज', 'पीक कर्ज'
    ],
    patterns: [
      /kcc/i, /kisan.*credit/i, /crop.*loan/i, /केसीसी/i, /पीक.*कर्ज/i
    ],
    answers: {
      en: 'Kisan Credit Card (KCC) provides short-term crop cultivation loans up to ₹3 lakh at 7% interest. If repaid on time, the government grants a 3% prompt repayment incentive, making the effective interest rate only 4% per annum.',
      hi: 'किसान क्रेडिट कार्ड (KCC) के तहत ₹3 लाख तक का फसली ऋण 7% ब्याज दर पर मिलता है। समय पर ऋण चुकाने पर सरकार 3% की अतिरिक्त छूट देती है, जिससे शुद्ध ब्याज केवल 4% प्रति वर्ष पड़ता है।',
      mr: 'किसान क्रेडिट कार्ड (KCC) अंतर्गत ₹३ लाखांपर्यंतचे पीक कर्ज ७% व्याजाने मिळते. वेळेवर परतफेड केल्यास ३% व्याज परतावा (Incentive) मिळून प्रत्यक्ष व्याजदर फक्त ४% पडतो.'
    },
    followUpQuestions: {
      en: [
        'What documents are required for KCC loan?',
        'How does DBT payment transfer work?',
        'What is the MSP rate for Wheat and Paddy?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'KCC ऋण के लिए कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'KCC कर्जासाठी कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 24. e-NAM TRADING
  {
    id: 'enam_trading',
    category: 'trading',
    keywords: [
      'enam', 'e-nam', 'national agriculture market', 'online auction', 'bidding',
      'ई नाम', 'ई-नाम', 'ऑनलाइन बोली', 'लिलाव'
    ],
    patterns: [
      /enam/i, /e-nam/i, /online.*auction/i, /ई.*नाम/i, /लिलाव/i
    ],
    answers: {
      en: 'e-NAM (National Agriculture Market) connects 1,300+ mandis across India for transparent electronic bidding. Farmers can upload crop assaying certificates and receive competitive bids from buyers nationwide with zero intermediary commissions.',
      hi: 'ई-नाम (e-NAM) भारत की 1,300 से अधिक मंडियों को ऑनलाइन जोड़ता है। किसान अपनी फसल की गुणवत्ता जांच रिपोर्ट अपलोड करके देशभर के खरीदारों से प्रतिस्पर्धी ऑनलाइन बोली प्राप्त कर सकते हैं।',
      mr: 'ई-नाम (e-NAM) पोर्टल देशातील १,३०० हून अधिक बाजार समित्यांना जोडते. शेतकरी मालाची गुणवत्ता तपासणी करून देशभरातील खरेदीदारांकडून थेट बोली मिळवू शकतात.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Wheat and Paddy?',
        'How does DBT payment transfer work?',
        'What documents are required at the mandi?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 25. OPERATOR & QUEUE ADVANCEMENT
  {
    id: 'operator_queue_workflow',
    category: 'operator',
    keywords: [
      'operator', 'advance queue', 'counter', 'platform', 'weighing status',
      'ऑपरेटर', 'कतार आगे बढ़ाना', 'काउंटर', 'वजन स्थिती'
    ],
    patterns: [
      /operator/i, /advance.*queue/i, /counter/i, /ऑपरेटर/i
    ],
    answers: {
      en: 'Operator Workflow: Operators use the Operator Dashboard to call tokens sequentially. Token stages advance through: Waiting -> Quality Check -> Weighing -> Done. Advance status directly by clicking the action button on the Queue Desk.',
      hi: 'ऑपरेटर कार्यप्रणाली: ऑपरेटर अपने डैशबोर्ड से टोकन को क्रमानुसार कॉल करते हैं। टोकन चरण: प्रतीक्षा (Waiting) -> गुणवत्ता जांच (Quality) -> तौल (Weighing) -> पूर्ण (Done) के क्रम में आगे बढ़ता है।',
      mr: 'ऑपरेटर कामकाज: ऑपरेटर त्यांच्या डॅशबोर्डवरून टोकन एकामागून एक बोलावतात. टोकन टप्पे: प्रतीक्षा -> गुणवत्ता तपासणी -> वजन -> पूर्ण या क्रमाने पुढे नेले जातात.'
    },
    followUpQuestions: {
      en: [
        'How do I create a new procurement slot?',
        'How to remove or add a procurement centre?',
        'Where is my active token in the queue?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'नया खरीद स्लॉट कैसे बनाएं?',
        'खरीद केंद्र को कैसे हटाएं या जोड़ें?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'नवीन स्लॉट कसा तयार करावा?',
        'खरेदी केंद्र कसे जोडावे किंवा काढावे?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 26. BROKER & BUYER ORDERS
  {
    id: 'broker_buyer_trading',
    category: 'trading',
    keywords: [
      'broker', 'buyer', 'order', 'procurement order', 'stockist', 'contract',
      'दलाल', 'व्यापारी', 'खरीदार', 'ऑर्डर', 'खरेदीदार', 'दलाल नोंद'
    ],
    patterns: [
      /broker/i, /buyer/i, /order/i, /दलाल/i, /व्यापारी/i, /खरेदीदार/i
    ],
    answers: {
      en: 'Interconnected Trading Desk: Brokers and Institutional Buyers create procurement contracts under the Broker/Buyer desks. Orders specify crop, quantity in quintals, price rate, and mandi location. These orders synchronize live across Farmer and Stockist portals.',
      hi: 'व्यापार नेटवर्क: ब्रोकर और अधिकृत खरीदार अपने पोर्टल से खरीद अनुबंध (Orders) दर्ज करते हैं। इसमें फसल, क्विंटल मात्रा, दर और मंडी का नाम शामिल होता है। यह ऑर्डर किसान और स्टॉकिस्ट पोर्टल पर तुरंत सिंक हो जाता है।',
      mr: 'व्यापार डेस्क: ब्रोकर आणि व्यापारी त्यांच्या पोर्टलवरून खरेदी ऑर्डर्स नोंदवतात. यामध्ये माल, प्रमाण, दर आणि केंद्राचे नाव असते. या सर्व नोंदी शेतकरी आणि स्टॉकिस्ट डॅशबोर्डवर तात्काळ दिसतात.'
    },
    followUpQuestions: {
      en: [
        'What is the MSP rate for Wheat and Soybean?',
        'How does DBT payment transfer work?',
        'What are the storage charges in godown?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'गेहूँ और सोयाबीन का सरकारी MSP भाव क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'गोदाम में भंडारण का किराया क्या है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'गहू आणि सोयाबीनचा शासकीय हमीभाव काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'गोदामातील साठवणुकीचे भाडे किती आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 27. WEATHER & RAIN ALERTS
  {
    id: 'weather_rain_alert',
    category: 'weather',
    keywords: [
      'weather', 'rain', 'forecast', 'tarpaulin', 'shed', 'barish', 'paus',
      'मौसम', 'बारिश', 'वर्षा', 'तिरपाल', 'शेड', 'हवामान', 'पाऊस'
    ],
    patterns: [
      /weather/i, /rain/i, /forecast/i, /barish/i, /मौसम/i, /पाऊस/i, /हवामान/i
    ],
    answers: {
      en: 'Weather & Mandi Yard Advisory: During active harvest and procurement, covered shed platforms are prioritized. Always carry waterproof tarpaulin sheets (तिरपाल) when transporting grains to protect against sudden rainfall. High-humidity lots must be unloaded in covered bays only.',
      hi: 'मौसम व मंडी सुरक्षा सलाह: बारिश की संभावना होने पर कवर्ड यार्ड शेड को प्राथमिकता दी जाती है। उपज लाते समय अपनी ट्रॉली को वाटरप्रूफ तिरपाल से अच्छी तरह ढककर लाएँ ताकि भीगने से फसल खराब न हो।',
      mr: 'हवामान व शेतमाल सुरक्षा सल्ला: पावसाचा अंदाज असल्यास मालाचे संरक्षण करण्यासाठी ट्रॅक्टर-ट्रॉलीवर ताडपत्री बांधून आणावी. खरेदी केंद्रात शेड असणाऱ्या वजन काट्यांना प्राधान्य दिले जाते.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture limit for grains?',
        'What documents are required at the mandi?',
        'Where is my active token in the queue?',
        'How do I book a procurement slot?'
      ],
      hi: [
        'फसल में नमी (Moisture) की अधिकतम सीमा क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'खरीद स्लॉट कैसे बुक करें?'
      ],
      mr: [
        'धान्यामध्ये ओलावा (Moisture) किती टक्के चालतो?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?'
      ]
    }
  },

  // 28. BEST MANDI RECOMMENDATION
  {
    id: 'best_mandi_ai',
    category: 'centres',
    keywords: [
      'recommend', 'best mandi', 'which mandi', 'closest', 'least wait',
      'कौन सी मंडी', 'बेस्ट मंडी', 'सुझाव', 'उत्तम केंद्र', 'जवळचे केंद्र'
    ],
    patterns: [
      /best.*mandi/i, /recommend/i, /which.*mandi/i, /कौन.*मंडी/i, /कोणते.*केंद्र/i
    ],
    answers: {
      en: 'Smart Mandi Recommendation: MandiMitra calculates an AI fairness score balancing 3 factors: 1) Shortest queue wait time, 2) Driving distance, and 3) Available yard capacity. Check "AI Recommendation" in the menu for personalized top-ranked centres.',
      hi: 'स्मार्ट मंडी सुझाव: मंडीमित्र 3 मुख्य बिंदुओं के आधार पर सर्वश्रेष्ठ केंद्र चुनता है: 1) सबसे कम प्रतीक्षा समय, 2) दूरी, और 3) यार्ड में खुली क्षमता। मेनू में "AI Recommendation" कार्ड देखें।',
      mr: 'स्मार्ट खरेदी केंद्र शिफारस: मंडीमित्र ३ गोष्टी तपासून उत्तम केंद्र निवडतो: १) सर्वात कमी प्रतीक्षा वेळ, २) अंतर, आणि ३) केंद्राची क्षमता. मेनूमधील "AI Recommendation" पर्याय पहा.'
    },
    followUpQuestions: {
      en: [
        'Where is my active token in the queue?',
        'How do I book a procurement slot?',
        'What documents are required at the mandi?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'खरीद स्लॉट कैसे बुक करें?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?'
      ]
    }
  },

  // 29. MAIZE / MAKKA MSP & QUALITY
  {
    id: 'msp_maize_makka',
    category: 'msp',
    keywords: [
      'maize', 'makka', 'corn', 'मक्का', 'मकई', 'मका',
      'maize msp', 'makka rate', 'मक्का भाव', 'मका हमीभाव'
    ],
    patterns: [
      /maize/i, /makka/i, /मक्का/i, /मका/i, /corn/i
    ],
    answers: {
      en: 'Government MSP for Maize (Makka) is fixed at ₹2,225 per quintal. Permissible moisture limit is 14%. Broken or discolored grains must not exceed 4%, and foreign matter must be under 1.5%.',
      hi: 'मक्का का सरकारी न्यूनतम समर्थन मूल्य (MSP) ₹2,225 प्रति क्विंटल तय है। स्वीकार्य नमी की सीमा अधिकतम 14% है। टूटे या बदरंग दाने 4% से अधिक नहीं होने चाहिए और अकार्बनिक विजातीय तत्व 1.5% से कम होने चाहिए।',
      mr: 'मका या पिकाचा शासकीय हमीभाव (MSP) ₹२,२२५ प्रति क्विंटल निश्चित करण्यात आला आहे. ओलाव्याची कमाल मर्यादा १४% आहे. फुटलेले किंवा डागी दाणे ४% पेक्षा जास्त नसावेत आणि कचरा १.५% च्या आत असावा.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture limit for wheat and soybean?',
        'How does DBT payment transfer work?',
        'What documents are required at the mandi?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'गेहूँ और सोयाबीन में नमी की सीमा क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'गहू आणि सोयाबीनसाठी ओलावा मर्यादा काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 30. PULSES: ARHAR / TUR & URAD
  {
    id: 'msp_pulses_tur_urad',
    category: 'msp',
    keywords: [
      'tur', 'arhar', 'urad', 'dal', 'pulses', 'तुअर', 'अरहर', 'उड़द', 'दाल', 'तूर', 'उडीद', 'डाळ',
      'tur msp', 'arhar rate', 'तूर हमीभाव', 'अरहर भाव'
    ],
    patterns: [
      /tur/i, /arhar/i, /urad/i, /तुअर/i, /अरहर/i, /उड़द/i, /तूर/i, /उडीद/i
    ],
    answers: {
      en: 'Government MSP for Arhar / Tur is ₹7,550 per quintal and Urad is ₹7,400 per quintal. Procurement is executed via NAFED and NCCF. Moisture content must not exceed 12%.',
      hi: 'अरहर (तुअर) का सरकारी समर्थन मूल्य ₹7,550 प्रति क्विंटल तथा उड़द का ₹7,400 प्रति क्विंटल है। खरीद नाफेड (NAFED) और एनसीसीएफ द्वारा की जाती है। अधिकतम नमी 12% मान्य है।',
      mr: 'तूर (अरहर) चा शासकीय हमीभाव ₹७,५५० प्रति क्विंटल आणि उडदाचा भाव ₹७,४०० प्रति क्विंटल आहे. खरेदी नाफेड (NAFED) आणि एनसीसीएफ मार्फत केली जाते. ओलाव्याची मर्यादा १२% आहे.'
    },
    followUpQuestions: {
      en: [
        'What documents are required for NAFED registration?',
        'What is the MSP rate for Soyabean and Mustard?',
        'How do I book a procurement slot?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'नाफेड खरीद हेतु कौन से दस्तावेज आवश्यक हैं?',
        'सोयाबीन और सरसों का समर्थन मूल्य क्या है?',
        'खरीद स्लॉट कैसे बुक करें?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'नाफेड नोंदणीसाठी कोणती कागदपत्रे लागतात?',
        'सोयाबीन आणि मोहरीचा हमीभाव काय आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 31. e-NWR WAREHOUSE PLEDGE LOANS
  {
    id: 'enwr_pledge_loans',
    category: 'finance',
    keywords: [
      'enwr', 'pledge', 'pledge loan', 'warehouse loan', 'godown loan',
      'गिरवी ऋण', 'वेयरहाउस लोन', 'गोदाम लोन', 'प्लेज लोन',
      'तारण कर्ज', 'गोदाम कर्ज', 'पावतीवर कर्ज'
    ],
    patterns: [
      /enwr/i, /pledge.*loan/i, /warehouse.*loan/i, /गिरवी/i, /तारण.*कर्ज/i, /गोदाम.*कर्ज/i
    ],
    answers: {
      en: 'Under the e-NWR (electronic Negotiable Warehouse Receipt) scheme, farmers storing produce in WDRA-registered godowns can obtain pledge loans up to 75% of produce value from public banks at an attractive 7% interest rate with 3% prompt repayment rebate.',
      hi: 'ई-एनडब्ल्यूआर योजना के तहत डब्ल्यूडीआरए पंजीकृत गोदामों में फसल रखने वाले किसान फसल मूल्य के 75% तक बैंक ऋण (प्लेज लोन) प्राप्त कर सकते हैं। इस पर सामान्यतः 7% ब्याज दर लगती है तथा समय पर भुगतान करने पर 3% की अतिरिक्त छूट मिलती है।',
      mr: 'e-NWR योजनेअंतर्गत WDRA नोंदणीकृत गोदामात माल ठेवणाऱ्या शेतकऱ्यांना मालाच्या मूल्याच्या ७५% पर्यंत बँक तारण कर्ज (Pledge Loan) मिळते. यावर ७% सवलतीचे व्याज असून नियमित परतफेडीवर ३% अनुदान मिळते.'
    },
    followUpQuestions: {
      en: [
        'How do I deposit crops in a WDRA godown?',
        'What is the KCC interest subvention rate?',
        'How does DBT payment transfer work?',
        'What documents are required at the mandi?'
      ],
      hi: [
        'WDRA पंजीकृत गोदाम में फसल कैसे जमा करें?',
        'किसान क्रेडिट कार्ड (KCC) ब्याज दर क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?'
      ],
      mr: [
        'WDRA गोदामामध्ये माल कसा साठवावा?',
        'किसान क्रेडिट कार्ड (KCC) व्याजदर किती आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?'
      ]
    }
  },

  // 32. COLD STORAGE & PERISHABLES
  {
    id: 'cold_storage_perishables',
    category: 'storage',
    keywords: [
      'cold storage', 'potato', 'onion', 'vegetable', 'perishable', 'storage charges',
      'कोल्ड स्टोरेज', 'शीतगृह', 'आलू', 'प्याज', 'सब्जी', 'कोल्ड स्टोरेज किराया',
      'शीतगृह', 'कोल्ड स्टोरेज', 'बटाटा', 'कांदा', 'भाजीपाला'
    ],
    patterns: [
      /cold.*storage/i, /शीतगृह/i, /कोल्ड.*स्टोरेज/i, /perishable/i
    ],
    answers: {
      en: 'Cold storage facilities for potatoes, onions, and horticultural crops maintain temperature between 2°C - 8°C with 85-90% humidity. Monthly rental ranges between ₹28-₹45 per bag. Government MIDH scheme provides 35% - 50% subsidy for building farmer-owned cold rooms.',
      hi: 'आलू, प्याज और फल-सब्जियों हेतु कोल्ड स्टोरेज में 2°C से 8°C तापमान और 85-90% आर्द्रता बनाए रखी जाती है। मासिक किराया लगभग ₹28 से ₹45 प्रति बोरी होता है। सरकार के एमआईडीएच (MIDH) मिशन के तहत कोल्ड रूम स्थापना पर 35% से 50% तक सब्सिडी उपलब्ध है।',
      mr: 'बटाटा, कांदा आणि फळे-भाजीपाल्यासाठी शीतगृहात २ अंश ते ८ अंश सेल्सिअस तापमान व ८५-९०% आर्द्रता राखली जाते. मासिक भाडे अंदाजे ₹२८ ते ₹४५ प्रति पोते असते. MIDH योजनेअंतर्गत स्वतःचे शीतगृह उभारण्यासाठी ३५% ते ५०% शासकीय अनुदान मिळते.'
    },
    followUpQuestions: {
      en: [
        'How do I deposit crops in a WDRA godown?',
        'What are the warehouse pledge loan benefits?',
        'How do I book a procurement slot?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'WDRA पंजीकृत गोदाम में फसल कैसे जमा करें?',
        'गोदाम पावती पर बैंक लोन कैसे लें?',
        'खरीद स्लॉट कैसे बुक करें?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'WDRA गोदामामध्ये माल कसा साठवावा?',
        'गोदाम पावतीवर तारण कर्ज कसे मिळते?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?'
      ]
    }
  },

  // 33. SOIL HEALTH CARD & TESTING
  {
    id: 'soil_health_card',
    category: 'farming',
    keywords: [
      'soil', 'soil health', 'soil test', 'fertilizer', 'testing lab', 'npk',
      'मृदा स्वास्थ्य', 'मिट्टी परीक्षण', 'मिट्टी जांच', 'उर्वरक', 'खाद',
      'माती परीक्षण', 'मृदा आरोग्य', 'खत', 'एनपीके', 'प्रयोगशाळा'
    ],
    patterns: [
      /soil.*health/i, /soil.*test/i, /मिट्टी.*परीक्षण/i, /माती.*परीक्षण/i, /मृदा/i
    ],
    answers: {
      en: 'The Soil Health Card scheme assesses 12 soil parameters including Nitrogen, Phosphorus, Potassium (NPK), Sulphur, Zinc, and pH balance. Soil samples are collected free of cost by the Agriculture Department every 3 years to provide customized crop fertilizer dosages.',
      hi: 'मृदा स्वास्थ्य कार्ड योजना के तहत मिट्टी के 12 मुख्य घटकों (नाइट्रोजन, फास्फोरस, पोटाश, सल्फर, जिंक और पीएच मान) की जाँच की जाती है। कृषि विभाग द्वारा प्रत्येक 3 वर्ष में निःशुल्क नमूने लेकर किसानों को सटीक खाद उपयोग की सिफारिश दी जाती है।',
      mr: 'मृदा आरोग्य पत्रिका योजनेअंतर्गत जमिनीतील १२ घटकांची (नायट्रोजन, फॉस्फरस, पोटॅश, सल्फर, जस्त आणि सामू/pH) मोफत तपासणी केली जाते. कृषी विभागामार्फत दर ३ वर्षांनी मातीचे नमुने घेऊन पिकांनुसार खतांचे योग्य प्रमाण सुचवले जाते.'
    },
    followUpQuestions: {
      en: [
        'How do I get subsidized fertilizer via PoS?',
        'What are organic farming certification steps?',
        'What is the PM-Kisan Samman Nidhi scheme?',
        'What is the PMFBY crop insurance procedure?'
      ],
      hi: [
        'पीओएस मशीन से सब्सिडी खाद कैसे प्राप्त करें?',
        'जैविक खेती प्रमाणन कैसे प्राप्त करें?',
        'पीएम-किसान सम्मान निधि योजना क्या है?',
        'पीएम फसल बीमा योजना (PMFBY) क्लेम कैसे करें?'
      ],
      mr: [
        'PoS मशिनद्वारे अनुदानीत खत कसे मिळवावे?',
        'सेंद्रिय शेतीचे प्रमाणपत्र कसे मिळवावे?',
        'पीएम-किसान सन्मान निधी योजना काय आहे?',
        'पंतप्रधान पीक विमा योजना (PMFBY) क्लेम कसा करावा?'
      ]
    }
  },

  // 34. FERTILIZER SUBSIDY & POS DBT
  {
    id: 'fertilizer_subsidy_dbt',
    category: 'farming',
    keywords: [
      'urea', 'dap', 'fertilizer', 'subsidy', 'pos', 'pac', 'society',
      'यूरिया', 'डीएपी', 'खाद', 'सब्सिडी', 'पीओएस', 'सोसायटी',
      'युरिया', 'डीएपी', 'खत', 'अनुदान', 'सोसायटी'
    ],
    patterns: [
      /urea/i, /dap/i, /fertilizer.*subsidy/i, /यूरिया/i, /डीएपी/i, /युरिया/i, /खत.*अनुदान/i
    ],
    answers: {
      en: 'Urea and DAP fertilizers are provided at heavily subsidized rates through Aadhaar authentication on PoS machines. A 45kg bag of Urea is capped at ₹266.50 and a 50kg bag of DAP at ₹1,350 across all primary cooperative societies and authorized retailers.',
      hi: 'यूरिया और डीएपी उर्वरक आधार प्रमाणीकरण युक्त पीओएस मशीनों के माध्यम से रियायती दरों पर दिए जाते हैं। 45 किलो यूरिया बोरी की नियंत्रित कीमत ₹266.50 और 50 किलो डीएपी की कीमत ₹1,350 निर्धारित है। किसान किसी भी अधिकृत केंद्र से बायोमेट्रिक देकर ले सकते हैं।',
      mr: 'युरिया आणि डीएपी खते आधार बायोमेट्रिक पडताळणीद्वारे PoS मशिनवरून अनुदानित दरात दिली जातात. ४५ किलो युरिया गोणीची किंमत ₹२६६.५० आणि ५० किलो डीएपी गोणीची किंमत ₹१,३५० निश्चित आहे. कोणत्याही सेवा सोसायटीतून आधार दाखवून खत घेता येते.'
    },
    followUpQuestions: {
      en: [
        'How to apply for Soil Health Card testing?',
        'What is the KCC Kisan Credit Card interest rate?',
        'What documents are required at the mandi?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'मृदा स्वास्थ्य कार्ड हेतु मिट्टी जांच कैसे करवाएं?',
        'किसान क्रेडिट कार्ड (KCC) ब्याज दर क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'माती परीक्षणासाठी नमुना कसा द्यावा?',
        'किसान क्रेडिट कार्ड (KCC) व्याजदर किती आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 35. ORGANIC FARMING & PKVY
  {
    id: 'organic_paramparagat',
    category: 'farming',
    keywords: [
      'organic', 'pkvy', 'natural farming', 'certification', 'bio',
      'जैविक खेती', 'प्राकृतिक खेती', 'परंपरागत कृषि', 'प्रमाणन',
      'सेंद्रिय शेती', 'नैसर्गिक शेती', 'प्रमाणपत्र', 'पीकेव्हीवाय'
    ],
    patterns: [
      /organic/i, /pkvy/i, /natural.*farming/i, /जैविक/i, /प्राकृतिक/i, /सेंद्रिय/i
    ],
    answers: {
      en: 'Under the Paramparagat Krishi Vikas Yojana (PKVY), farmer clusters receive financial assistance of ₹50,000 per hectare over 3 years for organic inputs, PGS-India certification, and market linkages. Certified organic grains fetch a 20-35% price premium over standard MSP.',
      hi: 'परंपरागत कृषि विकास योजना (PKVY) के अंतर्गत 3 वर्षों में ₹50,000 प्रति हेक्टेयर की वित्तीय सहायता जैविक खाद, पीजीएस-इंडिया प्रमाणीकरण और विपणन हेतु दी जाती है। प्रमाणित जैविक उत्पादों पर मंडियों में सामान्य एमएसपी से 20% से 35% तक अधिक प्रीमियम मूल्य प्राप्त होता है।',
      mr: 'परंपरागत कृषी विकास योजना (PKVY) अंतर्गत शेतकरी गटांना ३ वर्षांत प्रति हेक्टरी ₹५०,००० चे अनुदान सेंद्रिय खते, PGS-India प्रमाणपत्र आणि विक्री व्यवस्थेसाठी मिळते. सेंद्रिय शेतीमालाला बाजारात हमीभावापेक्षा २०% ते ३५% जास्त दर मिळतो.'
    },
    followUpQuestions: {
      en: [
        'How to apply for Soil Health Card testing?',
        'What is the PMFBY crop insurance procedure?',
        'How do I book a procurement slot?',
        'What is the MSP rate for Wheat and Paddy?'
      ],
      hi: [
        'मिट्टी जांच (Soil Health) कैसे करवाएं?',
        'फसल बीमा योजना (PMFBY) में क्लेम कैसे करें?',
        'खरीद स्लॉट कैसे बुक करें?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?'
      ],
      mr: [
        'माती परीक्षणासाठी नमुना कसा द्यावा?',
        'पीक विमा योजना (PMFBY) क्लेम कसा करावा?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?'
      ]
    }
  },

  // 36. TRANSPORT FREIGHT & VEHICLE CAPACITY
  {
    id: 'transport_freight_logistics',
    category: 'logistics',
    keywords: [
      'transport', 'freight', 'trolley', 'truck', 'pickup', 'carriage', 'tempo',
      'परिवहन', 'भाड़ा', 'ट्रॉली', 'ट्रक', 'पिकअप', 'किराया',
      'वाहतूक', 'भाडे', 'ट्रॉली', 'ट्रक', 'पिकअप', 'गाडी भाडे'
    ],
    patterns: [
      /transport/i, /freight/i, /भाड़ा/i, /भाडे/i, /carriage/i, /pickup/i, /ट्रॉली.*भाड़ा/i
    ],
    answers: {
      en: 'Standard agricultural transport rates: Tractor trolley (40-60 quintals) averages ₹35-₹50 per quintal within a 15km radius. Mini trucks (Bolero Maxi Truck / Tata 407, 25-35 quintals) charge ₹40-₹60 per quintal. Vehicles carrying registered mandi gate passes are toll-exempt.',
      hi: 'मानक कृषि परिवहन भाड़ा: 15 किमी के दायरे में ट्रैक्टर-ट्रॉली (40-60 क्विंटल क्षमता) का भाड़ा लगभग ₹35 से ₹50 प्रति क्विंटल होता है। छोटे ट्रक या पिकअप (25-35 क्विंटल) का भाड़ा ₹40 से ₹60 प्रति क्विंटल रहता है। मंडी टोकन पास वाले कृषि वाहनों को टोल टैक्स में छूट है।',
      mr: 'शेतीमाल वाहतुकीचे सर्वसाधारण दर: १५ किमी अंतरासाठी ट्रॅक्टर-ट्रॉलीचे (४०-६० क्विंटल) भाडे अंदाजे ₹३५ ते ₹५० प्रति क्विंटल असते. पिकअप किंवा मिनी ट्रकचे (२५-३५ क्विंटल) भाडे ₹४० ते ₹६० प्रति क्विंटल असते. मंडी टोकन पास असणाऱ्या वाहनांना टोल नाक्यावर सूट मिळते.'
    },
    followUpQuestions: {
      en: [
        'What are the vehicle capacities for booking slots?',
        'How do I check in at the weighbridge gate?',
        'Where is my active token in the queue?',
        'What documents are required at the mandi?'
      ],
      hi: [
        'स्लॉट बुकिंग के लिए वाहन क्षमता क्या है?',
        'कांटे के मुख्य गेट पर चेक-इन कैसे करें?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?'
      ],
      mr: [
        'स्लॉट बुक करताना वाहनांची क्षमता किती असावी?',
        'वजनकाटा गेटवर चेक-इन कसे करावे?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?'
      ]
    }
  },

  // 37. DISPUTE ARBITRATION & WEIGHMENT GRIEVANCES
  {
    id: 'mandi_dispute_arbitration',
    category: 'dispute',
    keywords: [
      'dispute', 'complaint', 'cheating', 'deduction', 'arbitration', 'grievance', 'secretary',
      'विवाद', 'शिकायत', 'कटौती', 'धोखा', 'सचिव', 'मध्यस्थता', 'तकरार',
      'तक्रार', 'वाद', 'कपात', 'सचिव', 'लवाद', 'न्याय'
    ],
    patterns: [
      /dispute/i, /complaint/i, /arbitration/i, /शिकायत/i, /तक्रार/i, /विवाद/i, /वाद/i
    ],
    answers: {
      en: 'In case of weighbridge discrepancy or unwarranted moisture deduction, report immediately to the Mandi Arbitration Committee or APMC Secretary before unloading. You have the statutory right to demand re-weighing on the secondary reference scale without penalty.',
      hi: 'तौल में अंतर या अनुचित नमी कटौती के मामले में फसल खाली करने से पहले तुरंत मंडी सचिव या मंडी मध्यस्थता समिति (Dispute Committee) से संपर्क करें। किसानों को द्वितीयक संदर्भ कांटे पर पुनः निःशुल्क वजन कराने का वैधानिक अधिकार प्राप्त है।',
      mr: 'वजनात तफावत किंवा अवाजवी ओलावा कपातीची तक्रार असल्यास माल खाली करण्यापूर्वी तात्काळ बाजार समिती सचिव किंवा लवाद समितीकडे संपर्क साधावा. दुसऱ्या वजन काट्यावर मालाचे फेरवजन करून घेण्याचा शेतकऱ्याला कायदेशीर अधिकार आहे.'
    },
    followUpQuestions: {
      en: [
        'How is electronic weighbridge gross and tare weight calculated?',
        'What is the moisture deduction formula?',
        'What documents are required at the mandi?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'कांटे पर सकल और खाली वजन कैसे निकाला जाता है?',
        'नमी कटौती का सही सरकारी सूत्र क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'वजनकाट्यावर वाहनाचे एकूण व रिकामे वजन कसे मोजतात?',
        'ओलावा कपातीचा सरकारी नियम काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 38. PACKAGING & JUTE BAG NORMS
  {
    id: 'gunny_bags_packaging',
    category: 'logistics',
    keywords: [
      'bag', 'jute', 'gunny', 'hdpe', 'stitching', 'tare allowance', 'packing',
      'बोरी', 'बारदाना', 'जूट', 'सिलाई', 'पैकिंग', 'कटोरी',
      'गोणी', 'बारदाना', 'जूट', 'शिलाई', 'पॅकिंग'
    ],
    patterns: [
      /bag/i, /gunny/i, /jute/i, /बोरी/i, /बारदाना/i, /गोणी/i, /packing/i
    ],
    answers: {
      en: 'Government procurement specifies standard 50kg capacity B-Twill Jute gunny bags (weight ~580 grams) or 50kg food-grade HDPE bags. A standard tare deduction of 580g - 1kg per bag is applied. Bags must have double-thread machine stitching or tight 14-cross manual stitches.',
      hi: 'सरकारी खरीद में मानक 50 किलोग्राम क्षमता वाली बी-ट्विल जूट की बोरियाँ (वजन ~580 ग्राम) या खाद्य-ग्रेड एचडीपीई बोरियाँ मान्य हैं। प्रति बोरी 580 ग्राम से 1 किलोग्राम की मानक बारदाना कटौती (Tare) की जाती है। बोरियों पर डबल सिलाई होना अनिवार्य है।',
      mr: 'शासकीय खरेदीसाठी ५० किलो क्षमतेची बी-ट्विल जूट बारदाना गोणी (वजन ~५८० ग्रॅम) किंवा HDPE गोणी चालते. बारदाण्याचे वजन प्रति गोणी ५८० ग्रॅम ते १ किलो वजा केले जाते. गोणीला दुहेरी शिलाई असणे आवश्यक आहे.'
    },
    followUpQuestions: {
      en: [
        'What is the moisture deduction formula?',
        'How does DBT payment transfer work?',
        'What documents are required at the mandi?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'नमी कटौती का सही सरकारी सूत्र क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'ओलावा कपातीचा सरकारी नियम काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 39. TOLL TAX EXEMPTION ON HIGHWAYS
  {
    id: 'toll_tax_exemption',
    category: 'logistics',
    keywords: [
      'toll', 'fastag', 'toll plaza', 'highway', 'tax exemption',
      'टोल', 'टैक्स', 'फास्टैग', 'टोल प्लाजा', 'टोल छूट',
      'टोल', 'फास्टॅग', 'टोल माफी', 'हायवे टोल'
    ],
    patterns: [
      /toll/i, /fastag/i, /टोल/i, /toll.*tax/i, /highway.*toll/i
    ],
    answers: {
      en: 'Under NHAI regulations and State APMC Directives, agricultural tractors carrying farm produce to designated mandis are exempted from highway toll tax. Present your MandiMitra Gate Pass / Token SMS at the toll plaza manual lane for free transit.',
      hi: 'एनएचएआई (NHAI) नियमों और राज्य कृषि विपणन बोर्ड के अनुसार मंडी में उपज ले जाने वाले कृषि ट्रैक्टर-ट्रॉलियों को राष्ट्रीय राजमार्गों पर टोल टैक्स से पूर्ण छूट प्राप्त है। टोल प्लाजा पर मैनुअल लेन में मंडीमित्र का डिजिटल गेट पास या टोकन एसएमएस दिखाएं।',
      mr: 'NHAI नियम आणि कृषी उत्पन्न बाजार समितीच्या नियमांनुसार शेतीमाल घेऊन जाणाऱ्या ट्रॅक्टर-ट्रॉलीला राष्ट्रीय महामार्गावरील टोलमधून पूर्ण सूट आहे. टोल नाक्याच्या मॅन्युअल लेनवर मंडीमित्रचा गेट पास किंवा टोकन मेसेज दाखवून विनामूल्य जाता येते.'
    },
    followUpQuestions: {
      en: [
        'What are the transport freight logistics rates?',
        'How do I check in at the weighbridge gate?',
        'Where is my active token in the queue?',
        'What documents are required at the mandi?'
      ],
      hi: [
        'कृषि उपज परिवहन के मानक भाड़ा दर क्या हैं?',
        'कांटे के मुख्य गेट पर चेक-इन कैसे करें?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?'
      ],
      mr: [
        'शेतीमाल वाहतुकीचे सर्वसाधारण दर काय आहेत?',
        'वजनकाटा गेटवर चेक-इन कसे करावे?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?'
      ]
    }
  },

  // 40. DRIP IRRIGATION SUBSIDY (PMKSY)
  {
    id: 'drip_irrigation_pmksy',
    category: 'schemes',
    keywords: [
      'drip', 'sprinkler', 'irrigation', 'pmksy', 'micro irrigation',
      'ड्रिप', 'स्प्रिंकलर', 'सिंचाई', 'टपक', 'फव्वारा',
      'ठिबक', 'तुषार', 'सिंचन', 'ठिबक सिंचन', 'अनुदान'
    ],
    patterns: [
      /drip/i, /sprinkler/i, /irrigation/i, /ड्रिप/i, /सिंचाई/i, /ठिबक/i, /तुषार/i
    ],
    answers: {
      en: 'Under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop), small and marginal farmers receive up to 80% subsidy (55% Central + 25% State) on Drip and Sprinkler irrigation systems. Applications are processed through the state DBT agriculture portal.',
      hi: 'प्रधानमंत्री कृषि सिंचाई योजना (PMKSY - हर खेत को पानी) के तहत लघु एवं सीमांत किसानों को ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई प्रणाली पर 80% तक सब्सिडी मिलती है। आवेदन राज्य कृषि डीबीटी पोर्टल पर 7/12 और आधार कार्ड के साथ किया जाता है।',
      mr: 'पंतप्रधान कृषी सिंचन योजना (PMKSY) अंतर्गत अल्प व अत्यल्प भूधारक शेतकऱ्यांना ठिबक व तुषार सिंचनासाठी ८०% पर्यंत (५५% केंद्र + २५% राज्य) शासकीय अनुदान मिळते. यासाठी महाडीबीटी पोर्टलवर ७/१२ व आधार कार्डासह अर्ज करता येतो.'
    },
    followUpQuestions: {
      en: [
        'What documents are required for agricultural subsidies?',
        'What is the KCC interest subvention rate?',
        'What is the PM-Kisan Samman Nidhi scheme?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'कृषि योजनाओं हेतु आवश्यक दस्तावेज क्या हैं?',
        'किसान क्रेडिट कार्ड (KCC) ब्याज दर क्या है?',
        'पीएम-किसान सम्मान निधि योजना क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'कृषी अनुदानासाठी कोणती कागदपत्रे लागतात?',
        'किसान क्रेडिट कार्ड (KCC) व्याजदर किती आहे?',
        'पीएम-किसान सन्मान निधी योजना काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  },

  // 41. CUSTOM HIRING CENTRES & MACHINERY RENTAL
  {
    id: 'custom_hiring_machinery',
    category: 'farming',
    keywords: [
      'machinery', 'combine', 'harvester', 'tractor rental', 'chc', 'custom hiring',
      'मशीनरी', 'हार्वेस्टर', 'कंबाइन', 'ट्रैक्टर किराया', 'कस्टम हायरिंग',
      'यंत्रसामग्री', 'हार्वेस्टर', 'ट्रॅक्टर भाडे', 'यंत्रे'
    ],
    patterns: [
      /machinery/i, /harvester/i, /combine/i, /tractor.*rent/i, /custom.*hiring/i, /हार्वेस्टर/i, /कंबाइन/i
    ],
    answers: {
      en: 'Custom Hiring Centres (CHCs) established under the Sub-Mission on Agricultural Mechanization (SMAM) rent out high-tech machinery. Combine harvesters cost ~₹1,400-₹1,800 per acre, and laser land levellers cost ~₹700-₹900 per hour. Farmers can book via the CHC Farm Machinery app.',
      hi: 'कृषि यंत्रीकरण उप-मिशन (SMAM) के तहत स्थापित कस्टम हायरिंग केंद्रों (CHC) से कंबाइन हार्वेस्टर ₹1,400 से ₹1,800 प्रति एकड़ तथा लेजर लैंड लेवलर ₹700 से ₹900 प्रति घंटा की नियंत्रित दर पर किराए पर लिए जा सकते हैं। बुकिंग सीएचसी मोबाइल ऐप से की जा सकती है।',
      mr: 'कृषी यांत्रिकीकरण उप-अभियानांतर्गत (SMAM) सुरू केलेल्या कस्टम हायरिंग केंद्रांमधून (CHC) कंबाइन हार्वेस्टर अंदाजे ₹१,४०० ते ₹१,८०० प्रति एकर आणि लेझर लँड लेव्हलर ₹७०० ते ₹९०० प्रति तास या शासकीय दरात भाड्याने उपलब्ध होतात.'
    },
    followUpQuestions: {
      en: [
        'What are the vehicle capacities for booking slots?',
        'What is the MSP rate for Wheat and Paddy?',
        'How do I book a procurement slot?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'स्लॉट बुकिंग के लिए वाहन क्षमता क्या है?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'खरीद स्लॉट कैसे बुक करें?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'स्लॉट बुक करताना वाहनांची क्षमता किती असावी?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?',
        'धान्य विक्रीसाठी स्लॉट कसा बुक करावा?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 42. APMC CESS & MARKET FEES EXEMPTION
  {
    id: 'apmc_cess_market_fees',
    category: 'apmc',
    keywords: [
      'cess', 'market fee', 'mandi tax', 'charges', 'mandi fee',
      'मंडी टैक्स', 'सेस', 'शुल्क', 'बाजार शुल्क', 'मंडी शुल्क',
      'बाजार फी', 'सेस', 'मंडी कर', 'बाजार शुल्क'
    ],
    patterns: [
      /cess/i, /market.*fee/i, /mandi.*tax/i, /मंडी.*टैक्स/i, /बाजार.*शुल्क/i, /सेस/i
    ],
    answers: {
      en: 'Under statutory government procurement at MSP, farmers pay 0% market fee (Mandi Cess). The statutory APMC market fee (typically 1.0% - 1.5%) and rural development cess are paid entirely by the procuring agency (FCI / State Agencies) and cannot be deducted from farmer proceeds.',
      hi: 'सरकारी एमएसपी खरीद के तहत किसानों से 0% मंडी शुल्क (Cess) लिया जाता है। 1.0% से 1.5% का वैधानिक मंडी शुल्क और ग्रामीण विकास सेस पूर्णतः खरीद एजेंसी (FCI या राज्य एजेंसी) द्वारा दिया जाता है। इसे किसान के भुगतान से काटना गैरकानूनी है।',
      mr: 'हमीभाव (MSP) खरेदीअंतर्गत शेतकऱ्यांकडून ०% बाजार शुल्क (Mandi Cess) आकारले जाते. १.०% ते १.५% बाजार शुल्क आणि उपकर खरेदीदार संस्था (FCI / राज्य संस्था) स्वतः भरते. शेतकऱ्यांच्या बिलातून कोणतीही कपात करण्यास सक्त मनाई आहे.'
    },
    followUpQuestions: {
      en: [
        'How does DBT payment transfer work?',
        'What is the moisture deduction formula?',
        'What documents are required at the mandi?',
        'Where is my active token in the queue?'
      ],
      hi: [
        'DBT बैंक खाता भुगतान कब तक आता है?',
        'नमी कटौती का सही सरकारी सूत्र क्या है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'मेरा सक्रिय टोकन कतार में कहाँ है?'
      ],
      mr: [
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?',
        'ओलावा कपातीचा सरकारी नियम काय आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?'
      ]
    }
  },

  // 43. KISAN CALL CENTRE & TOLL-FREE HELPLINE
  {
    id: 'kisan_call_centre_ivr',
    category: 'helpline',
    keywords: [
      'helpline', 'call centre', 'phone number', 'toll free', 'contact', 'customer care',
      'हेल्पलाइन', 'कॉल सेंटर', 'टोल फ्री', 'फोन नंबर', 'संपर्क',
      'हेल्पलाईन', 'कॉल सेंटर', 'टोल फ्री', 'फोन नंबर', 'मदत क्रमांक'
    ],
    patterns: [
      /helpline/i, /call.*cent/i, /toll.*free/i, /हेल्पलाइन/i, /कॉल.*सेंटर/i, /हेल्पलाईन/i, /फोन.*नंबर/i
    ],
    answers: {
      en: 'Official Kisan Call Centre Toll-Free Helpline: 1800-180-1551 (available 6:00 AM to 10:00 PM in 22 regional languages). MandiMitra 24x7 automated Voice Helpline is available at 1800-890-2026 for instant token query and arrival assistance.',
      hi: 'आधिकारिक किसान कॉल सेंटर टोल-फ्री हेल्पलाइन: 1800-180-1551 (सुबह 6:00 से रात 10:00 बजे तक, सभी क्षेत्रीय भाषाओं में उपलब्ध)। मंडीमित्र 24x7 वॉयस हेल्पलाइन 1800-890-2026 पर उपलब्ध है जहाँ आप कभी भी टोकन स्थिति जान सकते हैं।',
      mr: 'शासकीय किसान कॉल सेंटर टोल-फ्री हेल्पलाइन: 1800-180-1551 (सकाळी ६:०० ते रात्री १०:०० पर्यंत सर्व प्रादेशिक भाषांमध्ये उपलब्ध). मंडीमित्र २४x७ व्हॉइस हेल्पलाइन १८००-८९०-२०२६ वर उपलब्ध असून टोकन स्थिती व मार्गदर्शन तात्काळ मिळते.'
    },
    followUpQuestions: {
      en: [
        'Where is my active token in the queue?',
        'What documents are required at the mandi?',
        'What is the MSP rate for Wheat and Paddy?',
        'How does DBT payment transfer work?'
      ],
      hi: [
        'मेरा सक्रिय टोकन कतार में कहाँ है?',
        'मंडी में कौन-कौन से दस्तावेज चाहिए?',
        'गेहूँ और धान का सरकारी MSP भाव क्या है?',
        'DBT बैंक खाता भुगतान कब तक आता है?'
      ],
      mr: [
        'माझा सक्रिय टोकन रांगेत कितव्या क्रमांकावर आहे?',
        'खरेदी केंद्रावर कोणती कागदपत्रे लागतात?',
        'गहू आणि भाताचा शासकीय हमीभाव काय आहे?',
        'DBT द्वारे खात्यात पैसे कधी जमा होतात?'
      ]
    }
  }
];

/**
 * Intelligent Matcher: Scans query, extracts intent, returns response and next set of 4-6 questions.
 */
export function queryKnowledgeBase(
  userQuery: string,
  preferredLang: 'en' | 'hi' | 'mr' = 'en'
): {
  reply: string;
  language: 'en' | 'hi' | 'mr';
  intent: string;
  source: 'database' | 'knowledge_base' | 'business_logic';
  suggestedQuestions: string[];
} {
  const query = userQuery.trim().toLowerCase();

  // Detect query language if not explicitly provided
  let lang = preferredLang;
  const marathiMarkers = ['आहे', 'कुठे', 'माझा', 'माझी', 'कधी', 'किती', 'वेळ', 'शेतकरी', 'रांग', 'पाहिजे', 'हमीभाव', 'कागदपत्रे'];
  const hindiMarkers = ['है', 'कहाँ', 'मेरा', 'मेरी', 'कब', 'कितना', 'समय', 'किसान', 'कतार', 'चाहिए', 'भाव', 'दस्तावेज'];

  if (marathiMarkers.some((m) => query.includes(m))) {
    lang = 'mr';
  } else if (hindiMarkers.some((m) => query.includes(m)) || /[\u0900-\u097F]/.test(query)) {
    lang = 'hi';
  }

  // 1. Direct Regex / Pattern matching
  for (const item of KNOWLEDGE_BASE) {
    for (const pat of item.patterns) {
      if (pat.test(query)) {
        return {
          reply: item.answers[lang] || item.answers.en,
          language: lang,
          intent: item.id,
          source: 'knowledge_base',
          suggestedQuestions: item.followUpQuestions[lang] || item.followUpQuestions.en,
        };
      }
    }
  }

  // 2. Keyword score matching
  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 2) {
    return {
      reply: bestMatch.answers[lang] || bestMatch.answers.en,
      language: lang,
      intent: bestMatch.id,
      source: 'knowledge_base',
      suggestedQuestions: bestMatch.followUpQuestions[lang] || bestMatch.followUpQuestions.en,
    };
  }

  // 3. Resilient Fallback with Contextual Questions
  const fallbackReplies: Record<'en' | 'hi' | 'mr', string> = {
    en: 'I am your MandiMitra AI Assistant. You can ask me anything about live tokens, MSP rates, delivery slots, weighbridge processes, or DBT bank payments. Please select one of the questions below or ask your query.',
    hi: 'मैं आपका मंडीमित्र एआई सहायक हूँ। आप मुझसे सक्रिय टोकन, एमएसपी भाव, स्लॉट बुकिंग, तौल कांटा प्रक्रिया या डीबीटी बैंक भुगतान के बारे में कुछ भी पूछ सकते हैं। कृपया नीचे दिए गए प्रश्नों में से चुनें या अपना प्रश्न पूछें।',
    mr: 'मी तुमचा मंडीमित्र एआय सहाय्यक आहे. तुम्ही मला चालू टोकन, हमीभाव (MSP), स्लॉट बुकिंग, वजन काटा नियम किंवा DBT बँक खात्यातील पेमेंटबद्दल विचारू शकता. कृपया खालीलपैकी प्रश्न निवडा किंवा नवीन प्रश्न विचारा.',
  };

  return {
    reply: fallbackReplies[lang],
    language: lang,
    intent: 'general_assistance',
    source: 'knowledge_base',
    suggestedQuestions: DEFAULT_SUGGESTED_QUESTIONS[lang],
  };
}
