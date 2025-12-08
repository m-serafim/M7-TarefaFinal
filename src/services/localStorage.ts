/**
 * LocalStorage Service
 * Handles persistence of favorites and user preferences
 */

import type { FilterOptions, SortOptions, LocalStorageData } from '../types';
import { CONFIG } from '../constants';

const STORAGE_KEY = CONFIG.STORAGE_KEY;

/**
 * Get data from localStorage
 * @returns LocalStorageData or default values
 */
export const getLocalStorage = (): LocalStorageData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return {
    favorites: [],
    lastFilters: undefined,
    lastSort: undefined,
    lastSearch: undefined
  };
};

/**
 * Save data to localStorage
 * @param data - Data to save
 */
export const saveLocalStorage = (data: Partial<LocalStorageData>): void => {
  try {
    const currentData = getLocalStorage();
    const newData = { ...currentData, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Get favorites list
 * @returns Array of favorite appids
 */
export const getFavorites = (): number[] => {
  const data = getLocalStorage();
  return data.favorites || [];
};

/**
 * Add game to favorites
 * @param appid - Game appid to add
 */
export const addFavorite = (appid: number): void => {
  const favorites = getFavorites();
  if (!favorites.includes(appid)) {
    saveLocalStorage({ favorites: [...favorites, appid] });
  }
};

/**
 * Remove game from favorites
 * @param appid - Game appid to remove
 */
export const removeFavorite = (appid: number): void => {
  const favorites = getFavorites();
  saveLocalStorage({ favorites: favorites.filter(id => id !== appid) });
};

/**
 * Toggle game favorite status
 * @param appid - Game appid to toggle
 * @returns New favorite status
 */
export const toggleFavorite = (appid: number): boolean => {
  const favorites = getFavorites();
  const isFavorite = favorites.includes(appid);
  
  if (isFavorite) {
    removeFavorite(appid);
    return false;
  } else {
    addFavorite(appid);
    return true;
  }
};

/**
 * Check if game is favorite
 * @param appid - Game appid to check
 * @returns Whether the game is favorite
 */
export const isFavorite = (appid: number): boolean => {
  const favorites = getFavorites();
  return favorites.includes(appid);
};

/**
 * Save last filters
 * @param filters - Filter options to save
 */
export const saveLastFilters = (filters: FilterOptions): void => {
  saveLocalStorage({ lastFilters: filters });
};

/**
 * Get last filters
 * @returns Last used filter options
 */
export const getLastFilters = (): FilterOptions | undefined => {
  const data = getLocalStorage();
  return data.lastFilters;
};

/**
 * Save last sort
 * @param sort - Sort options to save
 */
export const saveLastSort = (sort: SortOptions): void => {
  saveLocalStorage({ lastSort: sort });
};

/**
 * Get last sort
 * @returns Last used sort options
 */
export const getLastSort = (): SortOptions | undefined => {
  const data = getLocalStorage();
  return data.lastSort;
};

/**
 * Save last search
 * @param search - Search query to save
 */
export const saveLastSearch = (search: string): void => {
  saveLocalStorage({ lastSearch: search });
};

/**
 * Get last search
 * @returns Last search query
 */
export const getLastSearch = (): string | undefined => {
  const data = getLocalStorage();
  return data.lastSearch;
};

/**
 * Clear all localStorage data
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
