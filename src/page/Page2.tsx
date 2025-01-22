import React from 'react';
import PageContainer from '../components/PageContainer/PageContainer';
import { colors } from '../styles/theme';
import { contentStyle } from '../styles/common';
import ScrollProgressBar from '../components/ScrollProgressBar';
import './PageStyle.css';

interface Page2Props {
  onForwardComplete: () => void;
  onBackwardComplete: () => void;
  scrollDirection: 'forward' | 'backward';
  isProgressComplete: boolean;
  onProgressUpdate: (value: number) => void;
}

const Page2: React.FC<Page2Props> = ({
  onForwardComplete,
  onBackwardComplete,
  scrollDirection,
  isProgressComplete,
  onProgressUpdate,
}) => {
  const isMobile = window.innerWidth <= 768;

  return (
    <PageContainer backgroundColor={colors.page.page2}>
      <div className="container">
        <div style={contentStyle}>
          <h1 className="heading">Page 2</h1>
          <p className="text">
            {isMobile 
              ? 'Swipe to navigate between pages'
              : scrollDirection === 'backward'
                ? 'Scroll up to go back to the previous page'
                : isProgressComplete
                  ? 'Scroll to navigate to the next page'
                  : 'Complete all steps to continue'
            }
          </p>
        </div>
        {!isMobile && (
          <ScrollProgressBar
            onProgressComplete={onForwardComplete}
            onProgressStart={onBackwardComplete}
            direction={scrollDirection}
            isProgressComplete={isProgressComplete}
            onProgressUpdate={onProgressUpdate}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Page2;