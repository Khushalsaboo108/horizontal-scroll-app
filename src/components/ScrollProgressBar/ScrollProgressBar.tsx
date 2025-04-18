import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { colors } from '../../styles/theme';
import { ScrollProgressBarProps } from './types';
import './ScrollProgressBar.css';

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_SCROLL = 3;

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  onProgressComplete,
  onProgressStart,
  direction,
  isProgressComplete,
  onProgressUpdate,
  data = [],
  currentBatch,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  const handleIndex = (batch: number) => {
    const totalBatches = Math.ceil(data.length / ITEMS_PER_SCROLL);
    const newIndex = Math.min(batch, totalBatches - 1);
    setCurrentIndex(newIndex);
    return newIndex;
  };

  // Calculate progress based on current batch
  const calculateProgress = (batch: number) => {
    const totalBatches = Math.ceil(data.length / ITEMS_PER_SCROLL);
    const index = handleIndex(batch);
    return (index / totalBatches) * 100;
  };

  useEffect(() => {
    const targetProgress = calculateProgress(currentBatch);
    animateProgress(targetProgress);
  }, [currentBatch]);

  const animateProgress = (targetProgress: number) => {
    // Animate progress bar
    anime({
      targets: progressBarRef.current,
      width: `${targetProgress}%`,
      duration: 500,
      easing: 'easeOutQuad',
      update: (anim) => {
        const currentProgress = Math.round(anim.progress * targetProgress / 100);
        setProgress(currentProgress);
        onProgressUpdate(currentProgress);
      },
      complete: () => {
        if (targetProgress >= 100) {
          onProgressComplete();
        } else if (targetProgress <= 0) {
          onProgressStart();
        }
      }
    });

    // Animate dots
    const totalDots = Math.ceil(data.length / ITEMS_PER_SCROLL);
    dotsRef.current.forEach((dot, index) => {
      const shouldFill = index <= Math.floor((targetProgress / 100) * totalDots);
      anime({
        targets: dot,
        backgroundColor: shouldFill ? colors.primary : colors.background,
        scale: shouldFill ? [0.8, 1] : [1, 0.8],
        duration: 300,
        delay: index * 50,
        easing: 'easeOutElastic(1, .8)'
      });
    });
  };

  return (
    <div className="progress-bar-container">
      <div
        ref={progressBarRef}
        className="progress-bar"
        style={{
          backgroundColor: colors.primary,
        }}
      />
      <div className="progress-dots">
        {Array.from({ length: Math.ceil(data.length / ITEMS_PER_SCROLL) }).map((_, index) => (
          <div
            key={index}
            ref={el => dotsRef.current[index] = el!}
            className="progress-dot"
            style={{
              backgroundColor: index <= Math.floor((progress / 100) * Math.ceil(data.length / ITEMS_PER_SCROLL))
                ? colors.primary 
                : colors.background,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollProgressBar; 