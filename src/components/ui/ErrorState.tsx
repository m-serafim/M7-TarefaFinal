/**
 * ErrorState Component
 * Displays error message with retry button
 */

import './ErrorState.css';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  // Get human-readable error message
  const getErrorMessage = (err: Error): string => {
    if (err.message.includes('timed out')) {
      return 'The connection took too long. Check your internet connection and try again.';
    }
    if (err.message.includes('fetch')) {
      return 'Could not communicate with the server. Check your internet connection.';
    }
    if (err.message.includes('Network')) {
      return 'Network error. Check your internet connection.';
    }
    return err.message || 'An unexpected error occurred. Please try again.';
  };

  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-message">{getErrorMessage(error)}</p>
      {onRetry && (
        <button
          className="error-retry-button primary"
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      )}
    </div>
  );
};
