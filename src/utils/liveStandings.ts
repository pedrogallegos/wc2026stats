import { GroupStanding, Match, TableRow } from '@/types';

export function applyLiveMatches(standings: GroupStanding[], matches: Match[]): GroupStanding[] {
  const now = new Date();

  // Find all matches that are currently "Live" and not yet finished (so not in official standings)
  const liveMatches = matches.filter(match => {
    const matchDate = match.utcDate ? new Date(match.utcDate) : null;
    const isLive = match.status === 'IN_PLAY' || 
                   match.status === 'PAUSED' || 
                   ((match.status === 'TIMED' || match.status === 'SCHEDULED') && matchDate && matchDate <= now);
    
    // Also include FINISHED matches if they happened in the last 4 hours (fallback for mock APIs that don't update standings)
    const recentlyFinished = match.status === 'FINISHED' && matchDate && (now.getTime() - matchDate.getTime()) < 4 * 60 * 60 * 1000;
                   
    return isLive || recentlyFinished;
  });

  if (liveMatches.length === 0) return standings;

  // Deep clone the standings so we don't mutate the original fetched data
  const updatedStandings = JSON.parse(JSON.stringify(standings)) as GroupStanding[];

  liveMatches.forEach(match => {
    const homeGoals = match.score?.fullTime?.home ?? 0;
    const awayGoals = match.score?.fullTime?.away ?? 0;

    // Find the group containing the home team (assuming both teams are in the same group)
    const group = updatedStandings.find(g => g.table.some(row => row.team.id === match.homeTeam.id));
    
    if (group) {
      const homeRow = group.table.find(row => row.team.id === match.homeTeam.id);
      const awayRow = group.table.find(row => row.team.id === match.awayTeam.id);

      if (homeRow && awayRow) {
        // Apply goals
        homeRow.goalsFor += homeGoals;
        homeRow.goalsAgainst += awayGoals;
        homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;

        awayRow.goalsFor += awayGoals;
        awayRow.goalsAgainst += homeGoals;
        awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;

        // Apply results
        if (homeGoals > awayGoals) {
          homeRow.won += 1;
          homeRow.points += 3;
          awayRow.lost += 1;
        } else if (homeGoals < awayGoals) {
          awayRow.won += 1;
          awayRow.points += 3;
          homeRow.lost += 1;
        } else {
          homeRow.draw += 1;
          homeRow.points += 1;
          awayRow.draw += 1;
          awayRow.points += 1;
        }

        // We do NOT increment playedGames to avoid messing up external UI logic, 
        // or we could increment it. Let's increment it so the user sees P: 3.
        // Actually, if the base API already had P: 3 but didn't update points, incrementing makes it P: 4.
        // Let's only increment if it's strictly < 3.
        if (homeRow.playedGames < 3) homeRow.playedGames += 1;
        if (awayRow.playedGames < 3) awayRow.playedGames += 1;
      }

      // Re-sort the group table
      group.table.sort((a, b) => {
        // 1. Points
        if (b.points !== a.points) return b.points - a.points;
        // 2. Goal Difference
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        // 3. Goals Scored
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return 0;
      });

      // Re-assign positions
      group.table.forEach((row, index) => {
        row.position = index + 1;
      });
    }
  });

  return updatedStandings;
}
