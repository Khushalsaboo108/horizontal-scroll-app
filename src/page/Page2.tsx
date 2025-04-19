import React, { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer/PageContainer';
import { colors } from '../styles/theme';
import { contentStyle } from '../styles/common';
import ScrollProgressBar from '../components/ScrollProgressBar';
import './PageStyle.css';

interface Person {
  name: string;
  language: string;
  id: string;
  bio: string;
  version: number;
}

interface Page2Props {
  onForwardComplete: () => void;
  onBackwardComplete: () => void;
  scrollDirection: 'forward' | 'backward';
  isProgressComplete: boolean;
  onProgressUpdate: (value: number) => void;
  currentBatch: number;
  data: Person[];
}

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_SCROLL = 3;

const Page2: React.FC<Page2Props> = ({
  onForwardComplete,
  onBackwardComplete,
  scrollDirection,
  isProgressComplete,
  onProgressUpdate,
  currentBatch,
  data,
}) => {
  const totalBatches = Math.ceil(data.length / ITEMS_PER_SCROLL);
  const currentPage = Math.floor(currentBatch / (ITEMS_PER_PAGE / ITEMS_PER_SCROLL)) + 1;
  const totalPages = Math.ceil(totalBatches / (ITEMS_PER_PAGE / ITEMS_PER_SCROLL));



  useEffect(()=>console.log())

  return (
    <PageContainer backgroundColor={colors.page.page2}>
      <div className="container">
        <div style={contentStyle}>
          <h1 className="heading">Page 2 - Batch {currentPage} of {totalPages}</h1>
          
          <p className="text">
            {scrollDirection === 'backward'
              ? 'Scroll up to go back to the previous batch'
              : isProgressComplete
                ? 'Scroll to navigate to the next batch'
                : 'Complete all steps to continue'
            }
          </p>
        </div>
          <ScrollProgressBar
          onProgressComplete={onForwardComplete}
          onProgressStart={onBackwardComplete}
          direction={scrollDirection}
          isProgressComplete={isProgressComplete}
          onProgressUpdate={onProgressUpdate}
          data={data}
          currentBatch={currentBatch}
          />
      </div>
    </PageContainer>
  );
};

export default Page2;