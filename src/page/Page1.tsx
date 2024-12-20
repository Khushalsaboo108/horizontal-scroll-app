import React from 'react';
import PageContainer from '../components/PageContainer/PageContainer';
import { colors } from '../styles/theme';
import './PageStyle.css';
import { contentStyle } from '../styles/common';

const Page1: React.FC = () => (
  <PageContainer backgroundColor={colors.page.page1}>
    <div style={contentStyle}>
      <h1 className="heading">Welcome to Page 1</h1>
      <p className="text">Scroll horizontally to navigate</p>
    </div>
  </PageContainer>
);

export default Page1;
