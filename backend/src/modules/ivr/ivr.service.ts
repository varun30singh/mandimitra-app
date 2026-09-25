import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QueueService } from '../queue/queue.service';

export interface IvrSessionState {
  sessionId: string;
  mobile: string;
  step: 'LANGUAGE_SELECT' | 'MENU_SELECT' | 'ACTION_RESULT';
  language?: 'en' | 'hi' | 'mr';
  selectedOption?: string;
  promptText: string;
  options: { key: string; label: string }[];
  resultData?: any;
}

@Injectable()
export class IvrService {
  private sessions = new Map<string, IvrSessionState>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  async initiateCall(mobile: string = '9822012345'): Promise<IvrSessionState> {
    const sessionId = `IVR-${Date.now()}`;
    const initialPrompt =
      'Welcome to MandiMitra Toll-Free Farmer Line. \n' +
      'For English, Press 1. \n' +
      'हिन्दी के लिए 2 दबाएँ। \n' +
      'मराठीसाठी 3 दाबा.';

    const state: IvrSessionState = {
      sessionId,
      mobile,
      step: 'LANGUAGE_SELECT',
      promptText: initialPrompt,
      options: [
        { key: '1', label: 'English' },
        { key: '2', label: 'हिन्दी (Hindi)' },
        { key: '3', label: 'मराठी (Marathi)' },
      ],
    };

    this.sessions.set(sessionId, state);
    return state;
  }

  async processDtmf(sessionId: string, digit: string): Promise<IvrSessionState> {
    let state = this.sessions.get(sessionId);
    if (!state) {
      state = await this.initiateCall();
    }

    if (state.step === 'LANGUAGE_SELECT') {
      let lang: 'en' | 'hi' | 'mr' = 'en';
      if (digit === '2') lang = 'hi';
      else if (digit === '3') lang = 'mr';

      let prompt = '';
      let options = [];

      if (lang === 'hi') {
        prompt =
          'मंडीमित्र में आपका स्वागत है। \n' +
          'टोकन स्थिति जानने के लिए 1 दबाएँ। \n' +
          'स्लॉट बुकिंग के लिए 2 दबाएँ। \n' +
          'भुगतान स्थिति के लिए 3 दबाएँ।';
        options = [
          { key: '1', label: 'टोकन स्थिति (Token Status)' },
          { key: '2', label: 'स्लॉट बुकिंग (Slot Booking)' },
          { key: '3', label: 'भुगतान स्थिति (Payment Status)' },
        ];
      } else if (lang === 'mr') {
        prompt =
          'MandiMitra मध्ये आपले स्वागत आहे. \n' +
          'टोकन स्थिती जाणून घेण्यासाठी 1 दाबा. \n' +
          'स्लॉट बुकिंगसाठी 2 दाबा. \n' +
          'पेमेंट स्थितीसाठी 3 दाबा.';
        options = [
          { key: '1', label: 'टोकन स्थिती (Token Status)' },
          { key: '2', label: 'स्लॉट बुकिंग (Slot Booking)' },
          { key: '3', label: 'पेमेंट स्थिती (Payment Status)' },
        ];
      } else {
        prompt =
          'Welcome to MandiMitra. \n' +
          'Press 1 for Live Token Status. \n' +
          'Press 2 for Slot Booking Guidance. \n' +
          'Press 3 for Payment DBT Status.';
        options = [
          { key: '1', label: 'Token Status' },
          { key: '2', label: 'Slot Booking' },
          { key: '3', label: 'Payment Status' },
        ];
      }

      state.language = lang;
      state.step = 'MENU_SELECT';
      state.promptText = prompt;
      state.options = options;
      this.sessions.set(sessionId, state);
      return state;
    }

    if (state.step === 'MENU_SELECT') {
      const farmer = await this.prisma.farmer.findFirst({
        where: { mobile: state.mobile },
      });

      const lang = state.language || 'en';
      let prompt = '';
      let resultData: any = null;

      if (digit === '1') {
        // Token Status
        if (farmer) {
          const tokenDetails = await this.queueService.getFarmerActiveToken(farmer.id);
          if (tokenDetails) {
            const t = tokenDetails.token;
            resultData = tokenDetails;
            if (lang === 'hi') {
              prompt = `किसान ${farmer.fullName} जी, आपका टोकन नंबर ${t.tokenNumber} है। आपके आगे ${tokenDetails.farmersAhead} किसान हैं। अनुमानित समय ${tokenDetails.estimatedCallTime} है। एसएमएस आपके मोबाइल पर भेज दिया गया है।`;
            } else if (lang === 'mr') {
              prompt = `शेतकरी ${farmer.fullName}, तुमचा टोकन क्रमांक ${t.tokenNumber} आहे. तुमच्या पुढे ${tokenDetails.farmersAhead} शेतकरी आहेत. अंदाजे पाळी ${tokenDetails.estimatedCallTime} वाजता येईल. एसएमएस पाठवला आहे.`;
            } else {
              prompt = `Farmer ${farmer.fullName}, your token number is ${t.tokenNumber}. You have ${tokenDetails.farmersAhead} farmers ahead. Estimated service time is ${tokenDetails.estimatedCallTime}. SMS confirmation sent.`;
            }
          } else {
            prompt = lang === 'hi' ? 'आज के लिए आपका कोई टोकन सक्रिय नहीं है।' : (lang === 'mr' ? 'आजसाठी तुमचा कोणताही टोकन सक्रिय नाही.' : 'No active token found for today.');
          }
        }
      } else if (digit === '3') {
        // Payment Status
        if (farmer) {
          const payment = await this.prisma.payment.findFirst({
            where: { farmerId: farmer.id },
            orderBy: { createdAt: 'desc' },
          });
          if (payment) {
            resultData = payment;
            const amt = `₹${payment.amount.toLocaleString('en-IN')}`;
            if (lang === 'hi') {
              prompt = `आपके खाते में राशि ${amt} का डीबीटी भुगतान प्रक्रियाधीन है। बैंक खाता अंतिम अंक: ${payment.bankAccountLast4}।`;
            } else if (lang === 'mr') {
              prompt = `तुमच्या खात्यात रक्कम ${amt} चे डीबीटी पेमेंट प्रक्रियेत आहे. बँक खाते शेवटचे अंक: ${payment.bankAccountLast4}.`;
            } else {
              prompt = `DBT Payment of ${amt} is currently under processing for your account ending in ${payment.bankAccountLast4}.`;
            }
          }
        }
      } else {
        // Slot Booking Assistance
        if (lang === 'hi') {
          prompt = 'नजदीकी केंद्र मंडी सेंटर B (निफाड़) में दोपहर 12:30 बजे स्लॉट उपलब्ध है। क्या आप इसे बुक करना चाहते हैं? 1 दबाकर पुष्टि करें।';
        } else if (lang === 'mr') {
          prompt = 'जवळचे केंद्र मंडी सेंटर B (निफाड) येथे दुपारी 12:30 वाजता स्लॉट उपलब्ध आहे. बुक करण्यासाठी 1 दाबा.';
        } else {
          prompt = 'Mandi Centre B (Niphad) has open slots at 12:30 PM. Press 1 to confirm automatic token allocation.';
        }
      }

      state.step = 'ACTION_RESULT';
      state.promptText = prompt;
      state.options = [{ key: '0', label: lang === 'hi' ? 'मुख्य मेनू' : (lang === 'mr' ? 'मुख्य मेनू' : 'Main Menu') }];
      state.resultData = resultData;
      this.sessions.set(sessionId, state);
      return state;
    }

    // Reset to start if 0 pressed
    return this.initiateCall(state.mobile);
  }
}
