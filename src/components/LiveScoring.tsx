'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Match } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  matches: Match[];
}

export default function LiveScoring({ matches }: Props) {
  const { t, language, tTeam } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      router.refresh();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [router]);

  if (!matches || matches.length === 0) return null;

  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
  const displayMatches = matches.filter(m => {
    if (m.status === 'IN_PLAY' || m.status === 'PAUSED') return true;
    if (!m.utcDate) return false;
    const matchDate = new Date(m.utcDate);
    return matchDate >= threeHoursAgo && matchDate <= fourHoursFromNow;
  });

  if (displayMatches.length === 0) return null;

  const hasLive = displayMatches.some(m => {
    if (m.status === 'IN_PLAY' || m.status === 'PAUSED') return true;
    if ((m.status === 'TIMED' || m.status === 'SCHEDULED') && m.utcDate && new Date(m.utcDate) <= now) return true;
    return false;
  });

  const formatTime = (utcStr: string) => {
    if (!mounted) return '--:--';
    const d = new Date(utcStr);
    return d.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-2 animate-in fade-in duration-700">
      <div className="glass rounded-2xl p-4 flex flex-col items-center gap-4 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
        
        {/* Header Badge */}
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-inner ${hasLive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}`}>
          {hasLive && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
          {hasLive ? t('liveMatches') : t('todaysMatches')}
        </div>
        
        {/* Match Grid */}
        <div className="w-full flex flex-wrap justify-center gap-4">
          {displayMatches.map((match) => {
            const matchDate = match.utcDate ? new Date(match.utcDate) : null;
            const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED' || ((match.status === 'TIMED' || match.status === 'SCHEDULED') && matchDate && matchDate <= now);
            const isUpcoming = (match.status === 'TIMED' || match.status === 'SCHEDULED') && matchDate && matchDate > now;
            
            return (
              <div key={match.id} className="w-full sm:w-auto min-w-[320px] flex justify-between items-center gap-3 bg-slate-900/60 hover:bg-slate-800/80 transition-colors px-4 py-3 rounded-xl border border-white/5 shadow-sm cursor-default">
                
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="font-bold text-slate-200 text-sm md:text-base">{tTeam(match.homeTeam?.tla || match.homeTeam?.name)}</span>
                  <img src={match.homeTeam?.crest} alt="" className="w-6 h-6 object-contain drop-shadow-md" />
                </div>
                
                <div className={`px-2 py-1 rounded-md font-mono font-bold text-sm min-w-[70px] text-center shrink-0 ${isLive ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]' : 'bg-black/50 text-sky-300'}`}>
                  {isUpcoming ? (
                    <span>{match.utcDate ? formatTime(match.utcDate) : 'TBD'}</span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1"></span>}
                      {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-1 justify-start">
                  <img src={match.awayTeam?.crest} alt="" className="w-6 h-6 object-contain drop-shadow-md" />
                  <span className="font-bold text-slate-200 text-sm md:text-base">{tTeam(match.awayTeam?.tla || match.awayTeam?.name)}</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
