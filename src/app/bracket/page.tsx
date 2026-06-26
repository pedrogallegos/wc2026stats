import { fetchStandings, fetchMatches } from '@/services/api';
import { getRoundOf32Bracket } from '@/utils/tournament';
import FullBracket from '@/components/FullBracket';
import PageHeader from '@/components/PageHeader';
import Disclaimer from '@/components/Disclaimer';
import { applyLiveMatches } from '@/utils/liveStandings';

export default async function BracketPage() {
  const [data, matchesData] = await Promise.all([
    fetchStandings(),
    fetchMatches()
  ]);

  if (!data || !data.standings) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-8">
        <div className="glass p-8 rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Data Unavailable</h1>
          <p className="text-slate-400">Could not fetch standings data.</p>
        </div>
      </main>
    );
  }

  const liveStandings = data.standings && matchesData?.matches 
    ? applyLiveMatches(data.standings, matchesData.matches) 
    : data.standings;

  // Get the full 32-team bracket based on regulations
  const roundOf32Matches = getRoundOf32Bracket(liveStandings);

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 w-full animate-in fade-in duration-500 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        <PageHeader titleKey="knockoutMap" descKey="knockoutDesc" />
      </div>
      
      <Disclaimer />

      <div className="w-full">
        <FullBracket roundOf32={roundOf32Matches} />
      </div>
    </main>
  );
}
