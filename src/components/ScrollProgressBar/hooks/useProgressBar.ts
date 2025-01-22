import { useState, useRef, useEffect, useCallback } from 'react';
import { UseProgressBarProps, DotPoint } from '../types';
import { DOT_POSITIONS, SCROLL_SETTINGS } from '../constants';
import { findClosestDot, calculateNewProgress } from '../utils';

export const useProgressBar = ({
  onProgressComplete,
  onProgressStart,
  direction,
  isProgressComplete,
  onProgressUpdate,
}: UseProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [dotPoints, setDotPoints] = useState<DotPoint[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const pathRef = useRef<SVGPathElement | null>(null);
  const progressRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const hasCompletedRef = useRef(false);

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      if (isMobile) return;

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
        const closestDot = findClosestDot(progressRef.current);
        updateProgress(closestDot);

        if (!hasCompletedRef.current) {
          if (!isScrollingBack && closestDot >= 100) {
            hasCompletedRef.current = true;
            onProgressComplete();
          } else if (isScrollingBack && closestDot <= 0) {
            hasCompletedRef.current = true;
            onProgressStart();
          }
        }
      }, SCROLL_SETTINGS.TIMEOUT);
    },
    [direction, isProgressComplete, updateProgress, onProgressComplete, onProgressStart, isMobile]
  );

  // Initialize SVG path and dots
  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    setPathLength(length);

    const points = DOT_POSITIONS.map((percent) => {
      const point = pathRef.current!.getPointAtLength((length * percent) / 100);
      return { x: point.x, y: point.y, percentage: percent };
    });

    setDotPoints(points);
  }, []);

  // Handle initial progress state
  useEffect(() => {
    if (isInitialized || isMobile) return;
    
    const initialValue = direction === 'backward' ? 100 : 0;
    updateProgress(initialValue);
    setIsInitialized(true);
  }, [direction, updateProgress, isInitialized, isMobile]);

  // Reset progress only when direction changes and progress is complete
  useEffect(() => {
    if (!isInitialized || isMobile) return;
    
    if (direction === 'backward') {
      updateProgress(100);
      hasCompletedRef.current = false;
    } else if (direction === 'forward') {
      updateProgress(0);
      hasCompletedRef.current = false;
    }
  }, [direction, updateProgress, isInitialized, isMobile]);

  return {
    progress,
    pathRef,
    pathLength,
    dotPoints,
    handleWheel,
    isMobile,
  };
};