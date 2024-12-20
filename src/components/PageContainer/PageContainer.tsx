import React, { ReactNode } from 'react';
import './pageContainer.css';
interface PageContainerProps {
  backgroundColor: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  backgroundColor,
  children,
}) => {
  return (
    <div className="container" style={{ backgroundColor }}>
      {children}
    </div>
  );
};

export default PageContainer;
