export interface ScrollProgressBarProps {
  onProgressComplete: () => void;
  onProgressStart: () => void;
  direction: 'forward' | 'backward';
  isProgressComplete: boolean;
  onProgressUpdate: (value: number) => void;
}

export type UseProgressBarProps = ScrollProgressBarProps;

export interface DotPoint {
  x: number;
  y: number;
  percentage: number;
}

export interface ProgressDotProps {
  point: DotPoint;
  progress: number;
  index: number;
}
