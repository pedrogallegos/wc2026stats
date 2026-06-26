'use client';

import React, { useState, useEffect } from 'react';
import { Match } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface Props {
  matches: Match[];
}

export default function LiveScoring({ matches }: Props) {
  const { t, language, tTeam } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!matches || matches.length === 0) {
    return null;
  }

  // Get matches that are live, or scheduled/finished within a close time window
  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
  const displayMatches = matches.filter(m => {
    if (m.status === 'IN_PLAY' || m.status === 'PAUSED') return true;
    if (!m.utcDate) return false;
    const matchDate = new Date(m.utcDate);
    // Show matches that happened recently or are coming up soon
    return matchDate >= threeHoursAgo && matchDate <= fourHoursFromNow;
  });

  if (displayMatches.length === 0) {
    return null;
  }

  const hasLive = displayMatches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');

  const formatTime = (utcStr: string) => {
    if (!mounted) return '--:--';
    const d = new Date(utcStr);
    return d.toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-slate-900/80 border-b border-white/5 py-3 mb-6 overflow-hidden relative flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10 flex items-center px-4 pointer-events-none">
        <span className={`text-xs font-bold uppercase flex items-center gap-2 ${hasLive ? 'text-red-500' : 'text-sky-400'}`}>
          {hasLive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          {hasLive ? t('liveMatches') : t('todaysMatches')}
        </span>
      </div>
      
      <div className="w-full flex justify-center gap-8 overflow-x-auto no-scrollbar px-4 py-1 animate-in fade-in duration-500">
        {displayMatches.map((match) => {
          const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
          const isUpcoming = match.status === 'TIMED' || match.status === 'SCHEDULED';
          
          return (
            <div key={match.id} className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg whitespace-nowrap min-w-fit border border-white/5">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{tTeam(match.homeTeam?.tla || match.homeTeam?.name)}</span>
                <img src={match.homeTeam?.crest} alt="" className="w-4 h-4 object-contain" />
              </div>
              
              <div className={`px-3 py-1 rounded font-mono font-bold text-center min-w-[70px] ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-black/40 text-sky-400'}`}>
                {isUpcoming ? (
                  <span className="text-sm font-medium">{match.utcDate ? formatTime(match.utcDate) : 'TBD'}</span>
                ) : (
                  <span>{match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <img src={match.awayTeam?.crest} alt="" className="w-4 h-4 object-contain" />
                <span className="font-semibold">{tTeam(match.awayTeam?.tla || match.awayTeam?.name)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
