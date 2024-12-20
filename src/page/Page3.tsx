import React from 'react';
import PageContainer from '../components/PageContainer/PageContainer';
import { contentStyle } from '../styles/common';
import { colors } from '../styles/theme';
import './PageStyle.css';

const Page3: React.FC = () => (
  <PageContainer backgroundColor={colors.page.page3}>
    <div style={contentStyle}>
      <h1 className="heading">Page 3</h1>
      <p className="text">You've reached the last page</p>
    </div>
  </PageContainer>
);

export default Page3;
