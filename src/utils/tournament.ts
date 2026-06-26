import { GroupStanding, TableRow } from '@/types';
import fifaMatrixData from './fifa_matrix.json';

const fifaMatrix: Record<string, Record<string, string>> = fifaMatrixData;

// Extract 1st, 2nd, and 3rd place teams
export function getQualifiedTeams(standings: GroupStanding[]) {
  const firstPlaces: Record<string, TableRow> = {};
  const secondPlaces: Record<string, TableRow> = {};
  const thirdPlaces: TableRow[] = [];

  for (const group of standings) {
    if (group.table && group.table.length > 0) {
      const groupLetter = group.group.replace(/Group\s?_?/i, '').trim();
      
      const first = group.table[0];
      if (first) firstPlaces[groupLetter] = { ...first, groupName: groupLetter };
      
      const second = group.table[1];
      if (second) secondPlaces[groupLetter] = { ...second, groupName: groupLetter };
      
      const third = group.table[2];
      if (third) thirdPlaces.push({ ...third, groupName: groupLetter });
    }
  }

  return { firstPlaces, secondPlaces, thirdPlaces };
}

export function getBestThirdPlaceTeams(thirdPlaces: TableRow[]): { qualified: TableRow[], eliminated: TableRow[] } {
  const sorted = [...thirdPlaces].sort((a, b) => {
    const ptsA = Number(a.points) || 0;
    const ptsB = Number(b.points) || 0;
    if (ptsA !== ptsB) return ptsB - ptsA;
    
    const gdA = Number(a.goalDifference) || 0;
    const gdB = Number(b.goalDifference) || 0;
    if (gdA !== gdB) return gdB - gdA;
    
    const gfA = Number(a.goalsFor) || 0;
    const gfB = Number(b.goalsFor) || 0;
    return gfB - gfA;
  });

  return {
    qualified: sorted.slice(0, 8),
    eliminated: sorted.slice(8)
  };
}

export function allocateThirdPlaces(thirdTeams: TableRow[], firstPlaces: Record<string, TableRow>): Record<string, TableRow> {
  const assignment: Record<string, TableRow> = {};
  
  // If we don't have exactly 8 teams, return empty mapping to avoid crashes during early stages
  if (thirdTeams.length !== 8) {
    return assignment;
  }

  // Create the key by sorting the 8 group letters alphabetically
  const letters = thirdTeams.map(t => t.groupName).sort().join('');
  
  // Lookup the exact FIFA mapping for this combination
  const mapping = fifaMatrix[letters];
  
  if (!mapping) {
    console.error('FIFA Matrix mapping not found for combination:', letters);
    return assignment;
  }

  // mapping is like: { "1A": "3E", "1B": "3J", ... } meaning 1A plays 3E
  // So assignment['A'] should be the team from group 'E'
  for (const [slot, opponentGroup] of Object.entries(mapping)) {
    // slot is like "1A", so we extract "A"
    const leaderGroup = slot.replace('1', '');
    // opponentGroup is like "3E", so we extract "E"
    const thirdGroup = opponentGroup.replace('3', '');
    
    const team = thirdTeams.find(t => t.groupName === thirdGroup);
    if (team) {
      assignment[leaderGroup] = team;
    }
  }

  return assignment;
}

export interface Match32 {
  id: string;
  team1: TableRow | { label: string };
  team2: TableRow | { label: string };
}

// Generate the 16 matches for Round of 32 based on FIFA Regulations
export function getRoundOf32Bracket(standings: GroupStanding[]): Match32[] {
  const { firstPlaces, secondPlaces, thirdPlaces } = getQualifiedTeams(standings);
  const { qualified } = getBestThirdPlaceTeams(thirdPlaces);
  
  const thirdsAssigned = allocateThirdPlaces(qualified, firstPlaces);

  const getTeam = (source: TableRow | undefined, fallback: string) => source || { label: fallback };

  // Matchups according to regulations page 23-24
  const matches: Match32[] = [
    { id: 'M73', team1: getTeam(secondPlaces['A'], '2A'), team2: getTeam(secondPlaces['B'], '2B') },
    { id: 'M74', team1: getTeam(firstPlaces['E'], '1E'), team2: getTeam(thirdsAssigned['E'], '3rd ABCDF') },
    { id: 'M75', team1: getTeam(firstPlaces['F'], '1F'), team2: getTeam(secondPlaces['C'], '2C') },
    { id: 'M76', team1: getTeam(firstPlaces['C'], '1C'), team2: getTeam(secondPlaces['F'], '2F') },
    { id: 'M77', team1: getTeam(firstPlaces['I'], '1I'), team2: getTeam(thirdsAssigned['I'], '3rd CDFGH') },
    { id: 'M78', team1: getTeam(secondPlaces['E'], '2E'), team2: getTeam(secondPlaces['I'], '2I') },
    { id: 'M79', team1: getTeam(firstPlaces['A'], '1A'), team2: getTeam(thirdsAssigned['A'], '3rd CEFHI') },
    { id: 'M80', team1: getTeam(firstPlaces['L'], '1L'), team2: getTeam(thirdsAssigned['L'], '3rd EHIJK') },
    
    { id: 'M81', team1: getTeam(firstPlaces['D'], '1D'), team2: getTeam(thirdsAssigned['D'], '3rd BEFIJ') },
    { id: 'M82', team1: getTeam(firstPlaces['G'], '1G'), team2: getTeam(thirdsAssigned['G'], '3rd AEHIJ') },
    { id: 'M83', team1: getTeam(secondPlaces['K'], '2K'), team2: getTeam(secondPlaces['L'], '2L') },
    { id: 'M84', team1: getTeam(firstPlaces['H'], '1H'), team2: getTeam(secondPlaces['J'], '2J') },
    { id: 'M85', team1: getTeam(firstPlaces['B'], '1B'), team2: getTeam(thirdsAssigned['B'], '3rd EFGIJ') },
    { id: 'M86', team1: getTeam(firstPlaces['J'], '1J'), team2: getTeam(secondPlaces['H'], '2H') },
    { id: 'M87', team1: getTeam(firstPlaces['K'], '1K'), team2: getTeam(thirdsAssigned['K'], '3rd DEIJL') },
    { id: 'M88', team1: getTeam(secondPlaces['D'], '2D'), team2: getTeam(secondPlaces['G'], '2G') }
  ];

  return matches;
}
