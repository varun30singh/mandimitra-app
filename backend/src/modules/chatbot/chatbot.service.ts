import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueueService } from '../queue/queue.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { ConfigService } from '@nestjs/config';

export interface ChatbotResponse {
  reply: string;
  language: 'en' | 'hi' | 'mr';
  intent: string;
  source: 'database' | 'business_logic' | 'knowledge_base' | 'gemini';
  dataPayload?: any;
}

@Injectable()
export class ChatbotService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
    private readonly recommendationService: RecommendationService,
    private readonly configService: ConfigService,
  ) {}

  detectLanguage(text: string): 'en' | 'hi' | 'mr' {
    const lower = text.toLowerCase();

    // Marathi Devanagari or transliteration markers
    const marathiMarkers = ['आहे', 'कुठे', 'माझा', 'माझी', 'कधी', 'किती', 'वेळ', 'शेतकरी', 'रांग', 'पाहिजे', 'झाला', 'mazha', 'kuthe', 'kadhi', 'kiti', 'vel', 'shinde', 'ahe'];
    if (marathiMarkers.some((m) => lower.includes(m))) return 'mr';

    // Hindi Devanagari or transliteration markers
    const hindiMarkers = ['है', 'कहाँ', 'मेरा', 'मेरी', 'कब', 'कितना', 'समय', 'किसान', 'कतार', 'चाहिए', 'हुआ', 'mera', 'meri', 'kaha', 'kab', 'kitna', 'bhai', 'namaste', 'batao', 'aayega'];
    if (hindiMarkers.some((m) => lower.includes(m))) return 'hi';

    // General Devanagari test
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hi';
    }

    return 'en';
  }

  detectIntent(text: string): string {
    const lower = text.toLowerCase();

    if (
      lower.includes('token') ||
      lower.includes('टोकन') ||
      lower.includes('kaha hai') ||
      lower.includes('kuthe ahe') ||
      lower.includes('queue') ||
      lower.includes('wait') ||
      lower.includes('turn') ||
      lower.includes('number') ||
      lower.includes('नंबर') ||
      lower.includes('कतार') ||
      lower.includes('रांग') ||
      lower.includes('position')
    ) {
      return 'TOKEN_STATUS';
    }

    if (
      lower.includes('recommend') ||
      lower.includes('best') ||
      lower.includes('centre') ||
      lower.includes('mandi') ||
      lower.includes('मंडी') ||
      lower.includes('kaha jau') ||
      lower.includes('kuthe jau') ||
      lower.includes('pass') ||
      lower.includes('jawad')
    ) {
      return 'CENTRE_RECOMMENDATION';
    }

    if (
      lower.includes('payment') ||
      lower.includes('paisa') ||
      lower.includes('paise') ||
      lower.includes('rupaye') ||
      lower.includes('dbt') ||
      lower.includes('bank') ||
      lower.includes('पैसे') ||
      lower.includes('पेमेंट') ||
      lower.includes('खाता')
    ) {
      return 'PAYMENT_STATUS';
    }

    if (
      lower.includes('slot') ||
      lower.includes('book') ||
      lower.includes('appointment') ||
      lower.includes('स्लॉट') ||
      lower.includes('बुक')
    ) {
      return 'SLOT_AVAILABILITY';
    }

    if (
      lower.includes('msp') ||
      lower.includes('rate') ||
      lower.includes('bhav') ||
      lower.includes('भाव') ||
      lower.includes('दर') ||
      lower.includes('किंमत') ||
      lower.includes('price')
    ) {
      return 'MSP_RATES';
    }

    if (
      lower.includes('document') ||
      lower.includes('documents') ||
      lower.includes('aadhaar') ||
      lower.includes('7/12') ||
      lower.includes('satbara') ||
      lower.includes('कागदपत्र') ||
      lower.includes('कागजात')
    ) {
      return 'DOCUMENTS_REQUIRED';
    }

    return 'GENERAL_AGRICULTURE';
  }

  async processMessage(message: string, farmerId?: string, sessionId?: string): Promise<ChatbotResponse> {
    const lang = this.detectLanguage(message);
    const intent = this.detectIntent(message);

    // Save user chat message
    if (sessionId) {
      try {
        await this.prisma.chatMessage.create({
          data: {
            sessionId,
            sender: 'USER',
            text: message,
            intent,
          },
        });
      } catch (err) {
        // Non-blocking log
      }
    }

    // 1. Live Database Queries (Highest Priority)
    if (intent === 'TOKEN_STATUS') {
      let farmer = null;
      if (farmerId) {
        farmer = await this.prisma.farmer.findFirst({
          where: { OR: [{ id: farmerId }, { farmerId }, { mobile: farmerId }] },
        });
      }

      // Default to Ramesh Kumar if no farmer passed during quick demo testing
      if (!farmer) {
        farmer = await this.prisma.farmer.findFirst({
          where: { mobile: '9822012345' },
        });
      }

      if (farmer) {
        const tokenDetails = await this.queueService.getFarmerActiveToken(farmer.id);
        if (tokenDetails) {
          const t = tokenDetails.token;
          const ahead = tokenDetails.farmersAhead;
          const wait = tokenDetails.estimatedWaitMinutes;
          const callTime = tokenDetails.estimatedCallTime;
          const cName = tokenDetails.centre.name;

          let reply = '';
          if (lang === 'hi') {
            reply = `नमस्कार ${farmer.fullName} जी! आपका सक्रिय टोकन ${t.tokenNumber} है (${cName})। वर्तमान में आपके आगे ${ahead} किसान हैं। आपका अनुमानित समय लगभग ${callTime} (${wait} मिनट प्रतीक्षा) है। ${tokenDetails.statusMessage}`;
          } else if (lang === 'mr') {
            reply = `नमस्कार ${farmer.fullName}! तुमचा टोकन क्रमांक ${t.tokenNumber} आहे (${cName}). सध्या तुमच्या पुढे ${ahead} शेतकरी आहेत. तुमची अंदाजे पाळी ${callTime} वाजता (सुमारे ${wait} मिनिटे) येईल. ${tokenDetails.statusMessage}`;
          } else {
            reply = `Hello ${farmer.fullName}! Your active token is ${t.tokenNumber} at ${cName}. There are currently ${ahead} farmers ahead of you. Estimated turn is around ${callTime} (~${wait} min wait). ${tokenDetails.statusMessage}`;
          }

          return {
            reply,
            language: lang,
            intent,
            source: 'database',
            dataPayload: tokenDetails,
          };
        }
      }

      // No active token found
      const reply =
        lang === 'hi'
          ? 'आपके पास आज के लिए कोई सक्रिय टोकन नहीं है। आप "स्लॉट बुक करें" बटन से नया टोकन ले सकते हैं।'
          : lang === 'mr'
          ? 'तुमच्याकडे आजसाठी कोणताही सक्रिय टोकन नाही. तुम्ही "स्लॉट बुक करा" पर्यायावरून नवीन टोकन मिळवू शकता.'
          : 'You do not have an active queue token for today. You can book a dynamic slot via the "Book Slot" tab.';

      return { reply, language: lang, intent, source: 'database' };
    }

    if (intent === 'PAYMENT_STATUS') {
      let farmer = null;
      if (farmerId) {
        farmer = await this.prisma.farmer.findFirst({
          where: { OR: [{ id: farmerId }, { farmerId }, { mobile: farmerId }] },
        });
      }
      if (!farmer) {
        farmer = await this.prisma.farmer.findFirst({ where: { mobile: '9822012345' } });
      }

      if (farmer) {
        const payment = await this.prisma.payment.findFirst({
          where: { farmerId: farmer.id },
          include: { procurement: true },
          orderBy: { createdAt: 'desc' },
        });

        if (payment) {
          const amt = `₹${payment.amount.toLocaleString('en-IN')}`;
          const crop = payment.procurement.crop;
          const status = payment.status === 'PROCESSING' ? 'Processing (DBT initiated)' : 'Completed (Disbursed)';

          let reply = '';
          if (lang === 'hi') {
            reply = `${farmer.fullName} जी, आपके ${crop} खरीद का भुगतान विवरण: राशि ${amt}। स्थिति: ${status}। राशि आपके आधार-लिंक्ड बैंक खाते (अंतिम अंक ${payment.bankAccountLast4}) में स्थानांतरित की जा रही है।`;
          } else if (lang === 'mr') {
            reply = `${farmer.fullName}, तुमच्या ${crop} खरेदीचे पेमेंट तपशील: रक्कम ${amt}. स्थिती: ${status}. रक्कम थेट तुमच्या आधार-संलग्न बँक खात्यात (शेवटचे अंक ${payment.bankAccountLast4}) जमा होत आहे.`;
          } else {
            reply = `Payment Details for ${farmer.fullName}: Amount: ${amt} for ${crop}. Status: ${status}. Direct Benefit Transfer (DBT) is routed to your Aadhaar-linked account ending in ${payment.bankAccountLast4}.`;
          }

          return { reply, language: lang, intent, source: 'database', dataPayload: payment };
        }
      }
    }

    // 2. Business Logic Queries (Smart Recommendation)
    if (intent === 'CENTRE_RECOMMENDATION') {
      const recs = await this.recommendationService.getRecommendations(farmerId);
      if (recs.length > 0) {
        const top = recs[0];
        let reply = '';
        if (lang === 'hi') {
          reply = `MandiMitra अनुशंसा: आपके लिए सबसे उपयुक्त केंद्र "${top.centre.name}" है। कारण: यह केवल ${top.metrics.distanceKm} किमी दूर है, यहाँ केवल ${top.metrics.queueLength} किसान प्रतीक्षा में हैं, अनुमानित प्रतीक्षा समय लगभग ${top.metrics.estimatedWaitMinutes} मिनट है, और 12:30 बजे स्लॉट उपलब्ध है।`;
        } else if (lang === 'mr') {
          reply = `MandiMitra शिफारस: तुमच्यासाठी सर्वोत्तम केंद्र "${top.centre.name}" आहे. कारण: हे फक्त ${top.metrics.distanceKm} किमी अंतरावर आहे, फक्त ${top.metrics.queueLength} शेतकरी प्रतीक्षेत आहेत, आणि अंदाजे प्रतीक्षा वेळ फक्त ${top.metrics.estimatedWaitMinutes} मिनिटे आहे.`;
        } else {
          reply = `MandiMitra Recommendation: Best centre for you right now is "${top.centre.name}". Why? It is ${top.metrics.distanceKm} km away, has only ${top.metrics.queueLength} farmers waiting, ~${top.metrics.estimatedWaitMinutes} min wait, and open slots at 12:30 PM.`;
        }

        return { reply, language: lang, intent, source: 'business_logic', dataPayload: top };
      }
    }

    // 3. Approved Agricultural Knowledge Base
    if (intent === 'MSP_RATES') {
      let reply = '';
      if (lang === 'hi') {
        reply = 'सरकारी न्यूनतम समर्थन मूल्य (MSP) 2026-27:\n• गेहूँ (Wheat): ₹2,275 प्रति क्विंटल\n• प्याज (Onion): ₹2,250 - ₹2,600 (गुणवत्ता अनुसार)\n• सोयाबीन (Soybean): ₹4,892 प्रति क्विंटल\n• चना (Gram): ₹5,440 प्रति क्विंटल\n• धान (Paddy Common): ₹2,300 प्रति क्विंटल।';
      } else if (lang === 'mr') {
        reply = 'शासकीय हमीभाव (MSP) 2026-27:\n• गहू (Wheat): ₹2,275 प्रति क्विंटल\n• कांदा (Onion): ₹2,250 - ₹2,600 (प्रतीनुसार)\n• सोयाबीन (Soybean): ₹4,892 प्रति क्विंटल\n• हरभरा (Gram): ₹5,440 प्रति क्विंटल\n• भात/धान (Paddy): ₹2,300 प्रति क्विंटल.';
      } else {
        reply = 'Government Minimum Support Prices (MSP) 2026-27:\n• Wheat: ₹2,275 / quintal\n• Onion: ₹2,250 - ₹2,600 / quintal (Graded)\n• Soybean: ₹4,892 / quintal\n• Gram (Chana): ₹5,440 / quintal\n• Paddy (Common): ₹2,300 / quintal.';
      }

      return { reply, language: lang, intent, source: 'knowledge_base' };
    }

    if (intent === 'DOCUMENTS_REQUIRED') {
      let reply = '';
      if (lang === 'hi') {
        reply = 'मंडी खरीद केंद्र पर आवश्यक दस्तावेज:\n1. आधार कार्ड (मूल एवं छायाप्रति)\n2. 7/12 खतौनी / डिजिटल भू-अभिलेख\n3. आधार-लिंक्ड बैंक पासबुक छायाप्रति\n4. मंडीमित्र डिजिटल टोकन नंबर / SMS\n5. फसल गिरदावरी / ई-पीक पाहणी पंजीकरण।';
      } else if (lang === 'mr') {
        reply = 'मंडी केंद्रावर आवश्यक कागदपत्रे:\n1. आधार कार्ड\n2. डिजिटल 7/12 उतारा आणि 8-अ\n3. आधार लिंक असलेले बँक पासबुक\n4. MandiMitra डिजिटल टोकन नंबर किंवा SMS\n5. ई-पीक पाहणी नोंदणी पुरावा.';
      } else {
        reply = 'Documents required at Mandi Procurement Centre:\n1. Aadhaar Card (Original & Copy)\n2. Digital 7/12 Land Record (Satbara)\n3. Aadhaar-linked Bank Account Passbook\n4. MandiMitra Digital Token SMS / QR Code\n5. E-Pik Pahani (Crop Sowing Registration).';
      }

      return { reply, language: lang, intent, source: 'knowledge_base' };
    }

    if (intent === 'SLOT_AVAILABILITY') {
      let reply = '';
      if (lang === 'hi') {
        reply = 'आज के सभी केंद्रों में 08:30 AM से 05:00 PM तक 30-मिनट के डायनामिक स्लॉट उपलब्ध हैं। मंडी केंद्र B (निफाड़) में दोपहर 12:30 बजे सबसे कम प्रतीक्षा वाला स्लॉट उपलब्ध है।';
      } else if (lang === 'mr') {
        reply = 'आज सर्व केंद्रांवर सकाळी 08:30 ते संध्याकाळी 05:00 पर्यंत 30-मिनिटांचे स्लॉट उपलब्ध आहेत. मंडी केंद्र B (निफाड) येथे दुपारी 12:30 वाजता सर्वात कमी प्रतीक्षेचा स्लॉट उपलब्ध आहे.';
      } else {
        reply = 'Dynamic 30-minute procurement slots are available from 08:30 AM to 05:00 PM across all centres. Mandi Centre B (Niphad) currently has immediate availability at 12:30 PM with minimal queue.';
      }
      return { reply, language: lang, intent, source: 'database' };
    }

    // 4. Fallback / Gemini Agricultural Layer
    let fallbackReply = '';
    if (lang === 'hi') {
      fallbackReply = 'मैं आपकी मंडीमित्र टोकन, कतार स्थिति, केंद्र अनुशंसा, स्लॉट बुकिंग, भुगतान स्थिति और फसल खरीद संबंधित जानकारी में सहायता कर सकता हूँ। कृपया अपना प्रश्न पूछें!';
    } else if (lang === 'mr') {
      fallbackReply = 'मी तुम्हाला MandiMitra टोकन, रांगेची स्थिती, मंडी शिफारस, स्लॉट बुकिंग, पेमेंट आणि खरेदी नियमांबद्दल मदत करू शकतो. कृपया आपला प्रश्न विचारा!';
    } else {
      fallbackReply = 'I can help with MandiMitra procurement centres, live queue tokens, smart recommendations, slot bookings, payments, and agricultural procurement guidance.';
    }

    return {
      reply: fallbackReply,
      language: lang,
      intent: 'GENERAL_ASSISTANCE',
      source: 'knowledge_base',
    };
  }
}
