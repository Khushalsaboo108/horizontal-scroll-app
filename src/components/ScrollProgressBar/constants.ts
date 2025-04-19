import { data } from "../../data";

// Get the number of items in the current batch
export const getDotPositions = (batchData: any[]) => {
  const itemsCount = batchData?.length || 0;
  const START_POSITION = 3; // Start from 3%
  const END_POSITION = 97; // End at 97% to leave some space at the end
  return Array.from({ length: itemsCount }, (_, index) => {
    const position = START_POSITION + ((index / (itemsCount - 1)) * (END_POSITION - START_POSITION));
    return Math.round(position);
  });
};

export const SCROLL_SETTINGS = {
  STEP: 2.5,
  TIMEOUT: 800,
  DELTA_MULTIPLIER: 10,
};

export const SVG_SETTINGS = {
  WIDTH: '100%',
  HEIGHT: '100%',
  OVERFLOW: 'visible',
  VIEW_BOX: '0 0 1389 146',
  PATH: 'M1 32C122.822 9.02197 238.711 2.91797 353.5 5.23515C397.727 35.5983 535.342 66.3948 696.5 12.67C796 -20.5 891.465 24.0503 962.5 66.3948C1076 -44.5 1290.55 50.6138 1440 32',
};

export const ANIMATION_DURATION = 500; // ms