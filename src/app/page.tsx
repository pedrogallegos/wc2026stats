import { fetchStandings, fetchMatches } from '@/services/api';
import StandingsTable from '@/components/StandingsTable';
import PageHeader from '@/components/PageHeader';
import LiveScoring from '@/components/LiveScoring';
import { applyLiveMatches } from '@/utils/liveStandings';

export default async function GroupsPage() {
  const [data, matchesData] = await Promise.all([
    fetchStandings(),
    fetchMatches()
  ]);

  if (!data || !data.standings) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="glass p-8 rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Data Unavailable</h1>
          <p className="text-slate-400">Could not fetch standings data from football-data.org. Please check your API configuration or try again later.</p>
        </div>
      </main>
    );
  }

  const liveStandings = matchesData?.matches 
    ? applyLiveMatches(data.standings, matchesData.matches) 
    : data.standings;

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      
      {matchesData?.matches && <LiveScoring matches={matchesData.matches} />}
      
      <PageHeader titleKey="groupStage" descKey="groupStageDesc" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
        {liveStandings.filter(g => g.type === 'TOTAL').map((group, index) => (
          <StandingsTable key={index} groupStanding={group} />
        ))}
      </div>
    </main>
  );
}
