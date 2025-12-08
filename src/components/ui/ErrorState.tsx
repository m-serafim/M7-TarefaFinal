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
      return 'A ligação demorou demasiado tempo. Verifique a sua conexão à internet e tente novamente.';
    }
    if (err.message.includes('fetch')) {
      return 'Não foi possível comunicar com o servidor. Verifique a sua conexão à internet.';
    }
    if (err.message.includes('Network')) {
      return 'Erro de rede. Verifique a sua conexão à internet.';
    }
    return err.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.';
  };

  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <h3 className="error-title">Algo correu mal</h3>
      <p className="error-message">{getErrorMessage(error)}</p>
      {onRetry && (
        <button 
          className="error-retry-button primary" 
          onClick={onRetry}
          type="button"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};
