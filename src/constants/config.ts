/**
 * Application Configuration Constants
 */

export const CONFIG = {
  // API Configuration
  STEAM_API_KEY: import.meta.env.VITE_STEAM_API_KEY || '',
  REQUEST_TIMEOUT: 15000, // 15 seconds (Steam API can be slow with large responses)

  // Game Loading Configuration
  PRIORITIZE_POPULAR_GAMES: true, // Load popular games first
  MAX_GAMES_TO_LOAD: 10000, // Maximum total games to load (0 = unlimited)

  // Pagination Defaults
  DEFAULT_PAGE_SIZE: 20,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,

  // Debounce Delays
  SEARCH_DEBOUNCE_MS: 400,

  // LocalStorage Keys
  STORAGE_KEY: 'steam-games-browser',

  // API Endpoints
  API_PATHS: {
    APP_LIST: '/api/steam/ISteamApps/GetAppList/v2',
    APP_DETAILS: '/api/steamstore/api/appdetails',
    PLAYER_COUNT: '/api/steam/ISteamUserStats/GetNumberOfCurrentPlayers/v1',
  }
} as const;
