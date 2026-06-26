'use client';

import React, { useState } from 'react';
import { Match32 } from '@/utils/tournament';
import { TableRow } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { usePredictor } from '@/context/PredictorContext';
import H2HTooltip from '@/components/H2HTooltip';

interface Props {
  roundOf32: Match32[];
}

type RoundTab = 'R32' | 'R16' | 'QF' | 'SF' | 'F';

export default function FullBracket({ roundOf32 }: Props) {
  const { t, language, tTeam } = useLanguage();
  const { isPredictorMode, setIsPredictorMode, bracketPredictions, setBracketPrediction, resetPredictions } = usePredictor();
  const [activeTab, setActiveTab] = useState<RoundTab>('R32');

  if (!roundOf32 || roundOf32.length === 0) return null;

  const getM = (id: string) => roundOf32.find(m => m.id === id) || { team1: { label: '?' }, team2: { label: '?' } };

  // Helper to determine winner of a match based on predictions or real data
  const getWinner = (matchId: string, team1Obj: any, team2Obj: any) => {
    // 1. Check predictor
    const predictedWinnerId = bracketPredictions[matchId];
    if (predictedWinnerId) {
      if (team1Obj?.team?.id === predictedWinnerId) return team1Obj;
      if (team2Obj?.team?.id === predictedWinnerId) return team2Obj;
    }
    // 2. We don't have real knockout scores from this API since WC hasn't started,
    // so we just return TBD if not predicted
    return { label: 'TBD' };
  };

  // Base matches (Round of 32)
  const m74 = getM('M74'), m77 = getM('M77'), m73 = getM('M73'), m75 = getM('M75');
  const m76 = getM('M76'), m78 = getM('M78'), m79 = getM('M79'), m80 = getM('M80');
  
  const m83 = getM('M83'), m84 = getM('M84'), m81 = getM('M81'), m82 = getM('M82');
  const m86 = getM('M86'), m88 = getM('M88'), m85 = getM('M85'), m87 = getM('M87');

  // Round of 16 Winners
  const w74 = getWinner('M74', m74.team1, m74.team2);
  const w77 = getWinner('M77', m77.team1, m77.team2);
  const w73 = getWinner('M73', m73.team1, m73.team2);
  const w75 = getWinner('M75', m75.team1, m75.team2);
  const w76 = getWinner('M76', m76.team1, m76.team2);
  const w78 = getWinner('M78', m78.team1, m78.team2);
  const w79 = getWinner('M79', m79.team1, m79.team2);
  const w80 = getWinner('M80', m80.team1, m80.team2);

  const w83 = getWinner('M83', m83.team1, m83.team2);
  const w84 = getWinner('M84', m84.team1, m84.team2);
  const w81 = getWinner('M81', m81.team1, m81.team2);
  const w82 = getWinner('M82', m82.team1, m82.team2);
  const w86 = getWinner('M86', m86.team1, m86.team2);
  const w88 = getWinner('M88', m88.team1, m88.team2);
  const w85 = getWinner('M85', m85.team1, m85.team2);
  const w87 = getWinner('M87', m87.team1, m87.team2);

  // Quarter Finals Winners
  const w89 = getWinner('M89', w74, w77);
  const w90 = getWinner('M90', w73, w75);
  const w91 = getWinner('M91', w76, w78);
  const w92 = getWinner('M92', w79, w80);

  const w93 = getWinner('M93', w83, w84);
  const w94 = getWinner('M94', w81, w82);
  const w95 = getWinner('M95', w86, w88);
  const w96 = getWinner('M96', w85, w87);

  // Semi Finals Winners
  const w97 = getWinner('M97', w89, w90);
  const w98 = getWinner('M98', w93, w94);
  const w99 = getWinner('M99', w91, w92);
  const w100 = getWinner('M100', w95, w96);

  // Final Winners
  const w101 = getWinner('M101', w97, w98);
  const w102 = getWinner('M102', w99, w100);

  const renderTeam = (teamObj: any, matchId: string, isWinner: boolean) => {
    const isTBD = !teamObj || !teamObj.team;
    
    if (!isTBD) {
      const team = teamObj.team;
      return (
        <div 
          className={`flex items-center gap-2 w-full h-full px-2 cursor-pointer transition-all ${
            isPredictorMode ? 'hover:bg-sky-500/30' : ''
          } ${isWinner ? 'bg-sky-500/20 border-l-2 border-sky-400' : ''}`}
          onClick={() => {
            if (isPredictorMode) setBracketPrediction(matchId, team.id);
          }}
        >
          <img src={team.crest} alt={team.name} className="w-5 h-5 object-contain bg-white rounded-full p-0.5 border border-white/20 flex-shrink-0" />
          <span className="font-semibold text-sm truncate" title={tTeam(team.name)}>{tTeam(team.name)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 w-full h-full px-2 text-slate-500">
        <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex-shrink-0 flex items-center justify-center">
          <span className="text-[8px]">?</span>
        </div>
        <span className="text-sm font-medium italic truncate">{isTBD ? t('tbd') : teamObj.label}</span>
      </div>
    );
  };

  const MatchBox = ({ title, matchId, t1, t2, isMobile = false }: { title: string; matchId: string; t1: any; t2: any; isMobile?: boolean }) => {
    const winnerId = bracketPredictions[matchId];
    return (
      <H2HTooltip 
        team1Name={t1?.team?.name} 
        team2Name={t2?.team?.name} 
        team1Img={t1?.team?.crest} 
        team2Img={t2?.team?.crest}
      >
        <div className={`glass rounded-lg border p-1 shadow-lg flex flex-col justify-center relative z-10 transition-colors ${isMobile ? 'w-full mb-3' : 'w-48'} ${
          isPredictorMode ? 'border-sky-500/50 bg-sky-950/40 hover:border-sky-400' : 'border-white/10 bg-slate-900/80 hover:border-sky-400/50'
        }`}>
          <div className="text-[10px] text-sky-400 font-bold mb-1 px-1 flex justify-between uppercase tracking-wider">
            <span>{title}</span>
            {isPredictorMode && <span className="text-[8px] text-emerald-400">{t('advanceTeam')}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-8 md:h-7 bg-slate-800/50 rounded flex items-center overflow-hidden">
              {renderTeam(t1, matchId, winnerId === t1?.team?.id)}
            </div>
            <div className="h-8 md:h-7 bg-slate-800/50 rounded flex items-center overflow-hidden">
              {renderTeam(t2, matchId, winnerId === t2?.team?.id)}
            </div>
          </div>
        </div>
      </H2HTooltip>
    );
  };

  const tabs: { id: RoundTab; label: string; en: string }[] = [
    { id: 'R32', label: '16avos', en: 'Round of 32' },
    { id: 'R16', label: 'Octavos', en: 'Round of 16' },
    { id: 'QF', label: 'Cuartos', en: 'Quarter-Finals' },
    { id: 'SF', label: 'Semis', en: 'Semi-Finals' },
    { id: 'F', label: 'Final', en: 'Final' },
  ];

  return (
    <div className="w-full pb-8 relative">
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 sticky top-[60px] md:top-16 z-20 glass md:bg-transparent md:border-none p-4 md:p-0 border-b border-white/10 mx-[-1rem] px-[1rem] md:mx-0">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            {language === 'es' ? 'Mapa Eliminatorio' : 'Knockout Bracket'}
          </h2>
          <div className="hidden md:block h-px w-32 bg-gradient-to-r from-sky-500/50 to-transparent"></div>
        </div>

        <div className="flex items-center gap-4 md:bg-slate-900 md:p-2 md:rounded-xl md:border border-white/10 md:shadow-xl">
          <label className="flex items-center gap-2 cursor-pointer relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={isPredictorMode} 
              onChange={(e) => setIsPredictorMode(e.target.checked)}
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${isPredictorMode ? 'bg-sky-500' : 'bg-slate-700'}`}></div>
            <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${isPredictorMode ? 'translate-x-6' : ''}`}></div>
            <span className="font-bold text-sm mr-2">{t('predictorMode')}</span>
          </label>
          
          {isPredictorMode && (
            <button 
              onClick={resetPredictions}
              className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 font-semibold text-sm transition-colors border border-red-500/30"
            >
              {t('resetPredictions')}
            </button>
          )}
        </div>
      </div>

      {/* --- MOBILE TABS VIEW --- */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2 border-b border-white/10 sticky top-[130px] z-20 bg-[#0b1121] pt-2 mx-[-1rem] px-[1rem]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]' 
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {language === 'es' ? tab.label : tab.en}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12 px-2">
          {activeTab === 'R32' && (
            <>
              <MatchBox title="Match 73" matchId="M73" t1={m73.team1} t2={m73.team2} isMobile />
              <MatchBox title="Match 74" matchId="M74" t1={m74.team1} t2={m74.team2} isMobile />
              <MatchBox title="Match 75" matchId="M75" t1={m75.team1} t2={m75.team2} isMobile />
              <MatchBox title="Match 76" matchId="M76" t1={m76.team1} t2={m76.team2} isMobile />
              <MatchBox title="Match 77" matchId="M77" t1={m77.team1} t2={m77.team2} isMobile />
              <MatchBox title="Match 78" matchId="M78" t1={m78.team1} t2={m78.team2} isMobile />
              <MatchBox title="Match 79" matchId="M79" t1={m79.team1} t2={m79.team2} isMobile />
              <MatchBox title="Match 80" matchId="M80" t1={m80.team1} t2={m80.team2} isMobile />
              <MatchBox title="Match 81" matchId="M81" t1={m81.team1} t2={m81.team2} isMobile />
              <MatchBox title="Match 82" matchId="M82" t1={m82.team1} t2={m82.team2} isMobile />
              <MatchBox title="Match 83" matchId="M83" t1={m83.team1} t2={m83.team2} isMobile />
              <MatchBox title="Match 84" matchId="M84" t1={m84.team1} t2={m84.team2} isMobile />
              <MatchBox title="Match 85" matchId="M85" t1={m85.team1} t2={m85.team2} isMobile />
              <MatchBox title="Match 86" matchId="M86" t1={m86.team1} t2={m86.team2} isMobile />
              <MatchBox title="Match 87" matchId="M87" t1={m87.team1} t2={m87.team2} isMobile />
              <MatchBox title="Match 88" matchId="M88" t1={m88.team1} t2={m88.team2} isMobile />
            </>
          )}
          {activeTab === 'R16' && (
            <>
              <MatchBox title="Match 89" matchId="M89" t1={w74} t2={w77} isMobile />
              <MatchBox title="Match 90" matchId="M90" t1={w73} t2={w75} isMobile />
              <MatchBox title="Match 91" matchId="M91" t1={w76} t2={w78} isMobile />
              <MatchBox title="Match 92" matchId="M92" t1={w79} t2={w80} isMobile />
              <MatchBox title="Match 93" matchId="M93" t1={w83} t2={w84} isMobile />
              <MatchBox title="Match 94" matchId="M94" t1={w81} t2={w82} isMobile />
              <MatchBox title="Match 95" matchId="M95" t1={w86} t2={w88} isMobile />
              <MatchBox title="Match 96" matchId="M96" t1={w85} t2={w87} isMobile />
            </>
          )}
          {activeTab === 'QF' && (
            <>
              <MatchBox title="Match 97" matchId="M97" t1={w89} t2={w90} isMobile />
              <MatchBox title="Match 98" matchId="M98" t1={w93} t2={w94} isMobile />
              <MatchBox title="Match 99" matchId="M99" t1={w91} t2={w92} isMobile />
              <MatchBox title="Match 100" matchId="M100" t1={w95} t2={w96} isMobile />
            </>
          )}
          {activeTab === 'SF' && (
            <>
              <MatchBox title="SF 1 (M101)" matchId="M101" t1={w97} t2={w98} isMobile />
              <MatchBox title="SF 2 (M102)" matchId="M102" t1={w99} t2={w100} isMobile />
            </>
          )}
          {activeTab === 'F' && (
            <div className="p-1 rounded-xl bg-gradient-to-b from-amber-500/20 to-orange-600/20 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] mt-4">
              <div className="text-center text-3xl mb-2 mt-2">🏆</div>
              <MatchBox title="FINAL 2026" matchId="M104" t1={w101} t2={w102} isMobile />
            </div>
          )}
        </div>
      </div>

      {/* --- DESKTOP TREE VIEW --- */}
      <div className="hidden md:block overflow-x-auto w-full pb-8">
        <div className="min-w-[1200px] flex justify-between px-4 py-8 relative">
          {/* LEFT WING */}
          <div className="flex flex-col gap-6 w-1/5 justify-between">
            <div className="text-center font-bold text-slate-400 mb-2">Round of 32</div>
            <MatchBox title="Match 74" matchId="M74" t1={m74.team1} t2={m74.team2} />
            <MatchBox title="Match 77" matchId="M77" t1={m77.team1} t2={m77.team2} />
            <MatchBox title="Match 73" matchId="M73" t1={m73.team1} t2={m73.team2} />
            <MatchBox title="Match 75" matchId="M75" t1={m75.team1} t2={m75.team2} />
            <MatchBox title="Match 76" matchId="M76" t1={m76.team1} t2={m76.team2} />
            <MatchBox title="Match 78" matchId="M78" t1={m78.team1} t2={m78.team2} />
            <MatchBox title="Match 79" matchId="M79" t1={m79.team1} t2={m79.team2} />
            <MatchBox title="Match 80" matchId="M80" t1={m80.team1} t2={m80.team2} />
          </div>

          <div className="flex flex-col gap-12 w-1/5 justify-around pl-4">
            <div className="text-center font-bold text-slate-400 mb-2 mt-4">Round of 16</div>
            <MatchBox title="Match 89" matchId="M89" t1={w74} t2={w77} />
            <MatchBox title="Match 90" matchId="M90" t1={w73} t2={w75} />
            <MatchBox title="Match 91" matchId="M91" t1={w76} t2={w78} />
            <MatchBox title="Match 92" matchId="M92" t1={w79} t2={w80} />
          </div>

          {/* QUARTER FINALS (LEFT) */}
          <div className="flex flex-col gap-32 w-1/5 justify-around pl-4">
            <div className="text-center font-bold text-slate-400 mb-2 mt-8">Quarter-Finals</div>
            <MatchBox title="Match 97" matchId="M97" t1={w89} t2={w90} />
            <MatchBox title="Match 99" matchId="M99" t1={w91} t2={w92} />
          </div>

          {/* SEMI FINALS & FINAL (CENTER) */}
          <div className="flex flex-col justify-center items-center w-1/5 px-4 relative">
            <div className="absolute top-0 text-center font-bold text-amber-400 mb-2 mt-8">Semi-Finals & Final</div>
            
            <div className="mb-16">
              <MatchBox title="SF 1" matchId="M101" t1={w97} t2={w98} />
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-b from-amber-500/20 to-orange-600/20 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-16 relative scale-110">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">🏆</div>
              <MatchBox title="FINAL 2026" matchId="M104" t1={w101} t2={w102} />
            </div>

            <div>
              <MatchBox title="SF 2" matchId="M102" t1={w99} t2={w100} />
            </div>
          </div>

          {/* QUARTER FINALS (RIGHT) */}
          <div className="flex flex-col gap-32 w-1/5 justify-around pr-4 items-end">
            <div className="text-center font-bold text-slate-400 mb-2 mt-8">Quarter-Finals</div>
            <MatchBox title="Match 98" matchId="M98" t1={w93} t2={w94} />
            <MatchBox title="Match 100" matchId="M100" t1={w95} t2={w96} />
          </div>

          <div className="flex flex-col gap-12 w-1/5 justify-around pr-4 items-end">
            <div className="text-center font-bold text-slate-400 mb-2 mt-4">Round of 16</div>
            <MatchBox title="Match 93" matchId="M93" t1={w83} t2={w84} />
            <MatchBox title="Match 94" matchId="M94" t1={w81} t2={w82} />
            <MatchBox title="Match 95" matchId="M95" t1={w86} t2={w88} />
            <MatchBox title="Match 96" matchId="M96" t1={w85} t2={w87} />
          </div>

          {/* RIGHT WING */}
          <div className="flex flex-col gap-6 w-1/5 justify-between items-end">
            <div className="text-center font-bold text-slate-400 mb-2">Round of 32</div>
            <MatchBox title="Match 83" matchId="M83" t1={m83.team1} t2={m83.team2} />
            <MatchBox title="Match 84" matchId="M84" t1={m84.team1} t2={m84.team2} />
            <MatchBox title="Match 81" matchId="M81" t1={m81.team1} t2={m81.team2} />
            <MatchBox title="Match 82" matchId="M82" t1={m82.team1} t2={m82.team2} />
            <MatchBox title="Match 86" matchId="M86" t1={m86.team1} t2={m86.team2} />
            <MatchBox title="Match 88" matchId="M88" t1={m88.team1} t2={m88.team2} />
            <MatchBox title="Match 85" matchId="M85" t1={m85.team1} t2={m85.team2} />
            <MatchBox title="Match 87" matchId="M87" t1={m87.team1} t2={m87.team2} />
          </div>
        </div>
      </div>
    </div>
  );
}
