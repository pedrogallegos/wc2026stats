import { FootballDataResponse, ScorersResponse, MatchesResponse } from '@/types';

const API_URL = process.env.API_URL || 'https://api.football-data.org/v4';
const API_KEY = process.env.API_KEY;

export async function fetchStandings(): Promise<FootballDataResponse | null> {
  if (!API_KEY) {
    console.error('[API] API_KEY is not set');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/competitions/WC/standings`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY,
      },
      // Cache for 60 seconds to avoid rate limiting across multiple endpoints
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: FootballDataResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch standings from football-data.org:', error);
    return null;
  }
}

export async function fetchScorers(): Promise<ScorersResponse | null> {
  if (!API_KEY) return null;

  try {
    const response = await fetch(`${API_URL}/competitions/WC/scorers`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY,
      },
      // Cache scorers for 60 seconds (rarely changes)
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: ScorersResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch scorers from football-data.org:', error);
    return null;
  }
}

export async function fetchMatches(): Promise<MatchesResponse | null> {
  if (!API_KEY) return null;

  try {
    // Get matches for today or currently IN_PLAY
    const response = await fetch(`${API_URL}/competitions/WC/matches`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY,
      },
      // Cache matches for 60 seconds
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: MatchesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[API] Failed to fetch matches from football-data.org:', error);
    return null;
  }
}
