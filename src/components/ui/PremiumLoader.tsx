import { useEffect, useState } from 'react';
import './PremiumLoader.css';

interface PremiumLoaderProps {
    progress?: number; // 0 to 100
    status?: string;
    fadingOut?: boolean;
}

export const PremiumLoader = ({ progress = 0, status = 'INITIALIZING SYSTEM', fadingOut = false }: PremiumLoaderProps) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    // Smoothly animate progress even if props jump
    useEffect(() => {
        // If progress is 0 (reset), jump immediately? No, maybe not.
        // If progress is 100, we want to ensure we animate to it.

        const timeout = setTimeout(() => {
            if (displayProgress < progress) {
                // Accelerate as we get closer? Or constant?
                // Simple approach: move 1/10th of the difference or min 1%
                const diff = progress - displayProgress;
                const step = Math.max(1, Math.ceil(diff / 5));
                setDisplayProgress(Math.min(progress, displayProgress + step));
            }
        }, 20);

        return () => clearTimeout(timeout);
    }, [progress, displayProgress]);

    return (
        <div className={`premium-loader ${fadingOut ? 'fading-out' : ''}`}>
            <div className="loader-content">
                <div className="loader-logo">
                    STEAM BROWSER
                </div>

                <div className="loader-bar-container">
                    <div
                        className="loader-bar"
                        style={{ width: `${displayProgress}%` }}
                    />
                </div>

                <div className="loader-status">
                    {status}... [{displayProgress}%]
                </div>
            </div>
        </div>
    );
};
