'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../lib/language-context';
import { fetchApi } from '../lib/api';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Database,
  Bot,
  User,
  Volume2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  source?: 'database' | 'business_logic' | 'knowledge_base' | 'gemini';
  intent?: string;
  time: string;
}

export const ChatbotBubble: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom event listener for bottom nav button
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('mandimitra:toggle-chatbot', handleToggle);
    window.addEventListener('mandimitra:open-chatbot', handleOpen);
    return () => {
      window.removeEventListener('mandimitra:toggle-chatbot', handleToggle);
      window.removeEventListener('mandimitra:open-chatbot', handleOpen);
    };
  }, []);

  // Initialize welcoming message
  useEffect(() => {
    let welcome = 'Hello! I am your MandiMitra Assistant. How can I assist you today?';
    if (language === 'hi') {
      welcome = 'नमस्ते! मैं आपका मंडीमित्र सहायक हूँ। टोकन स्थिति, कतार समय या केंद्र अनुशंसा के बारे में पूछें!';
    } else if (language === 'mr') {
      welcome = 'नमस्कार! मी तुमचा MandiMitra सहाय्यक आहे. टोकन स्थिती, रांगेची वेळ किंवा मंडी शिफारसीबद्दल विचारा!';
    }

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: welcome,
        source: 'knowledge_base',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetchApi<{
        reply: string;
        language: string;
        intent: string;
        source: 'database' | 'business_logic' | 'knowledge_base' | 'gemini';
      }>('/chatbot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: textToSend,
          farmer_id: 'MH-NAS-2026-0812',
        }),
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: res.reply,
        source: res.source,
        intent: res.intent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Unable to reach MandiMitra server. Please verify your connection or try again.',
          source: 'knowledge_base',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickPrompts = [
    { label: language === 'hi' ? 'मेरा टोकन कहाँ है?' : (language === 'mr' ? 'माझा टोकन कुठे आहे?' : 'Where is my token?'), text: language === 'hi' ? 'मेरा टोकन कहाँ है' : (language === 'mr' ? 'माझा टोकन कुठे आहे' : 'Where is my token?') },
    { label: language === 'hi' ? 'सर्वोत्तम मंडी केंद्र' : (language === 'mr' ? 'सर्वोत्तम खरेदी केंद्र' : 'Best Centre Recommendation'), text: 'Which centre is recommended for me right now?' },
    { label: language === 'hi' ? 'गेहूँ सरकारी MSP भाव' : (language === 'mr' ? 'गहू हमीभाव (MSP)' : 'Wheat MSP Rate 2026'), text: 'what is the current MSP rate for wheat?' },
    { label: language === 'hi' ? 'आवश्यक दस्तावेज' : (language === 'mr' ? 'लागणारी कागदपत्रे' : 'Documents Required'), text: 'What documents are required at mandi centre?' },
  ];

  return (
    <>
      {/* Floating Action Bubble for mobile/desktop */}
      {!isOpen && (
        <button
          id="mandimitra-chat-toggle"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 rounded-full shadow-lg border-2 border-emerald-400 group transition active:scale-95"
          aria-label="Open MandiMitra Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
          </div>
          <div className="text-left font-medium">
            <div className="text-[10px] leading-none text-emerald-200">MandiMitra AI</div>
            <div className="text-xs font-bold leading-tight text-white">
              {language === 'hi' ? 'सहायता?' : (language === 'mr' ? 'मदत?' : 'Assistant')}
            </div>
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center border border-emerald-500/50">
                <Bot className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  MandiMitra AI Assistant
                  <span className="text-[9px] bg-emerald-950 text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-600">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-200">
                  {language === 'hi' ? 'कतार एवं खरीद साथी' : (language === 'mr' ? 'रांग व खरेदी मार्गदर्शक' : 'Smart Procurement Companion')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([])}
                title="Clear chat"
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/60 transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Banner */}
          <div className="bg-white border-b border-emerald-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="text-[11px] whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-medium px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs transition"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-emerald-50/70 border border-emerald-200 text-emerald-950 rounded-tl-none'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-emerald-200/50 pt-1.5 text-[10px]">
                    <span className={msg.sender === 'user' ? 'text-emerald-200' : 'text-emerald-700'}>
                      {msg.time}
                    </span>

                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1.5">
                        {msg.source === 'database' && (
                          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                            <Database className="w-2.5 h-2.5" /> Database
                          </span>
                        )}
                        {msg.source === 'business_logic' && (
                          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                            <Sparkles className="w-2.5 h-2.5" /> Intelligence
                          </span>
                        )}

                        <button
                          onClick={() => speakText(msg.text)}
                          title="Read aloud"
                          className="text-emerald-700 hover:text-emerald-950 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 italic bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                Live query in progress...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-emerald-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'यहाँ लिखें (जैसे: "मेरा टोकन", "कतार समय")...'
                    : language === 'mr'
                    ? 'येथे टाईप करा (उदा. "माझा टोकन कुठे आहे")...'
                    : 'Ask e.g. "Where is my token?"...'
                }
                className="flex-1 bg-white border border-emerald-200 text-emerald-950 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
