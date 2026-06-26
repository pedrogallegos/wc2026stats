'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TTeam from '@/components/TTeam';

interface Props {
  team1Name: string;
  team2Name: string;
  team1Img: string;
  team2Img: string;
  children: React.ReactNode;
}

export default function H2HTooltip({ team1Name, team2Name, team1Img, team2Img, children }: Props) {
  const [show, setShow] = useState(false);
  const { t } = useLanguage();

  if (team1Name === 'TBD' || team2Name === 'TBD' || !team1Name || !team2Name) {
    return <div className="relative w-full">{children}</div>;
  }

  // Deterministic mock generation based on string lengths so it remains consistent
  const combined = team1Name.length + team2Name.length;
  const t1Wins = combined % 4;
  const t2Wins = (combined * 3) % 4;
  const draws = (combined * 7) % 3;
  const total = t1Wins + t2Wins + draws;

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 glass rounded-xl border border-sky-500/30 shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-sky-500/30 transform rotate-45"></div>
          
          <h4 className="text-xs font-bold text-slate-400 uppercase text-center mb-3">{t('h2hTitle')}</h4>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col items-center gap-1 w-1/3">
              <img src={team1Img} className="w-8 h-8 object-contain bg-white rounded-full p-1 border border-white/20" />
              <span className="text-[10px] font-bold text-center truncate w-full"><TTeam name={team1Name} /></span>
            </div>
            
            <div className="text-center w-1/3">
              <div className="text-2xl font-black text-sky-400">{total}</div>
              <div className="text-[9px] text-slate-500 uppercase">Matches</div>
            </div>
            
            <div className="flex flex-col items-center gap-1 w-1/3">
              <img src={team2Img} className="w-8 h-8 object-contain bg-white rounded-full p-1 border border-white/20" />
              <span className="text-[10px] font-bold text-center truncate w-full"><TTeam name={team2Name} /></span>
            </div>
          </div>
          
          <div className="flex h-3 w-full rounded-full overflow-hidden mb-2 bg-slate-800">
            {total > 0 ? (
              <>
                <div style={{ width: `${(t1Wins/total)*100}%` }} className="bg-sky-500 h-full"></div>
                <div style={{ width: `${(draws/total)*100}%` }} className="bg-slate-500 h-full"></div>
                <div style={{ width: `${(t2Wins/total)*100}%` }} className="bg-emerald-500 h-full"></div>
              </>
            ) : (
              <div className="w-full bg-slate-700 h-full"></div>
            )}
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-slate-300">
            <span>{t1Wins} {t('wins')}</span>
            <span className="text-slate-500">{draws} {t('draws')}</span>
            <span>{t2Wins} {t('wins')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
