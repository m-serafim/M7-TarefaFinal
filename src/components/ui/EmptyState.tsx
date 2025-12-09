/**
 * EmptyState Component
 * Displays empty state message
 */

import './EmptyState.css';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState = ({
  message = 'No results found',
  description = 'Try adjusting the filters or search term.'
}: EmptyStateProps) => {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon" aria-hidden="true">🔍</div>
      <h3 className="empty-title">{message}</h3>
      <p className="empty-description">{description}</p>
    </div>
  );
};
