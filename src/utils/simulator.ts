import { GroupStanding, TableRow } from '@/types';

// Simulate a realistic match outcome between two teams based on their offensive weight
function simulateMatch(teamA: TableRow, teamB: TableRow) {
  // Use goalsFor as an offensive weight (add 1 to avoid 0 probability)
  const weightA = (teamA.goalsFor || 0) + 1;
  const weightB = (teamB.goalsFor || 0) + 1;
  
  // Generate random goals loosely based on their offensive weight
  const goalsA = Math.round((Math.random() * 1.5) * (weightA / 1.5));
  const goalsB = Math.round((Math.random() * 1.5) * (weightB / 1.5));
  
  teamA.playedGames += 1;
  teamB.playedGames += 1;
  
  teamA.goalsFor += goalsA;
  teamA.goalsAgainst += goalsB;
  teamA.goalDifference = teamA.goalsFor - teamA.goalsAgainst;
  
  teamB.goalsFor += goalsB;
  teamB.goalsAgainst += goalsA;
  teamB.goalDifference = teamB.goalsFor - teamB.goalsAgainst;
  
  if (goalsA > goalsB) {
    teamA.won += 1;
    teamA.points += 3;
    teamB.lost += 1;
  } else if (goalsA < goalsB) {
    teamB.won += 1;
    teamB.points += 3;
    teamA.lost += 1;
  } else {
    teamA.draw += 1;
    teamB.draw += 1;
    teamA.points += 1;
    teamB.points += 1;
  }
}

export function simulateRemainingMatches(standings: GroupStanding[]): GroupStanding[] {
  // Clone standings to avoid mutating the original response directly
  const simulatedStandings = JSON.parse(JSON.stringify(standings)) as GroupStanding[];
  
  for (const group of simulatedStandings) {
    const teams = group.table;
    if (teams && teams.length === 4) {
      // If teams have only played 2 games, simulate the 3rd matchday
      if (teams.every(t => t.playedGames === 2)) {
        // Simulate match: 1st vs 2nd, and 3rd vs 4th (typical group deciders)
        simulateMatch(teams[0], teams[1]);
        simulateMatch(teams[2], teams[3]);
        
        // Re-sort the group table according to standard FIFA tiebreakers
        teams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        });
        
        // Re-assign positions
        teams.forEach((t, i) => t.position = i + 1);
      }
    }
  }
  
  return simulatedStandings;
}
