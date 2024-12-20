import { DOT_POSITIONS, SCROLL_SETTINGS } from './constants';

export const findClosestDot = (currentProgress: number): number => {
  return DOT_POSITIONS.reduce((closest, current) => {
    const currentDistance = Math.abs(currentProgress - current);
    const closestDistance = Math.abs(currentProgress - closest);
    return currentDistance < closestDistance ? current : closest;
  });
};

export const calculateNewProgress = (
  currentProgress: number,
  delta: number,
  step: number,
  direction: 'forward' | 'backward'
): number => {
  // Normalize the delta value for touchpad
  const normalizedDelta = delta * SCROLL_SETTINGS.DELTA_MULTIPLIER;
  const isScrollingUp = normalizedDelta < 0;
  
  const progressStep =
    direction === 'backward'
      ? isScrollingUp
        ? -step
        : step
      : isScrollingUp
      ? -step
      : step;

  const newProgress = currentProgress + progressStep;
  return Math.min(100, Math.max(0, newProgress));
};