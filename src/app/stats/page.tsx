import { fetchStandings, fetchScorers } from '@/services/api';
import { TableRow } from '@/types';
import PageHeader from '@/components/PageHeader';
import T from '@/components/T';
import TTeam from '@/components/TTeam';

export default async function StatsPage() {
  const standingsData = await fetchStandings();
  const scorersData = await fetchScorers();

  if (!standingsData || !scorersData) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="glass p-8 rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Data Unavailable</h1>
          <p className="text-slate-400">Could not fetch statistics data.</p>
        </div>
      </main>
    );
  }

  // Flatten all teams from the group stages to analyze stats
  const allTeams: TableRow[] = [];
  standingsData.standings.filter(g => g.type === 'TOTAL').forEach(group => {
    if (group.table) allTeams.push(...group.table);
  });

  // Most Goals Scored
  const bestOffense = [...allTeams].sort((a, b) => b.goalsFor - a.goalsFor).slice(0, 10);
  
  // Least Goals Conceded
  const bestDefense = [...allTeams].sort((a, b) => {
    // If goals against are tied, break tie by goals scored
    if (a.goalsAgainst !== b.goalsAgainst) return a.goalsAgainst - b.goalsAgainst;
    return b.goalsFor - a.goalsFor;
  }).slice(0, 10);

  const topScorers = scorersData.scorers;

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      <PageHeader titleKey="stats" descKey="statsDesc" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Scorers */}
        <div className="glass rounded-xl overflow-hidden border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
          <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 px-5 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              ⚽ <T tKey="topScorers" />
            </h2>
          </div>
          <div className="p-4">
            <ul className="flex flex-col gap-3">
              {topScorers.map((scorer, idx) => (
                <li key={scorer.player.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                    <img src={scorer.team.crest} alt={scorer.team.name} className="w-8 h-8 object-contain bg-white rounded-full p-1 border border-white/20" />
                    <div>
                      <p className="font-bold text-slate-100">{scorer.player.name}</p>
                      <p className="text-xs text-slate-400"><TTeam name={scorer.team.name} /></p>
                    </div>
                  </div>
                  <div className="text-xl font-black text-amber-400 w-8 text-center">{scorer.goals}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best Offense */}
        <div className="glass rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
          <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 px-5 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              🔥 <T tKey="bestOffense" />
            </h2>
          </div>
          <div className="p-4">
            <ul className="flex flex-col gap-3">
              {bestOffense.map((row, idx) => (
                <li key={row.team.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                    <img src={row.team.crest} alt={row.team.name} className="w-8 h-8 object-contain bg-white rounded-full p-1 border border-white/20" />
                    <span className="font-bold text-slate-100"><TTeam name={row.team.name} /></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400"><T tKey="goalsScored" />:</span>
                    <div className="text-xl font-black text-emerald-400 w-8 text-center">{row.goalsFor}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Best Defense */}
        <div className="glass rounded-xl overflow-hidden border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.05)]">
          <div className="bg-gradient-to-r from-sky-900/50 to-blue-900/50 px-5 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2">
              🛡️ <T tKey="bestDefense" />
            </h2>
          </div>
          <div className="p-4">
            <ul className="flex flex-col gap-3">
              {bestDefense.map((row, idx) => (
                <li key={row.team.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono w-4">{idx + 1}</span>
                    <img src={row.team.crest} alt={row.team.name} className="w-8 h-8 object-contain bg-white rounded-full p-1 border border-white/20" />
                    <span className="font-bold text-slate-100"><TTeam name={row.team.name} /></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400"><T tKey="goalsConceded" />:</span>
                    <div className="text-xl font-black text-sky-400 w-8 text-center">{row.goalsAgainst}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
