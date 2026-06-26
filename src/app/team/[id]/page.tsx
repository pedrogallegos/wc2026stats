import React from 'react';
import { fetchStandings, fetchMatches } from '@/services/api';
import { TableRow } from '@/types';
import TTeam from '@/components/TTeam';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [standingsData, matchesData] = await Promise.all([
    fetchStandings(),
    fetchMatches()
  ]);

  if (!standingsData) {
    return <div className="text-center p-12">Data unavailable</div>;
  }

  let teamInfo: TableRow | null = null;
  let groupName = '';

  for (const group of standingsData.standings) {
    if (group.type === 'TOTAL' && group.table) {
      const found = group.table.find(r => r.team.tla === id.toUpperCase() || r.team.id.toString() === id);
      if (found) {
        teamInfo = found;
        groupName = group.group.replace('Group ', 'Grupo ');
        break;
      }
    }
  }

  if (!teamInfo) {
    return <div className="text-center p-12">Team not found</div>;
  }

  const teamMatches = matchesData?.matches?.filter(m => m.homeTeam?.id === teamInfo?.team.id || m.awayTeam?.id === teamInfo?.team.id) || [];

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1000px] mx-auto w-full animate-in fade-in duration-500">
      <div className="glass rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-500/20 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <img src={teamInfo.team.crest} alt={teamInfo.team.name} className="w-32 h-32 object-contain bg-white rounded-full p-2 border-4 border-white/20 shadow-2xl" />
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2"><TTeam name={teamInfo.team.name} /></h1>
            <p className="text-xl text-sky-400 font-bold">{groupName} • {teamInfo.team.tla}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">Tournament Record</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
              <div className="text-3xl font-black text-white">{teamInfo.playedGames}</div>
              <div className="text-xs text-slate-400 uppercase mt-1">Played</div>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
              <div className="text-3xl font-black text-emerald-400">{teamInfo.won}</div>
              <div className="text-xs text-emerald-400/70 uppercase mt-1">Won</div>
            </div>
            <div className="bg-sky-500/10 p-4 rounded-lg border border-sky-500/20">
              <div className="text-3xl font-black text-sky-400">{teamInfo.points}</div>
              <div className="text-xs text-sky-400/70 uppercase mt-1">Points</div>
            </div>
            <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
              <div className="text-3xl font-black text-amber-400">{teamInfo.goalsFor}</div>
              <div className="text-xs text-amber-400/70 uppercase mt-1">Goals For</div>
            </div>
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <div className="text-3xl font-black text-red-400">{teamInfo.goalsAgainst}</div>
              <div className="text-xs text-red-400/70 uppercase mt-1">Goals Against</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/5">
              <div className="text-3xl font-black text-white">{teamInfo.goalDifference > 0 ? `+${teamInfo.goalDifference}` : teamInfo.goalDifference}</div>
              <div className="text-xs text-slate-400 uppercase mt-1">Difference</div>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-sky-400 mb-6">Recent Matches</h2>
          <div className="flex flex-col gap-3">
            {teamMatches.length > 0 ? teamMatches.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <img src={m.homeTeam.crest} className="w-5 h-5" />
                  <span className={m.homeTeam.id === teamInfo?.team.id ? 'font-bold text-sky-300' : ''}>{m.homeTeam.tla}</span>
                </div>
                <div className="px-3 py-1 bg-black/40 rounded font-mono font-bold text-white">
                  {m.score?.fullTime?.home ?? 0} - {m.score?.fullTime?.away ?? 0}
                </div>
                <div className="flex items-center gap-2">
                  <span className={m.awayTeam.id === teamInfo?.team.id ? 'font-bold text-sky-300' : ''}>{m.awayTeam.tla}</span>
                  <img src={m.awayTeam.crest} className="w-5 h-5" />
                </div>
              </div>
            )) : (
              <div className="text-slate-400 text-center py-8">No match data available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
