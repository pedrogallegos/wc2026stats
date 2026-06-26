import { GroupStanding, Match, TableRow } from '@/types';

export function applyLiveMatches(standings: GroupStanding[], matches: Match[]): GroupStanding[] {
  const now = new Date();

  // Find all matches that are currently on the screen in LiveScoring
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const liveMatches = matches.filter(match => {
    // 1. Always include strictly LIVE matches
    if (match.status === 'IN_PLAY' || match.status === 'PAUSED') return true;
    
    // 2. Filter matches that are currently on the screen
    if (!match.utcDate) return false;
    const matchDate = new Date(match.utcDate);
    const isOnScreen = matchDate >= threeHoursAgo && matchDate <= fourHoursFromNow;
    
    if (!isOnScreen) return false;

    // 3. Include if it has a score but the status is weird or FINISHED (mock APIs)
    const hasScore = match.score?.fullTime?.home != null && match.score?.fullTime?.away != null;
    if (hasScore) {
      // ONLY include if we suspect it's a live match that the mock API mislabeled, 
      // or a recently finished match. We will apply it just to be safe.
      return true;
    }
    
    // 4. Include scheduled matches if they are past their start time
    if ((match.status === 'TIMED' || match.status === 'SCHEDULED') && matchDate <= now) {
      return true;
    }

    return false;
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
        // PREVENT DOUBLE COUNTING:
        // A team cannot play more than 3 games in the group stage.
        // If the API already counted 3 games, adding another match's stats is mathematically invalid (e.g. 10 or 12 points).
        // We must NEVER apply stats if they have already finished their 3 games in the official standings.
        if (homeRow.playedGames >= 3 || awayRow.playedGames >= 3) {
          return;
        }

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
