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
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const isScrollingRef = useRef(false);
  const touchStartX = useRef(0);
  const isMobile = window.innerWidth <= 768;

  const handleNavigate = useCallback(
    (targetPage: number) => {
      if (!containerRef.current || isScrollingRef.current) return;

      // Prevent navigation if on page 2 and progress conditions aren't met
      if (!isMobile && currentPage === 1) {
        if (targetPage < currentPage && progressValue > 0) return;
        if (targetPage > currentPage && progressValue < 100) return;
      }

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
    [currentPage, progressValue, isMobile]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current) return;

      // For desktop, handle page 2 navigation based on progress
      if (!isMobile && currentPage === 1) {
        if (e.deltaY < 0 && progressValue > 0) return; // Prevent scrolling back if progress > 0
        if (e.deltaY > 0 && progressValue < 100) return; // Prevent scrolling forward if progress < 100
      }

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage <= 2) {
        handleNavigate(targetPage);
      }
    },
    [currentPage, handleNavigate, isMobile, progressValue]
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

  const handleProgressUpdate = useCallback((value: number) => {
    setProgressValue(value);
  }, []);

  const handleForwardComplete = useCallback(() => {
    setIsProgressComplete(true);
  }, []);

  const handleBackwardComplete = useCallback(() => {
    setIsProgressComplete(true);
  }, []);

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