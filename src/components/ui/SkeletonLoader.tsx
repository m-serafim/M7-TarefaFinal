/**
 * SkeletonLoader Component
 * Displays a grid of skeleton cards for loading states
 */

import './SkeletonLoader.css';

interface SkeletonLoaderProps {
    count?: number;
}

export const SkeletonLoader = ({ count = 12 }: SkeletonLoaderProps) => {
    return (
        <div className="skeleton-grid" role="status" aria-label="Loading games">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text short"></div>
                        <div className="skeleton-details">
                            <div className="skeleton-tag"></div>
                            <div className="skeleton-tag"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
