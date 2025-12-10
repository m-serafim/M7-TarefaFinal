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
import { CONFIG } from '../constants';

const API_KEY = CONFIG.STEAM_API_KEY || 'F00809147D68F4B802F8D6222E404F8A';
const REQUEST_TIMEOUT = CONFIG.REQUEST_TIMEOUT;

// Debug: Check if API key is loaded
console.log('Steam API Key loaded:', API_KEY ? 'YES (length: ' + API_KEY.length + ')' : 'NO - EMPTY!');
console.log('Environment variable value:', import.meta.env.VITE_STEAM_API_KEY);
console.log('Timeout configured to:', REQUEST_TIMEOUT, 'ms');

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
 * Get list of all Steam games
 * @param signal - AbortSignal for cancellation
 * @returns Array of games (popular games first if enabled)
 */
export const getAppList = async (signal?: AbortSignal): Promise<SteamGame[]> => {
  try {
    const startTime = Date.now();
    let allGames: SteamGame[] = [];

    // Step 1: Fetch popular games first if enabled
    if (CONFIG.PRIORITIZE_POPULAR_GAMES) {
      console.log('[getAppList] Fetching popular games first...');
      const { POPULAR_GAME_APPIDS } = await import('../constants/popularGames');

      // Deduplicate popular App IDs first
      const uniquePopularAppIds = Array.from(new Set(POPULAR_GAME_APPIDS));

      // Fetch popular games in batches to avoid overwhelming the API
      const batchSize = 20;
      const popularGames: SteamGame[] = [];

      for (let i = 0; i < uniquePopularAppIds.length; i += batchSize) {
        if (signal?.aborted) break;

        const batch = uniquePopularAppIds.slice(i, i + batchSize);
        const batchPromises = batch.map(appid =>
          getGameById(appid, signal).catch(err => {
            console.warn(`Failed to fetch popular game ${appid}:`, err);
            return null;
          })
        );

        const results = await Promise.all(batchPromises);
        const validGames = results.filter((game): game is SteamGame => game !== null);
        popularGames.push(...validGames);

        console.log(`[getAppList] Fetched batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(uniquePopularAppIds.length / batchSize)}: ${validGames.length} games`);
      }

      console.log(`[getAppList] Loaded ${popularGames.length} popular games in ${Date.now() - startTime}ms`);
      allGames = popularGames;
    }

    // Step 2: Fetch remaining games from the standard API
    const url = `/api/steam/IStoreService/GetAppList/v1/?key=${API_KEY}&include_games=true`;

    console.log('[getAppList] Fetching full game list from API:', url);
    const response = await fetchWithTimeout(url, {
      signal,
      mode: 'cors',
    });

    console.log('[getAppList] Response received in', Date.now() - startTime, 'ms, status:', response.status);

    const data: GetAppListResponse = await response.json();
    console.log('[getAppList] Data parsed, apps count:', data?.response?.apps?.length || 0);

    // Get the API games
    let apiGames: SteamGame[] = [];
    if (data && data.response && Array.isArray(data.response.apps)) {
      apiGames = data.response.apps;
    }

    // Step 3: Combine popular games with API games (remove duplicates)
    if (CONFIG.PRIORITIZE_POPULAR_GAMES && allGames.length > 0) {
      const popularAppIds = new Set(allGames.map(g => g.appid));
      // Further filter apiGames to ensure no collisions
      const remainingGames = apiGames.filter(g => !popularAppIds.has(g.appid));

      allGames = [...allGames, ...remainingGames];
      console.log(`[getAppList] Combined: ${allGames.length} total games (${popularAppIds.size} popular + ${remainingGames.length} remaining)`);
    } else {
      allGames = apiGames;
    }

    // Step 4: Apply max games limit if configured
    if (CONFIG.MAX_GAMES_TO_LOAD > 0 && allGames.length > CONFIG.MAX_GAMES_TO_LOAD) {
      console.log(`[getAppList] Limiting games from ${allGames.length} to ${CONFIG.MAX_GAMES_TO_LOAD}`);
      allGames = allGames.slice(0, CONFIG.MAX_GAMES_TO_LOAD);
    }

    console.log(`[getAppList] Completed in ${Date.now() - startTime}ms, returning ${allGames.length} games`);
    return allGames;
  } catch (error) {
    console.error('Error fetching app list:', error);
    throw error;
  }
};

/**
 * Get a single game by App ID
 * @param appid - Game appid to fetch
 * @param signal - AbortSignal for cancellation
 * @returns Single game object
 */
export const getGameById = async (appid: number, signal?: AbortSignal): Promise<SteamGame | null> => {
  try {
    // Fetch game details which includes the name
    const details = await getAppDetails(appid, signal);

    if (details && details.name) {
      return {
        appid: appid,
        name: details.name,
        details: details
      };
    }

    return null;
  } catch (error) {
    console.error('[getGameById] Error fetching game:', error);
    throw error;
  }
};

/**
 * Get detailed information about multiple games
 * Attempts to batch requests if possible, or runs them in parallel
 * @param appids - Array of game appids
 * @param signal - AbortSignal for cancellation
 * @returns Map of appid to details
 */
export const getManyGameDetails = async (
  appids: number[],
  signal?: AbortSignal
): Promise<Record<number, SteamGameDetails | null>> => {
  if (appids.length === 0) return {};

  try {
    // Steam Store API supports comma-separated appids
    // However, we should be careful about URL length and rate limits
    // Batching 20 at a time is usually safe
    const batches: number[][] = [];
    const BATCH_SIZE = 10; // Reduced from 20 to avoid rate limits and large payloads

    for (let i = 0; i < appids.length; i += BATCH_SIZE) {
      batches.push(appids.slice(i, i + BATCH_SIZE));
    }

    const results: Record<number, SteamGameDetails | null> = {};

    // Process batches sequentially to respect rate limits
    for (const batch of batches) {
      if (signal?.aborted) break;

      try {
        const ids = batch.join(',');
        const url = `/api/steamstore/api/appdetails?appids=${ids}&l=english`;

        // Add a small delay between batches (250ms)
        if (batches.indexOf(batch) > 0) {
          await new Promise(resolve => setTimeout(resolve, 250));
        }

        const response = await fetchWithTimeout(url, {
          signal,
          mode: 'cors',
        });

        // If rate limited, wait longer and retry or just fail smoothly
        if (response.status === 429) {
          console.warn(`[getManyGameDetails] Rate limit hit for batch, waiting...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Retry once? Or just skip. For now, try to proceed if possible or just fail batch.
          // Proceed to failure block
          throw new Error('Rate limit exceeded');
        }

        const data: AppDetailsResponse = await response.json();

        batch.forEach(id => {
          const appData = data[id.toString()];
          if (appData && appData.success && appData.data) {
            results[id] = appData.data;
          } else {
            results[id] = null;
          }
        });
      } catch (error) {
        console.warn(`[getManyGameDetails] Failed to fetch batch ${batch}:`, error);
        batch.forEach(id => { results[id] = null; });
      }
    }

    return results;

  } catch (error) {
    console.error(`Error fetching details for multiple apps:`, error);
    return {};
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
  // Reuse the batch logic for single item consistency
  const results = await getManyGameDetails([appid], signal);
  return results[appid] || null;
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

    const response = await fetchWithTimeout(url, {
      signal,
      mode: 'cors',
    });
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
