/**
 * StatusMessage Component
 * Accessible status message with aria-live
 */

import './StatusMessage.css';

interface StatusMessageProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const StatusMessage = ({ message, type = 'info' }: StatusMessageProps) => {
  const ariaLive = type === 'error' ? 'assertive' : 'polite';

  return (
    <div 
      className={`status-message status-message-${type}`}
      role="status"
      aria-live={ariaLive}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};
