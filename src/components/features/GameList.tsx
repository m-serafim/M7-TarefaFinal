/**
 * GameList Component
 * Displays a grid of game cards
 */

import type { EnhancedGame } from '../../types';
import { GameCard } from './GameCard';
import './GameList.css';

interface GameListProps {
  games: EnhancedGame[];
  onToggleFavorite: (appid: number) => void;
}

export const GameList = ({ games, onToggleFavorite }: GameListProps) => {
  return (
    <div className="game-list" role="list">
      {games.map((game) => (
        <div key={game.appid} role="listitem">
          <GameCard game={game} onToggleFavorite={onToggleFavorite} />
        </div>
      ))}
    </div>
  );
};
