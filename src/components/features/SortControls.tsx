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
      field: field as 'name' | 'appid' | 'release_date'
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
        Ordenar por:
      </label>
      <div className="sort-wrapper">
        <select
          id="sort-field"
          className="sort-select"
          value={sort.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          aria-label="Campo de ordenação"
        >
          <option value="name">Nome</option>
          <option value="appid">ID</option>
          <option value="release_date">Data de lançamento</option>
        </select>

        <select
          id="sort-order"
          className="sort-select"
          value={sort.order}
          onChange={(e) => handleOrderChange(e.target.value)}
          aria-label="Ordem de ordenação"
        >
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option>
        </select>

        <button
          className="sort-toggle"
          onClick={toggleOrder}
          aria-label={`Mudar para ordem ${sort.order === 'asc' ? 'decrescente' : 'crescente'}`}
          type="button"
          title={`Ordem ${sort.order === 'asc' ? 'crescente' : 'decrescente'}`}
        >
          {sort.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};
