'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  titleKey: string;
  descKey: string;
}

export default function PageHeader({ titleKey, descKey }: Props) {
  const { t } = useLanguage();
  
  return (
    <header className="mb-8 pt-4">
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-400 to-emerald-400 drop-shadow-sm mb-4">
        {t(titleKey)}
      </h1>
      <p className="text-slate-400 text-lg font-light max-w-2xl">
        {t(descKey)}
      </p>
    </header>
  );
}
