/**
 * Header Component
 * Application header with title and subtitle
 */

import './Header.css';

import type { ReactNode } from 'react';
import './Header.css';

interface HeaderProps {
  children?: ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="text-gradient">Discover</span> Your Next{' '}
          <span className="text-outline">Adventure</span>
        </h1>
        <p className="header-subtitle">
          Explore thousands of Steam games, track prices, and find your favorites in one stunning interface.
        </p>
        <div className="header-search-container">
          {children}
        </div>
      </div>
      <div className="header-background-glow"></div>
    </header>
  );
};
