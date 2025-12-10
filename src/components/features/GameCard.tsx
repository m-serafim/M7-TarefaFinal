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
  priority?: boolean;
  preloadedUrl?: string; // Blob URL
  onToggleFavorite?: (appid: number) => void;
}

export const GameCard = ({ game, priority = false, preloadedUrl, onToggleFavorite }: GameCardProps) => {
  const details = game.details;
  const headerImage = details?.header_image;

  // Fallback image
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="460" height="215"%3E%3Crect fill="%2321262d" width="460" height="215"/%3E%3Ctext fill="%238b949e" font-family="system-ui" font-size="16" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

  const [imageError, setImageError] = useState(false);

  // If we have a preloadedUrl, we are definitely NOT loading.
  const [imageLoading, setImageLoading] = useState(preloadedUrl ? false : !priority);

  // Use preloadedUrl preferably, then headerImage, then fallback
  const [currentSrc, setCurrentSrc] = useState(preloadedUrl || headerImage || fallbackImage);

  // Reset state when headerImage changes.
  // Note: preloadedUrl is usually constant for the initial load, but if game changes we'd need to update.
  // If preloadedUrl provided, prioritize it.
  const targetSrc = preloadedUrl || headerImage || fallbackImage;

  if (targetSrc !== currentSrc && !imageError) {
    setCurrentSrc(targetSrc);
    // If it's a blob url, it's instant.
    setImageLoading(preloadedUrl ? false : !priority);
  }



  const handleImageError = () => {
    console.warn(`[GameCard] Failed to load image for ${game.name}: ${currentSrc}`);
    setImageError(true);
    setImageLoading(false);
    setCurrentSrc(fallbackImage);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(game.appid);
    }
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
          loading={priority ? "eager" : "lazy"}
        />
        {onToggleFavorite && (
          <button
            className={`game-card-favorite ${game.isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={game.isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={game.isFavorite}
            type="button"
          >
            {game.isFavorite ? '★' : '☆'}
          </button>
        )}
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
                {platforms.windows && (
                  <span className="game-card-platform" title="Windows">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M0 0h11.377v11.372H0V0zm12.623 0H24v11.372H12.623V0zM0 12.623h11.377V24H0V12.623zm12.623 0H24V24H12.623V12.623z" /></svg>
                  </span>
                )}
                {platforms.mac && (
                  <span className="game-card-platform" title="Mac">
                    <svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 43.3-25.6 72.1 27.7 5.6 52-16 69.5-34.5z" /></svg>
                  </span>
                )}
                {platforms.linux && (
                  <span className="game-card-platform" title="Linux">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                  </span>
                )}
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
