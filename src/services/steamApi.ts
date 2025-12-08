/**
 * Steam API Service
 * Handles all Steam API requests with robust error handling
 */

import type {
  SteamGame,
  SteamGameDetails,
  GetAppListResponse,
  AppDetailsResponse,
  GetNumberOfCurrentPlayersResponse
} from '../types';

const API_KEY = import.meta.env.VITE_STEAM_API_KEY;
const REQUEST_TIMEOUT = 8000; // 8 seconds

/**
 * Fetch with timeout and AbortController
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Response
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty data for 404
        return new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
    }
    throw error;
  }
};

/**
 * Normalize API response to ensure consistent data structure
 * @param data - Raw API response
 * @returns Normalized data
 */
const normalizeResponse = <T>(data: any): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data && data.applist && Array.isArray(data.applist.apps)) {
    return data.applist.apps;
  }
  return [];
};

/**
 * Get list of all Steam games
 * @param signal - AbortSignal for cancellation
 * @returns Array of games
 */
export const getAppList = async (signal?: AbortSignal): Promise<SteamGame[]> => {
  try {
    const url = `/api/steam/ISteamApps/GetAppList/v2/?key=${API_KEY}`;
    const response = await fetchWithTimeout(url, { signal });
    const data: GetAppListResponse = await response.json();
    
    return normalizeResponse<SteamGame>(data);
  } catch (error) {
    console.error('Error fetching app list:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific game
 * @param appid - Game appid
 * @param signal - AbortSignal for cancellation
 * @returns Game details
 */
export const getAppDetails = async (
  appid: number,
  signal?: AbortSignal
): Promise<SteamGameDetails | null> => {
  try {
    const url = `/api/steamstore/api/appdetails?appids=${appid}&l=portuguese`;
    const response = await fetchWithTimeout(url, { signal });
    const data: AppDetailsResponse = await response.json();
    
    const appData = data[appid.toString()];
    if (appData && appData.success && appData.data) {
      return appData.data;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching details for app ${appid}:`, error);
    return null;
  }
};

/**
 * Get current player count for a game
 * @param appid - Game appid
 * @param signal - AbortSignal for cancellation
 * @returns Player count
 */
export const getPlayerCount = async (
  appid: number,
  signal?: AbortSignal
): Promise<number | null> => {
  try {
    const url = `/api/steam/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${API_KEY}&appid=${appid}`;
    const response = await fetchWithTimeout(url, { signal });
    const data: GetNumberOfCurrentPlayersResponse = await response.json();
    
    if (data.response && typeof data.response.player_count === 'number') {
      return data.response.player_count;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching player count for app ${appid}:`, error);
    return null;
  }
};

/**
 * Search games by name (client-side filtering)
 * @param games - Array of games to search
 * @param query - Search query
 * @returns Filtered games
 */
export const searchGames = (games: SteamGame[], query: string): SteamGame[] => {
  if (!query || query.trim() === '') {
    return games;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  return games.filter(game => 
    game.name.toLowerCase().includes(lowerQuery)
  );
};
