import { useState, useRef, useEffect } from 'react';
import { UseProgressBarProps, DotPoint } from '../types';
import { DOT_POSITIONS } from '../constants';

export const useProgressBar = ({
  onProgressUpdate,
}: UseProgressBarProps) => {
  const [progress] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [dotPoints, setDotPoints] = useState<DotPoint[]>([]);
  const pathRef = useRef<SVGPathElement | null>(null);

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

  // Empty handleWheel function to disable scroll functionality
  const handleWheel = () => {};

  return {
    progress,
    pathRef,
    pathLength,
    dotPoints,
    handleWheel,
  };
};