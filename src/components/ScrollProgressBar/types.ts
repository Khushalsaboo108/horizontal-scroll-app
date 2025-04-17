export interface ScrollProgressBarProps {
  onProgressComplete: () => void;
  onProgressStart: () => void;
  direction: 'forward' | 'backward';
  isProgressComplete: boolean;
  onProgressUpdate: (value: number) => void;
  data?: any[];
}

export interface UseProgressBarProps extends Omit<ScrollProgressBarProps, 'onProgressUpdate'> {
  onProgressUpdate: (value: number) => void;
}

export interface DotPoint {
  x: number;
  y: number;
  percentage: number;
}

export interface ProgressDotProps {
  point: DotPoint;
  progress: number;
  index: number;
  isActive: boolean;
  data?: any;
}

export interface ProgressPathProps {
  pathRef: React.RefObject<SVGPathElement>;
  pathLength: number;
  progress: number;
}
