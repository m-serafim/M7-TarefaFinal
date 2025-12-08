/**
 * Main App Component
 * Steam Games Browser SPA
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  SteamGame,
  EnhancedGame,
  FilterOptions,
  SortOptions,
  PaginationOptions,
  UIState
} from './types';
import { CONFIG } from './constants';
import {
  getAppList,
  getAppDetails,
  searchGames,
  getFavorites,
  toggleFavorite as toggleFavoriteInStorage,
  saveLastFilters,
  saveLastSort,
  saveLastSearch,
  getLastFilters,
  getLastSort,
  getLastSearch
} from './services';
import {
  SearchBar,
  FilterControls,
  SortControls,
  Pagination,
  GameList
} from './components/features';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  Header,
  Footer,
  SkipLink
} from './components/ui';
import './App.css';

function App() {
  // State management
  const [allGames, setAllGames] = useState<SteamGame[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(getLastSearch() || '');
  const [filters, setFilters] = useState<FilterOptions>(getLastFilters() || {});
  const [sort, setSort] = useState<SortOptions>(getLastSort() || { field: 'name', order: 'asc' });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: CONFIG.DEFAULT_PAGE_SIZE
  });
  const [favorites, setFavorites] = useState<number[]>(getFavorites());
  const [uiState, setUiState] = useState<UIState>('idle');
  const [error, setError] = useState<Error | null>(null);

  // Load games on mount
  useEffect(() => {
    const controller = new AbortController();

    const loadGames = async () => {
      setUiState('loading');
      setError(null);

      try {
        const games = await getAppList(controller.signal);
        setAllGames(games);
        setUiState(games.length === 0 ? 'empty' : 'success');
      } catch (err) {
        if (!controller.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Failed to load games');
          setError(error);
          setUiState('error');
        }
      }
    };

    loadGames();

    return () => {
      controller.abort();
    };
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
    saveLastSearch(query);
  }, []);

  // Handle filter change
  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    saveLastFilters(newFilters);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSort: SortOptions) => {
    setSort(newSort);
    setPagination(prev => ({ ...prev, page: 1 }));
    saveLastSort(newSort);
  }, []);

  // Handle pagination change
  const handlePaginationChange = useCallback((newPagination: PaginationOptions) => {
    setPagination(newPagination);
  }, []);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback((appid: number) => {
    toggleFavoriteInStorage(appid);
    setFavorites(getFavorites());
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    setUiState('idle');
    setError(null);
    // Trigger reload by updating a key dependency
    window.location.reload();
  }, []);

  // Filter, sort, and paginate games
  const processedGames = useMemo(() => {
    let games = allGames;

    // Search
    if (searchQuery.trim() !== '') {
      games = searchGames(games, searchQuery);
    }

    // Convert to EnhancedGame
    let enhancedGames: EnhancedGame[] = games.map(game => ({
      ...game,
      isFavorite: favorites.includes(game.appid)
    }));

    // Apply filters (works for games with loaded details)
    if (filters.genre || filters.isFree !== undefined || filters.platform) {
      enhancedGames = enhancedGames.filter(game => {
        if (!game.details) return true; // Keep if no details yet

        // Filter by genre
        if (filters.genre) {
          const hasGenre = game.details.genres?.some(g => g.description === filters.genre);
          if (!hasGenre) return false;
        }

        // Filter by free/paid
        if (filters.isFree !== undefined) {
          if (game.details.is_free !== filters.isFree) return false;
        }

        // Filter by platform
        if (filters.platform) {
          if (!game.details.platforms?.[filters.platform]) return false;
        }

        return true;
      });
    }

    // Sort
    const sortedGames = [...enhancedGames].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'pt-PT');
          break;
        case 'appid':
          comparison = a.appid - b.appid;
          break;
        default:
          comparison = 0;
      }

      return sort.order === 'asc' ? comparison : -comparison;
    });

    return sortedGames;
  }, [allGames, searchQuery, favorites, sort, filters]);

  // Paginate
  const paginatedGames = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return processedGames.slice(start, end);
  }, [processedGames, pagination]);

  // Fetch details for paginated games (lazy loading)
  useEffect(() => {
    const controller = new AbortController();

    const fetchDetailsForVisibleGames = async () => {
      const gamesToFetch = paginatedGames.filter(game => !game.details);

      if (gamesToFetch.length === 0) return;

      console.log(`[Details] Fetching details for ${gamesToFetch.length} games on page ${pagination.page}`);

      const detailsPromises = gamesToFetch.map(game =>
        getAppDetails(game.appid, controller.signal)
          .then(details => ({ appid: game.appid, details }))
          .catch(err => {
            console.warn(`Failed to fetch details for ${game.appid}:`, err);
            return { appid: game.appid, details: null };
          })
      );

      const results = await Promise.all(detailsPromises);

      setAllGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          const result = results.find(r => r.appid === game.appid);
          if (result && result.details) {
            return { ...game, details: result.details };
          }
          return game;
        });
        return updatedGames;
      });

      console.log(`[Details] Finished fetching details`);
    };

    fetchDetailsForVisibleGames();

    return () => {
      controller.abort();
    };
  }, [paginatedGames, pagination.page]);


  // Determine final UI state
  const finalUiState: UIState = useMemo(() => {
    if (uiState === 'loading') return 'loading';
    if (uiState === 'error') return 'error';
    if (processedGames.length === 0) return 'empty';
    return 'success';
  }, [uiState, processedGames]);

  return (
    <div className="app">
      <SkipLink />
      <Header />

      <main className="app-main" id="main-content">
        <div className="app-controls">
          <SearchBar
            onSearch={handleSearch}
            initialValue={searchQuery}
          />

          <div className="app-controls-row">
            <SortControls
              sort={sort}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        <div className="app-layout">
          <aside className="app-sidebar">
            <FilterControls
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          <div className="app-content">
            <div
              className="app-status"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {finalUiState === 'loading' && <LoadingState />}
              {finalUiState === 'error' && error && (
                <ErrorState error={error} onRetry={handleRetry} />
              )}
              {finalUiState === 'empty' && <EmptyState />}
              {finalUiState === 'success' && (
                <>
                  <GameList
                    games={paginatedGames}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  <Pagination
                    pagination={pagination}
                    totalItems={processedGames.length}
                    onPaginationChange={handlePaginationChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
