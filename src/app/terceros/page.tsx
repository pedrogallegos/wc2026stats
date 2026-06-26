import { fetchStandings } from '@/services/api';
import { getQualifiedTeams, getBestThirdPlaceTeams } from '@/utils/tournament';
import ThirdPlaceTable from '@/components/ThirdPlaceTable';
import PageHeader from '@/components/PageHeader';

export default async function ThirdPlacesPage() {
  const data = await fetchStandings();

  if (!data || !data.standings) return null;

  const { thirdPlaces } = getQualifiedTeams(data.standings);
  const { qualified, eliminated } = getBestThirdPlaceTeams(thirdPlaces);

  return (
    <main className="p-4 md:p-8 lg:p-12 pb-24 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <PageHeader titleKey="thirdPlaces" descKey="thirdPlacesDesc" />

      <ThirdPlaceTable qualified={qualified} eliminated={eliminated} />
    </main>
  );
}
