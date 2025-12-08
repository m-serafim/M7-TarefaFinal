/**
 * LoadingState Component
 * Displays loading indicator with accessibility
 */

import './LoadingState.css';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = 'A carregar...' }: LoadingStateProps) => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};
