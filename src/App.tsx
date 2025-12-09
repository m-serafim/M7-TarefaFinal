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
import { CONFIG, POPULAR_GAME_APPIDS } from './constants';
import {
  getAppList,
  getManyGameDetails,
  searchGames,
  getFavorites,
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
  PremiumLoader
} from './components/ui';
import './App.css';

function App() {
  // State management
  const [allGames, setAllGames] = useState<SteamGame[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(getLastSearch() || '');
  const [filters, setFilters] = useState<FilterOptions>(getLastFilters() || {});
  const [sort, setSort] = useState<SortOptions>(getLastSort() || { field: 'popularity', order: 'asc' });
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: CONFIG.DEFAULT_PAGE_SIZE
  });
  const [favorites] = useState<number[]>(getFavorites());
  const [uiState, setUiState] = useState<UIState>('idle');
  const [error, setError] = useState<Error | null>(null);

  // Loading and Layout State
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('INITIALIZING SYSTEM');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoaderFading, setIsLoaderFading] = useState(false);
  const [preloadedImageMap, setPreloadedImageMap] = useState<Record<number, string>>({});

  // Load games on mount
  useEffect(() => {
    const controller = new AbortController();

    const loadGames = async () => {
      setUiState('loading');
      setError(null);
      setLoadingProgress(10); // Start

      try {
        const games = await getAppList(controller.signal);
        setAllGames(games);
        setLoadingProgress(30); // List loaded
        setUiState(games.length === 0 ? 'empty' : 'success');
      } catch (err) {
        if (!controller.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Failed to load games');
          setError(error);
          setUiState('error');
          setIsInitialLoad(false); // Stop loader on error
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
        case 'popularity':
          // Use index in POPULAR_GAME_APPIDS (0 is most popular)
          const indexA = POPULAR_GAME_APPIDS.indexOf(a.appid as any);
          const indexB = POPULAR_GAME_APPIDS.indexOf(b.appid as any);

          // If not in popular list, push to end
          const valA = indexA !== -1 ? indexA : Number.MAX_SAFE_INTEGER;
          const valB = indexB !== -1 ? indexB : Number.MAX_SAFE_INTEGER;

          comparison = valA - valB;

          // If neither are in local popular list, fallback to ID (lower ID = older/more established)
          if (comparison === 0) {
            comparison = a.appid - b.appid;
          }
          break;
        case 'release_date':
          // Parse release dates from game details
          const dateA = a.details?.release_date?.date ? new Date(a.details.release_date.date).getTime() : 0;
          const dateB = b.details?.release_date?.date ? new Date(b.details.release_date.date).getTime() : 0;
          comparison = dateA - dateB;
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
      // Only fetch if details is literally undefined (not null)
      const gamesToFetch = paginatedGames.filter(game => game.details === undefined);

      if (gamesToFetch.length === 0) return;

      console.log(`[Details] Fetching details for ${gamesToFetch.length} games on page ${pagination.page}`);

      try {
        const appids = gamesToFetch.map(g => g.appid);
        const detailsMap = await getManyGameDetails(appids, controller.signal);

        setAllGames(prevGames => {
          const updatedGames = prevGames.map(game => {
            if (detailsMap.hasOwnProperty(game.appid)) {
              // If null, it means API returned failure/empty for this ID
              return { ...game, details: detailsMap[game.appid] || null };
            }
            return game;
          });
          return updatedGames;
        });
      } catch (err) {
        console.error("Failed to fetch details:", err);
      }
    };

    fetchDetailsForVisibleGames();

    return () => {
      controller.abort();
    };
  }, [paginatedGames, pagination.page]);



  // Initial Load Management Effect
  useEffect(() => {
    if (!isInitialLoad) return;

    // If we have an error or empty state, stop loading
    if (uiState === 'error' || uiState === 'empty') {
      setIsInitialLoad(false);
      return;
    }

    // Safety fallback
    if (processedGames.length === 0 && uiState === 'success') {
      setLoadingProgress(100);
      setTimeout(() => setIsInitialLoad(false), 500);
      return;
    }

    const visibleGames = paginatedGames;
    if (visibleGames.length === 0) {
      if (uiState === 'loading') {
        setLoadingStatus("CONNECTING TO STEAM SERVERS...");
      }
      return;
    }

    // Check availability of details
    // Games are processed if details is not undefined (could be object or null)
    const gamesProcessed = visibleGames.filter(g => g.details !== undefined);
    const detailsProgressPercent = (gamesProcessed.length / visibleGames.length);

    // Scale progress: 30% -> 70% during details fetching
    const currentProgress = 30 + (detailsProgressPercent * 40);

    setLoadingProgress(currentProgress);
    setLoadingStatus(`LOADING APP DATA...`);

    if (gamesProcessed.length === visibleGames.length && gamesProcessed.length > 0) {
      // All details processed. Filter successful ones for images.
      const gamesWithImages = gamesProcessed.filter(g => g.details && g.details.header_image);
      const imageUrls = gamesWithImages.map(g => g.details!.header_image);

      setLoadingStatus("DOWNLOADING ASSETS...");

      const imageMap: Record<number, string> = {};
      let loadedCount = 0;

      const finishLoad = () => {
        setPreloadedImageMap(prev => ({ ...prev, ...imageMap }));
        setLoadingProgress(100);
        setLoadingStatus("READY");

        // Wait a moment for the user to see "READY"
        setTimeout(() => {
          // Trigger fade out
          setIsLoaderFading(true);

          // Wait for fade animation to complete before removing from DOM
          setTimeout(() => {
            setIsInitialLoad(false);
            setIsLoaderFading(false);
          }, 1200); // Matches CSS transition time
        }, 1000);
      };

      // Use the first 12 games (visible on first page) for preloading
      const gamesToLoad = visibleGames.slice(0, 12);

      if (gamesToLoad.length === 0) {
        setTimeout(finishLoad, 2000);
        return;
      }

      const imagePromises = gamesToLoad.map(game => {
        // Construct standard Steam CDN URL to bypass API 403 blocks on header_image
        const url = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

        return fetch(url)
          .then(async response => {
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            imageMap[game.appid] = objectUrl;
            loadedCount++;
            const imgProgress = 70 + (loadedCount / gamesToLoad.length) * 30;
            setLoadingProgress(imgProgress);
          })
          .catch(err => {
            console.warn(`Failed to preload image for ${game.name}:`, err);
            loadedCount++; // Count as processed
            const imgProgress = 70 + (loadedCount / gamesToLoad.length) * 30;
            setLoadingProgress(imgProgress);
          });
      });

      // Ensure minimum ~5s load for premium feel
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 5000));

      Promise.all([Promise.all(imagePromises), minTimePromise]).then(() => {
        finishLoad();
      });

      return () => { /* no-op cleanup */ };
    }

  }, [paginatedGames, uiState, isInitialLoad, processedGames.length]);

  // Safety timeout for loading
  useEffect(() => {
    if (isInitialLoad && loadingProgress === 30) {
      const timeout = setTimeout(() => {
        // If stuck at 30% (waiting for details) for 5 seconds, ensure we proceed
        // This might happen if details API fails silently or returns nothing
        setLoadingProgress(90);
        setLoadingStatus("FINALIZING...");
        setTimeout(() => setIsInitialLoad(false), 1000);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isInitialLoad, loadingProgress]);


  // Determine final UI state
  const finalUiState: UIState = useMemo(() => {
    // If we are in initial load, we want to "force" the UI to look ready (success) 
    // underneath the loader as soon as we have data, so the DOM builds.
    // But if we truly have no data (0-30%), we can't render GameList.
    // Luckily, uiState becomes 'success' at 30% (when getAppList is done).

    if (uiState === 'loading') return 'loading';
    if (uiState === 'error') return 'error';
    if (processedGames.length === 0) return 'empty';
    return 'success';
  }, [uiState, processedGames]);

  // Render logic:
  // We keep the main app structure always rendered.
  // PremiumLoader sits on top with z-index.


  return (
    <div className="app">
      {isInitialLoad && (
        <PremiumLoader progress={loadingProgress} status={loadingStatus} fadingOut={isLoaderFading} />
      )}
      <Header>
        <SearchBar
          onSearch={handleSearch}
          initialValue={searchQuery}
          disabled={uiState === 'loading'}
        />
      </Header>

      <main className="app-main" id="main-content">
        <div className="app-controls">
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
                    preloadedImages={preloadedImageMap}
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
