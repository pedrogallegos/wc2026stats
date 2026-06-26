'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function LiveVisitors() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  
  const [visitors, setVisitors] = useState(1240);
  const [countries, setCountries] = useState(['🇲🇽', '🇺🇸', '🇨🇴']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAdmin) return;
    
    // Simulate real-time fluctuating traffic
    const interval = setInterval(() => {
      setVisitors(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(100, prev + change);
      });
      
      // Occasionally swap out countries to make it look like different places are logging in
      if (Math.random() > 0.7) {
        const flags = ['🇲🇽', '🇺🇸', '🇨🇴', '🇪🇸', '🇦🇷', '🇨🇦', '🇵🇪', '🇨🇱', '🇬🇧', '🇫🇷', '🇧🇷'];
        const shuffled = flags.sort(() => 0.5 - Math.random());
        setCountries(shuffled.slice(0, 3));
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!mounted || !isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-700">
      <div className="glass px-4 py-2 rounded-full border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform bg-slate-900/90 hover:bg-slate-800/90">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mr-2 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Admin</span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-mono font-black text-emerald-400">
            {visitors.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'es' ? 'Viendo' : 'Watching'}
          </span>
        </div>
        
        <div className="w-px h-5 bg-white/10"></div>
        
        <div className="flex items-center gap-1.5 text-sm" title={language === 'es' ? 'Tráfico Reciente' : 'Recent Traffic'}>
          {countries.map((flag, i) => (
            <span key={i} className="animate-in fade-in zoom-in duration-500">{flag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
