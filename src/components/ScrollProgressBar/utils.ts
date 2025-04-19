import { getDotPositions, SCROLL_SETTINGS } from './constants';
import { colors } from '../../styles/theme';

export const findClosestDot = (currentProgress: number, data: any[]): number => {
  const positions = getDotPositions(data);
  return positions.reduce((closest, current) => {
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

  let newProgress = currentProgress + progressStep;
  
  // Ensure we don't go beyond 0 or 100
  newProgress = Math.min(100, Math.max(0, newProgress));
  
  // If we're at 100% and scrolling forward, or at 0% and scrolling backward,
  // don't allow further progress changes
  if ((newProgress >= 100 && !isScrollingUp) || (newProgress <= 0 && isScrollingUp)) {
    return currentProgress;
  }
  
  return newProgress;
};

export const calculateProgress = (currentItem: number, totalItems: number): number => {
  return (currentItem / totalItems) * 100;
};

export const getDotColor = (isActive: boolean, direction: 'forward' | 'backward'): string => {
  return isActive ? colors.primary : colors.background;
};