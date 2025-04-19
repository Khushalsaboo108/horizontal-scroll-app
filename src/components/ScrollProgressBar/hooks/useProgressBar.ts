import { useState, useRef, useEffect, useCallback } from 'react';
import { UseProgressBarProps, DotPoint } from '../types';
import { getDotPositions, SCROLL_SETTINGS } from '../constants';
import { findClosestDot, calculateNewProgress } from '../utils';

export const useProgressBar = ({
  onProgressComplete,
  onProgressStart,
  direction,
  isProgressComplete,
  onProgressUpdate,
  data,
}: UseProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [dotPoints, setDotPoints] = useState<DotPoint[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const pathRef = useRef<SVGPathElement | null>(null);
  const progressRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const hasCompletedRef = useRef(false);

  const updateProgress = useCallback(
    (newProgress: number) => {
      setProgress(newProgress);
      progressRef.current = newProgress;
      onProgressUpdate(newProgress);
    },
    [onProgressUpdate]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const isScrollingBack = direction === 'backward' || (isProgressComplete && e.deltaY < 0);

      if (!isScrollingBack && !isProgressComplete) {
        if (e.deltaY < 0 && progressRef.current <= 0) return;
        if (e.deltaY > 0 && progressRef.current >= 100) return;
      }

      const newProgress = calculateNewProgress(
        progressRef.current,
        e.deltaY,
        SCROLL_SETTINGS.STEP,
        isScrollingBack ? 'backward' : 'forward'
      );

      updateProgress(newProgress);

      scrollTimeoutRef.current = setTimeout(() => {
        // Only snap to closest dot if we're not at 100% or 0%
        if (newProgress > 0 && newProgress < 100) {
          const closestDot = findClosestDot(progressRef.current, data || []);
          updateProgress(closestDot);
        }

        if (!hasCompletedRef.current) {
          if (!isScrollingBack && progressRef.current === 100) {
            hasCompletedRef.current = true;
            onProgressComplete();
          } else if (isScrollingBack && progressRef.current === 0) {
            hasCompletedRef.current = true;
            onProgressStart();
          }
        }
      }, SCROLL_SETTINGS.TIMEOUT);
    },
    [direction, isProgressComplete, updateProgress, onProgressComplete, onProgressStart, data]
  );

  // Initialize SVG path and dots
  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    setPathLength(length);

    const positions = getDotPositions(data || []);
    const points = positions.map((percentage) => {
      const point = pathRef.current!.getPointAtLength((length * percentage) / 100);
      return { x: point.x, y: point.y, percentage };
    });

    setDotPoints(points);
  }, [data]);

  // Handle initial progress state
  useEffect(() => {
    if (isInitialized) return;
    
    const initialValue = direction === 'backward' ? 100 : 0;
    updateProgress(initialValue);
    setIsInitialized(true);
  }, [direction, updateProgress, isInitialized]);

  // Reset progress only when direction changes and progress is complete
  useEffect(() => {
    if (!isInitialized) return;
    
    if (isProgressComplete && direction === 'backward') {
      updateProgress(100);
      hasCompletedRef.current = false;
    } else if (!isProgressComplete && direction === 'forward') {
      updateProgress(0);
      hasCompletedRef.current = false;
    }
  }, [direction, isProgressComplete, updateProgress, isInitialized]);

  return {
    progress,
    pathRef,
    pathLength,
    dotPoints,
    handleWheel,
  };
};