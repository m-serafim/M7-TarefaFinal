/**
 * Header Component
 * Application header with title and subtitle
 */

import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Steam Games Browser</h1>
      <p className="header-subtitle">Explore and discover Steam games</p>
    </header>
  );
};
