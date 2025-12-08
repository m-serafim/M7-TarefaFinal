/**
 * Footer Component
 * Application footer with attribution
 */

import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-text">
        Steam Games Browser | M7 Tarefa Final | {currentYear} |{' '}
        Dados fornecidos pela{' '}
        <a 
          href="https://steamcommunity.com/dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          Steam Web API
        </a>
      </p>
    </footer>
  );
};
