import React from 'react';
import { colors } from '../styles/theme';
import { contentStyle } from '../styles/common';
import ScrollProgressBar from '../components/ScrollProgressBar';
import './PageStyle.css';
import PageContainer from '../components/PageContainer/PageContainer';

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
}) => (
  <PageContainer backgroundColor={colors.page.page2}>
    <div className="container">
      <div style={contentStyle}>
        <h1 className="heading">Page 2</h1>
        <p className="text">Swipe or scroll to navigate between pages</p>
      </div>
      <ScrollProgressBar
        onProgressComplete={onForwardComplete}
        onProgressStart={onBackwardComplete}
        direction={scrollDirection}
        isProgressComplete={isProgressComplete}
        onProgressUpdate={onProgressUpdate}
      />
    </div>
  </PageContainer>
);

export default Page2;