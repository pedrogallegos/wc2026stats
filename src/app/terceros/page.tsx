import { fetchStandings, fetchMatches } from '@/services/api';
import { getQualifiedTeams, getBestThirdPlaceTeams } from '@/utils/tournament';
import ThirdPlaceTable from '@/components/ThirdPlaceTable';
import PageHeader from '@/components/PageHeader';
import { applyLiveMatches } from '@/utils/liveStandings';

export default async function ThirdPlacesPage() {
  const [data, matchesData] = await Promise.all([
    fetchStandings(),
    fetchMatches()
  ]);

  if (!data || !data.standings) return null;

  const liveStandings = data.standings && matchesData?.matches 
    ? applyLiveMatches(data.standings, matchesData.matches) 
    : data.standings;

  const { thirdPlaces } = getQualifiedTeams(liveStandings);
  const { qualified, eliminated } = getBestThirdPlaceTeams(thirdPlaces);

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <PageHeader titleKey="thirdPlaces" descKey="thirdPlacesDesc" />

      <ThirdPlaceTable qualified={qualified} eliminated={eliminated} />
    </main>
  );
}
