/**
 * GameList Component
 * Displays a grid of game cards
 */

import type { EnhancedGame } from '../../types';
import { GameCard } from './GameCard';
import './GameList.css';

interface GameListProps {
  games: EnhancedGame[];
  preloadedImages?: Record<number, string>;
}

export const GameList = ({ games, preloadedImages = {} }: GameListProps) => {
  return (
    <div className="game-list" role="list">
      {games.map((game, index) => (
        <div key={game.appid} role="listitem">
          <GameCard
            game={game}
            priority={index < 6}
            preloadedUrl={preloadedImages[game.appid]}
          />
        </div>
      ))}
    </div>
  );
};
