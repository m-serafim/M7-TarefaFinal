/**
 * FilterControls Component
 * Provides filtering options for games
 */

import type { FilterOptions } from '../../types';
import './FilterControls.css';

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterControls = ({ filters, onFiltersChange }: FilterControlsProps) => {
  const handleGenreChange = (genre: string) => {
    onFiltersChange({
      ...filters,
      genre: genre === '' ? undefined : genre
    });
  };

  const handleIsFreeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      isFree: value === '' ? undefined : value === 'true'
    });
  };

  const handlePlatformChange = (platform: string) => {
    onFiltersChange({
      ...filters,
      platform: platform === '' ? undefined : platform as 'windows' | 'mac' | 'linux'
    });
  };

  const handleFavoritesChange = (isFavorite: boolean) => {
    onFiltersChange({
      ...filters,
      favoritesOnly: isFavorite ? true : undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.genre || filters.isFree !== undefined || filters.platform || filters.favoritesOnly;

  return (
    <div className="filter-controls">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-group favorites-filter">
        <label className="filter-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Favorites Only</span>
          <input
            type="checkbox"
            className="filter-checkbox"
            checked={!!filters.favoritesOnly}
            onChange={(e) => handleFavoritesChange(e.target.checked)}
            style={{ width: 'auto' }}
          />
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-genre" className="filter-label">
          Genre
        </label>
        <select
          id="filter-genre"
          className="filter-select"
          value={filters.genre || ''}
          onChange={(e) => handleGenreChange(e.target.value)}
          aria-label="Filter by genre"
        >
          <option value="">All genres</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="RPG">RPG</option>
          <option value="Strategy">Strategy</option>
          <option value="Simulation">Simulation</option>
          <option value="Sports">Sports</option>
          <option value="Racing">Racing</option>
          <option value="Indie">Indie</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-free" className="filter-label">
          Price
        </label>
        <select
          id="filter-free"
          className="filter-select"
          value={filters.isFree === undefined ? '' : String(filters.isFree)}
          onChange={(e) => handleIsFreeChange(e.target.value)}
          aria-label="Filter by price"
        >
          <option value="">All</option>
          <option value="true">Free</option>
          <option value="false">Paid</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-platform" className="filter-label">
          Platform
        </label>
        <select
          id="filter-platform"
          className="filter-select"
          value={filters.platform || ''}
          onChange={(e) => handlePlatformChange(e.target.value)}
          aria-label="Filter by platform"
        >
          <option value="">All platforms</option>
          <option value="windows">Windows</option>
          <option value="mac">Mac</option>
          <option value="linux">Linux</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          className="filter-clear"
          onClick={clearFilters}
          type="button"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};
