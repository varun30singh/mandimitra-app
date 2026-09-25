import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../lib/language-context';
import { Navbar } from '../components/Navbar';
import { ChatbotBubble } from '../components/ChatbotBubble';

export const metadata: Metadata = {
  title: 'MANDIMITRA | Smart Procurement Scheduling & Farmer Assistance Platform',
  description: 'Digital platform to eliminate farmer waiting time at agricultural procurement and mandi centres through smart scheduling, live queue tracking, and AI assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
          <ChatbotBubble />
          <footer className="bg-emerald-950 text-emerald-200 py-8 border-t border-emerald-900 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">MANDIMITRA</span>
                <span>• Smart India Hackathon 2026</span>
              </div>
              <p className="text-emerald-400">
                "Don't make farmers wait at the mandi. Let the system predict, schedule and guide them."
              </p>
              <div className="flex items-center gap-4 text-emerald-300">
                <span>Toll-Free Helpline: 1800-MANDI-HELP</span>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
