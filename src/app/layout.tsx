import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { PredictorProvider } from '@/context/PredictorContext';
import LiveVisitors from '@/components/LiveVisitors';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WC 2026 Tracker',
  description: 'Track the 2026 World Cup Group Stages and Knockouts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen selection:bg-emerald-500/30`}>
        <div className="fixed top-0 left-0 right-0 h-[500px] z-[-1] bg-gradient-to-b from-sky-500/10 to-transparent blur-3xl"></div>
        
        <LanguageProvider>
          <PredictorProvider>
            <Navigation />
            {children}
            <LiveVisitors />
            <Analytics />
          </PredictorProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
