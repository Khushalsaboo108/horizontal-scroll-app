import React, { useEffect, useState } from 'react';
import { colors } from '../../styles/theme';
import './ScrollProgressBar.css';

interface Person {
  name: string;
  language: string;
  id: string;
  bio: string;
  version: number;
}

interface ScrollProgressBarProps {
  onProgressComplete: () => void;
  onProgressStart: () => void;
  direction: 'forward' | 'backward';
  isProgressComplete: boolean;
  onProgressUpdate: (value: number) => void;
  data: Person[];
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  onProgressComplete,
  onProgressStart,
  direction,
  isProgressComplete,
  onProgressUpdate,
  data,
}) => {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (direction === 'backward') {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [direction]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      if (direction === 'forward' && e.deltaY > 0) {
        setIsScrolling(true);
        const newProgress = Math.min(progress + 10, 100);
        setProgress(newProgress);
        onProgressUpdate(newProgress);

        if (newProgress === 100) {
          onProgressComplete();
        }

        setTimeout(() => setIsScrolling(false), 100);
      } else if (direction === 'backward' && e.deltaY < 0) {
        setIsScrolling(true);
        const newProgress = Math.max(progress - 10, 0);
        setProgress(newProgress);
        onProgressUpdate(newProgress);

        if (newProgress === 0) {
          onProgressStart();
        }

        setTimeout(() => setIsScrolling(false), 100);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [progress, direction, isScrolling, onProgressComplete, onProgressStart, onProgressUpdate]);

  // Reset progress when direction changes
  useEffect(() => {
    if (direction === 'forward') {
      setProgress(0);
    } else {
      setProgress(100);
    }
  }, [direction]);

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          backgroundColor: colors.progressBar,
        }}
      />
      <div className="progress-dots">
        {data.map((_, index) => (
          <div
            key={index}
            className="progress-dot"
            style={{
              backgroundColor: index * 20 <= progress ? colors.progressBar : colors.progressDot,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollProgressBar; 