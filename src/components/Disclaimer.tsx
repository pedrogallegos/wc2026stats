'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Disclaimer() {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-[1600px] mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 md:p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="text-amber-400 font-bold mb-1 tracking-wide">{t('disclaimer')}</h4>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            {t('disclaimerText')}
          </p>
        </div>
      </div>
    </div>
  );
}
