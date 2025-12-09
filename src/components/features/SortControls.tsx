/**
 * SortControls Component
 * Provides sorting options for games
 */

import type { SortOptions } from '../../types';
import './SortControls.css';

interface SortControlsProps {
  sort: SortOptions;
  onSortChange: (sort: SortOptions) => void;
}

export const SortControls = ({ sort, onSortChange }: SortControlsProps) => {
  const handleFieldChange = (field: string) => {
    onSortChange({
      ...sort,
      field: field as 'name' | 'appid' | 'release_date' | 'popularity'
    });
  };

  const handleOrderChange = (order: string) => {
    onSortChange({
      ...sort,
      order: order as 'asc' | 'desc'
    });
  };

  const toggleOrder = () => {
    onSortChange({
      ...sort,
      order: sort.order === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="sort-controls">
      <label htmlFor="sort-field" className="sort-label">
        Sort by:
      </label>
      <div className="sort-wrapper">
        <select
          id="sort-field"
          className="sort-select"
          value={sort.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          aria-label="Sort field"
        >
          <option value="popularity">Popularity</option>
          <option value="name">Name</option>
          <option value="appid">ID</option>
          <option value="release_date">Release Date</option>
        </select>

        <select
          id="sort-order"
          className="sort-select"
          value={sort.order}
          onChange={(e) => handleOrderChange(e.target.value)}
          aria-label="Sort order"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button
          className="sort-toggle"
          onClick={toggleOrder}
          aria-label={`Change to ${sort.order === 'asc' ? 'descending' : 'ascending'} order`}
          type="button"
          title={`${sort.order === 'asc' ? 'Ascending' : 'Descending'} order`}
        >
          {sort.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};
