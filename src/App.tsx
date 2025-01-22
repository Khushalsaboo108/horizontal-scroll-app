import React, { useRef, useState, useCallback, useEffect } from 'react';
import Page1 from './page/Page1';
import Page2 from './page/Page2';
import Page3 from './page/Page3';
import './App.css';
import Header from './components/common/Header';
import Loader from './components/common/Loading';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<
    'forward' | 'backward'
  >('forward');
  const [isProgressComplete] = useState(true); // Always set to true to disable progress checks
  const [progressValue] = useState(100); // Always set to 100 to disable progress checks
  const isScrollingRef = useRef(false);
  const touchStartX = useRef(0);

  const handleNavigate = useCallback(
    (targetPage: number) => {
      if (!containerRef.current || isScrollingRef.current) return;

      isScrollingRef.current = true;
      const pageWidth = window.innerWidth;
      containerRef.current.scrollTo({
        left: targetPage * pageWidth,
        behavior: 'smooth',
      });

      setCurrentPage(targetPage);
      setScrollDirection(targetPage > currentPage ? 'forward' : 'backward');

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    },
    [currentPage]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current) return;

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage <= 2) {
        handleNavigate(targetPage);
      }
    },
    [currentPage, handleNavigate]
  );

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return;
    
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1;
      const targetPage = currentPage + direction;
      
      if (targetPage >= 0 && targetPage <= 2) {
        handleNavigate(targetPage);
      }
      
      touchStartX.current = touchEndX;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentPage]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    const pageWidth = window.innerWidth;
    const newPage = Math.round(currentScroll / pageWidth);

    if (newPage !== currentPage) {
      setScrollDirection(newPage > currentPage ? 'forward' : 'backward');
      setCurrentPage(newPage);
    }
  }, [currentPage]);

  // Empty functions for progress handling
  const handleProgressUpdate = useCallback(() => {}, []);
  const handleForwardComplete = useCallback(() => {}, []);
  const handleBackwardComplete = useCallback(() => {}, []);

  return (
    <>
      <Loader />
      <Header />
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onScroll={handleScroll}
        className="containerStyle"
      >
        <div className="pageStyle">
          <Page1 />
        </div>
        <div className="pageStyle">
          <Page2
            onForwardComplete={handleForwardComplete}
            onBackwardComplete={handleBackwardComplete}
            scrollDirection={scrollDirection}
            isProgressComplete={isProgressComplete}
            onProgressUpdate={handleProgressUpdate}
          />
        </div>
        <div className="pageStyle">
          <Page3 />
        </div>
      </div>
    </>
  );
};

export default App;