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

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.genre || filters.isFree !== undefined || filters.platform;

  return (
    <div className="filter-controls">
      <h3 className="filter-title">Filtros</h3>
      
      <div className="filter-group">
        <label htmlFor="filter-genre" className="filter-label">
          Género
        </label>
        <select
          id="filter-genre"
          className="filter-select"
          value={filters.genre || ''}
          onChange={(e) => handleGenreChange(e.target.value)}
          aria-label="Filtrar por género"
        >
          <option value="">Todos os géneros</option>
          <option value="Action">Ação</option>
          <option value="Adventure">Aventura</option>
          <option value="RPG">RPG</option>
          <option value="Strategy">Estratégia</option>
          <option value="Simulation">Simulação</option>
          <option value="Sports">Desporto</option>
          <option value="Racing">Corrida</option>
          <option value="Indie">Indie</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-free" className="filter-label">
          Preço
        </label>
        <select
          id="filter-free"
          className="filter-select"
          value={filters.isFree === undefined ? '' : String(filters.isFree)}
          onChange={(e) => handleIsFreeChange(e.target.value)}
          aria-label="Filtrar por preço"
        >
          <option value="">Todos</option>
          <option value="true">Gratuito</option>
          <option value="false">Pago</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-platform" className="filter-label">
          Plataforma
        </label>
        <select
          id="filter-platform"
          className="filter-select"
          value={filters.platform || ''}
          onChange={(e) => handlePlatformChange(e.target.value)}
          aria-label="Filtrar por plataforma"
        >
          <option value="">Todas as plataformas</option>
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
          Limpar filtros
        </button>
      )}
    </div>
  );
};
