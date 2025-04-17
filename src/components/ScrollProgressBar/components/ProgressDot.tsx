import React, { useState, useEffect } from 'react';
import { ProgressDotProps } from '../types';
// import { data } from '../../../data';
import '../ScrollProgressBar.css';


const ProgressDot: React.FC<ProgressDotProps> = ({
  point,
  progress,
  index,
  isActive,
  data,
}) => {
  const isBelowLine = point.y > 73;
  const labelY = isBelowLine ? point.y + 40 : point.y - 40;
  const [isRemoving, setIsRemoving] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setIsRemoving(false);
    } else {
      setIsRemoving(true);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const labelClass = `progress-label ${
    isBelowLine ? 'label-bottom label-bottom-hover' : 'label-top label-top-hover'
  } ${isRemoving ? 'removing' : ''}`;

  return (
    <g>
      <circle
        cx={point.x}
        cy={point.y}
        r="6"
        fill={isActive ? 'black' : 'transparent'}
        className="progress-dot"
      />
      {shouldRender && data && (
        <foreignObject
          x={point.x - 30}
          y={labelY - 30}
          width="60"
          height="60"
          overflow="visible"
          className='foreign-style'
        >
          <div className={labelClass}>
            <span>{data.name}</span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default ProgressDot;