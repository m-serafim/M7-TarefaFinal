/**
 * Steam API Type Definitions
 * Defines interfaces for Steam API responses and application data models
 */

// Game data from Steam API
export interface SteamGame {
  appid: number;
  name: string;
  details?: SteamGameDetails; // Lazy-loaded details
}

// Detailed game information from Steam Store API
export interface SteamGameDetails {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  short_description: string;
  detailed_description: string;
  about_the_game: string;
  header_image: string;
  website: string | null;
  pc_requirements: {
    minimum: string;
    recommended?: string;
  };
  developers?: string[];
  publishers?: string[];
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  categories?: Array<{
    id: number;
    description: string;
  }>;
  genres?: Array<{
    id: string;
    description: string;
  }>;
  release_date: {
    coming_soon: boolean;
    date: string;
  };
}

// Response from GetAppList API (IStoreService/GetAppList/v1)
export interface GetAppListResponse {
  response: {
    apps: SteamGame[];
  };
}

// Response from appdetails API
export interface AppDetailsResponse {
  [appId: string]: {
    success: boolean;
    data?: SteamGameDetails;
  };
}

// Player count data
export interface PlayerCount {
  player_count: number;
  result: number;
}

export interface GetNumberOfCurrentPlayersResponse {
  response: PlayerCount;
}

// UI State types
export type UIState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

// Filter and sort options
export interface FilterOptions {
  genre?: string;
  isFree?: boolean;
  platform?: 'windows' | 'mac' | 'linux';
}

export interface SortOptions {
  field: 'name' | 'appid' | 'release_date' | 'popularity';
  order: 'asc' | 'desc';
}

// Pagination
export interface PaginationOptions {
  page: number;
  limit: number;
}

// Local storage data
export interface LocalStorageData {
  favorites: number[]; // Array of appids
  lastFilters?: FilterOptions;
  lastSort?: SortOptions;
  lastSearch?: string;
}

// Enhanced game data for UI
export interface EnhancedGame extends SteamGame {
  details?: SteamGameDetails;
  playerCount?: number;
  isFavorite?: boolean;
}
