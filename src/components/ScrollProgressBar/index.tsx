import React, { useEffect } from 'react';
import ProgressPath from './components/ProgressPath';
import ProgressDot from './components/ProgressDot';
import { ScrollProgressBarProps } from './types';
import { useProgressBar } from './hooks/useProgressBar';
import { SVG_SETTINGS, getDotPositions } from './constants';
import './ScrollProgressBar.css';

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = (props) => {
  const { progress, pathRef, pathLength, handleWheel } = useProgressBar(props);
  const [dotPoints, setDotPoints] = React.useState<Array<{ x: number; y: number; percentage: number }>>([]);

  // Update dot positions when data changes
  useEffect(() => {
    if (!pathRef.current) return;

    const length = pathRef.current.getTotalLength();
    const positions = getDotPositions(props.data || []);
    
    const points = positions.map((percentage) => {
      const point = pathRef.current!.getPointAtLength((length * percentage) / 100);
      return { x: point.x, y: point.y, percentage };
    });

    setDotPoints(points);
  }, [props.data, pathRef]);

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e);
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelHandler);
    };
  }, [props.direction, props.isProgressComplete, handleWheel]);

  return (
    <div className="progress-bar-container">
      <svg
        width={SVG_SETTINGS.WIDTH}
        height={SVG_SETTINGS.HEIGHT}
        overflow={SVG_SETTINGS.OVERFLOW}
        viewBox={SVG_SETTINGS.VIEW_BOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="progress-bar-svg"
      >
        <ProgressPath
          pathRef={pathRef}
          pathLength={pathLength}
          progress={progress}
        />
        {dotPoints.map((point, index) => (
          <ProgressDot
            key={index}
            point={point}
            progress={progress}
            index={index}
            isActive={progress >= point.percentage}
            data={props.data?.[index]}
          />
        ))}
      </svg>
    </div>
  );
};

export default ScrollProgressBar;