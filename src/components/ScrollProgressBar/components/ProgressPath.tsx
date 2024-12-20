import React from 'react';
import { SVG_SETTINGS } from '../constants';

const ProgressPath: React.FC<any> = ({ pathRef, pathLength, progress }) => {
  return (
    <>
      <path
        ref={pathRef}
        d={SVG_SETTINGS.PATH}
        stroke="#E0E0E0"
        strokeWidth="3"
      />
      <path
        d={SVG_SETTINGS.PATH}
        stroke="black"
        strokeWidth="5"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - progress / 100)}
        style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
      />
    </>
  );
};

export default ProgressPath;
