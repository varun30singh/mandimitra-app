'use client';

import React, { useState } from 'react';
import { fetchApi } from '../../lib/api';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function IvrSimulatorPage() {
  const [inCall, setInCall] = useState(false);
  const [callerMobile, setCallerMobile] = useState('9822012345');
  const [session, setSession] = useState<any>(null);
  const [callHistory, setCallHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  // Play DTMF tone using Web Audio API
  const playTone = (freq1: number, freq2: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.frequency.value = freq1;
      osc2.frequency.value = freq2;

      gainNode.gain.value = 0.15;
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        audioCtx.close();
      }, 150);
    } catch (e) {
      // AudioContext may require user gesture
    }
  };

  const handleStartCall = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/ivr/call', {
        method: 'POST',
        body: JSON.stringify({ mobile: callerMobile }),
      });
      setSession(res);
      setInCall(true);
      setCallHistory([res.promptText]);
      speakVoice(res.promptText);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    setInCall(false);
    setSession(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleKeyPress = async (digit: string) => {
    if (!session || !inCall) return;

    // Standard DTMF frequency pairs
    const dtmfMap: Record<string, [number, number]> = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '0': [941, 1336],
    };

    if (dtmfMap[digit]) {
      playTone(dtmfMap[digit][0], dtmfMap[digit][1]);
    }

    try {
      const res = await fetchApi('/ivr/dtmf', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: session.sessionId,
          digit,
        }),
      });

      setSession(res);
      setCallHistory((prev) => [...prev, `[Keypad: ${digit}]`, res.promptText]);
      speakVoice(res.promptText);

      // Simulate SMS triggered by IVR
      if (res.step === 'ACTION_RESULT') {
        setSmsNotification(`SMS sent to +91-${callerMobile}: "${res.promptText.replace(/\n/g, ' ')}"`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const speakVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[\n\r]+/g, ' ');
      const utterance = new SpeechSynthesisUtterance(clean);
      if (/[\u0900-\u097F]/.test(clean)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
          <PhoneCall className="w-3.5 h-3.5" />
          Section 23: Non-Smartphone Voice Helpline
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-serif">
          Interactive MandiMitra Toll-Free IVR Phone Simulator
        </h1>
        <p className="text-sm text-slate-700 max-w-xl mx-auto">
          Experience how a rural farmer dials <strong>1800-MANDI-HELP</strong> on any basic feature phone to query their token status, wait time, or DBT payments in English, Hindi, or Marathi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Virtual Phone Keypad */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-slate-800 flex flex-col items-center">
          {/* Phone Screen */}
          <div className="w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 text-center mb-6">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {inCall ? '● CALL IN PROGRESS (TOLL-FREE)' : 'STANDBY • READY TO DIAL'}
            </div>
            <div className="text-lg font-mono font-bold text-amber-300 mt-1">
              1800-MANDI-HELP (62634)
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Caller ID: +91-{callerMobile} (Ramesh Kumar)
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
              <button
                key={k}
                onClick={() => handleKeyPress(k)}
                disabled={!inCall}
                className="h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 disabled:opacity-40 text-lg font-bold transition flex flex-col items-center justify-center shadow-inner"
              >
                <span>{k}</span>
              </button>
            ))}
          </div>

          {/* Call / Hangup Buttons */}
          <div className="mt-6 flex items-center gap-4 w-full max-w-[280px]">
            {!inCall ? (
              <button
                onClick={handleStartCall}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                <PhoneCall className="w-5 h-5" /> Dial IVR Line
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition"
              >
                <PhoneOff className="w-5 h-5" /> End Call
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Transcript & Menu Options */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Live Spoken Voice Script (TTS Enabled)
              </h2>
              {inCall && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                  Speaking
                </span>
              )}
            </div>

            {inCall && session ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-sm text-emerald-950 font-medium whitespace-pre-line leading-relaxed">
                  {session.promptText}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Available Keypad Choices:
                  </span>
                  <div className="space-y-1.5">
                    {session.options.map((opt: any) => (
                      <button
                        key={opt.key}
                        onClick={() => handleKeyPress(opt.key)}
                        className="w-full text-left text-xs bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between font-semibold text-slate-800 transition"
                      >
                        <span>{opt.label}</span>
                        <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-900">
                          Press [{opt.key}]
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-700 py-6 text-center">
                Click "Dial IVR Line" to connect to the simulated toll-free voice server.
              </p>
            )}
          </div>

          {/* SMS Simulation Banner */}
          {smsNotification && (
            <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <MessageSquare className="w-4 h-4" />
                SMS Confirmation Delivered
              </div>
              <p className="text-xs text-emerald-100 font-mono bg-emerald-950 p-3 rounded-xl border border-emerald-800">
                {smsNotification}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
