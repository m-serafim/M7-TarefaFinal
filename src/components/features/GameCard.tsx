/**
 * GameCard Component
 * Displays individual game information with favorites
 */

import { useState } from 'react';
import type { EnhancedGame } from '../../types';
import {
  formatString,
  formatNumber,
  formatDate,
  formatBoolean,
  formatCurrency,
  truncateText,
  stripHtml
} from '../../utils';
import './GameCard.css';

interface GameCardProps {
  game: EnhancedGame;
  onToggleFavorite: (appid: number) => void;
}

export const GameCard = ({ game, onToggleFavorite }: GameCardProps) => {
  const details = game.details;
  const headerImage = details?.header_image;

  // Fallback image
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="460" height="215"%3E%3Crect fill="%2321262d" width="460" height="215"/%3E%3Ctext fill="%238b949e" font-family="system-ui" font-size="16" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(headerImage || fallbackImage);

  // Reset state when headerImage changes (e.g. from undefined to url)
  if (headerImage && headerImage !== currentSrc && !imageError) {
    setCurrentSrc(headerImage);
    setImageLoading(true);
  }

  const handleToggleFavorite = () => {
    onToggleFavorite(game.appid);
  };

  const handleImageError = () => {
    console.warn(`[GameCard] Failed to load image for ${game.name}: ${currentSrc}`);
    setImageError(true);
    setImageLoading(false);
    setCurrentSrc(fallbackImage);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const shortDesc = details?.short_description;
  const releaseDate = details?.release_date?.date;
  const isFree = details?.is_free;
  const price = details?.price_overview;
  const platforms = details?.platforms;
  const genres = details?.genres;

  return (
    <article className="game-card">
      <div className="game-card-image-wrapper">
        <div className={`game-card-image-loading ${imageLoading ? 'visible' : 'hidden'}`} aria-label="Loading image">
          {!imageError && <div className="loading-shimmer"></div>}
        </div>
        <img
          src={currentSrc}
          alt={`${game.name} header image`}
          className={`game-card-image ${imageLoading ? 'hidden' : 'visible'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        <button
          className={`game-card-favorite ${game.isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
          title={game.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {game.isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="game-card-content">
        <h3 className="game-card-title">
          {formatString(game.name)}
        </h3>

        {shortDesc && (
          <p className="game-card-description">
            {truncateText(stripHtml(shortDesc), 150)}
          </p>
        )}

        <div className="game-card-details">
          <div className="game-card-detail">
            <span className="game-card-detail-label">ID:</span>
            <span className="game-card-detail-value">{formatNumber(game.appid)}</span>
          </div>

          {releaseDate && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Release:</span>
              <span className="game-card-detail-value">{formatDate(releaseDate)}</span>
            </div>
          )}

          {isFree !== undefined && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Free:</span>
              <span className={`game-card-badge ${isFree ? 'success' : 'default'}`}>
                {formatBoolean(isFree, 'Yes', 'No')}
              </span>
            </div>
          )}

          {price && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Price:</span>
              <span className="game-card-detail-value">
                {price.discount_percent > 0 && (
                  <span className="game-card-price-original">
                    {formatCurrency(price.initial)}
                  </span>
                )}
                <span className={price.discount_percent > 0 ? 'game-card-price-discounted' : ''}>
                  {formatCurrency(price.final)}
                </span>
              </span>
            </div>
          )}

          {game.playerCount !== undefined && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Players now:</span>
              <span className="game-card-detail-value">{formatNumber(game.playerCount)}</span>
            </div>
          )}

          {platforms && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Platforms:</span>
              <span className="game-card-platforms">
                {platforms.windows && <span className="game-card-platform" title="Windows">🪟</span>}
                {platforms.mac && <span className="game-card-platform" title="Mac">🍎</span>}
                {platforms.linux && <span className="game-card-platform" title="Linux">🐧</span>}
              </span>
            </div>
          )}

          {genres && genres.length > 0 && (
            <div className="game-card-detail">
              <span className="game-card-detail-label">Genres:</span>
              <span className="game-card-detail-value">
                {genres.slice(0, 3).map(g => g.description).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
