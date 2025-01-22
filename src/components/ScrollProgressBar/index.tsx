import React, { useEffect } from 'react';
import ProgressPath from './components/ProgressPath';
import ProgressDot from './components/ProgressDot';
import { ScrollProgressBarProps } from './types';
import { useProgressBar } from './hooks/useProgressBar';
import { SVG_SETTINGS } from './constants';
import './ScrollProgressBar.css';

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = (props) => {
  const { progress, pathRef, pathLength, dotPoints, handleWheel, isMobile } =
    useProgressBar(props);

  useEffect(() => {
    if (isMobile) return; // Don't add event listener on mobile

    const wheelHandler = (e: WheelEvent) => {
      handleWheel(e);
    };

    window.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheelHandler);
    };
  }, [props.direction, props.isProgressComplete, handleWheel, isMobile]);

  if (isMobile) return null; // Don't render on mobile

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
          />
        ))}
      </svg>
    </div>
  );
};

export default ScrollProgressBar;