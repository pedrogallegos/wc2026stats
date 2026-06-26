export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface TableRow {
  position: number;
  team: Team;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  groupName?: string; // Manually added during parsing
}

export interface GroupStanding {
  stage: string;
  type: string;
  group: string;
  table: TableRow[];
}



export interface Scorer {
  player: {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    section: string;
    position: string | null;
    shirtNumber: number | null;
  };
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedMatches: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

export interface ScorersResponse {
  count: number;
  filters: Record<string, string>;
  competition: Record<string, unknown>;
  season: Record<string, unknown>;
  scorers: Scorer[];
}

export interface FootballDataResponse {
  filters: Record<string, string>;
  competition: {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  };
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
  };
  standings: GroupStanding[];
}

export interface Match {
  id: number;
  status: 'TIMED' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'SCHEDULED' | string;
  matchday: number;
  utcDate?: string;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
    halfTime?: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface MatchesResponse {
  filters: Record<string, string>;
  resultSet: Record<string, unknown>;
  competition: Record<string, unknown>;
  matches: Match[];
}
