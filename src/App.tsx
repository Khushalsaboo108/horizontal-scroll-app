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
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const isScrollingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const previousPage = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = useCallback(
    (targetPage: number) => {
      if (!containerRef.current || isScrollingRef.current) return;

      previousPage.current = currentPage;
      isScrollingRef.current = true;
      const pageWidth = window.innerWidth;
      containerRef.current.scrollTo({
        left: targetPage * pageWidth,
        behavior: 'smooth',
      });

      setCurrentPage(targetPage);
      setScrollDirection(targetPage > currentPage ? 'forward' : 'backward');

      // Set initial progress value when navigating to page 2
      if (targetPage === 1) {
        if (previousPage.current === 2) {
          setProgressValue(100);
          setIsProgressComplete(true);
        } else if (previousPage.current === 0) {
          setProgressValue(0);
          setIsProgressComplete(false);
        }
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    },
    [currentPage]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchStartX.current - touchX;
    const deltaY = touchStartY.current - touchY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && currentPage < 2) {
        handleNavigate(currentPage + 1);
      } else if (swipeDistance < 0 && currentPage > 0) {
        handleNavigate(currentPage - 1);
      }
    }
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current || isMobile) return;

      if (currentPage === 1) {
        if (e.deltaY < 0 && progressValue === 0) {
          handleNavigate(0);
        } else if (e.deltaY > 0 && progressValue === 100) {
          handleNavigate(2);
        }
        return;
      }

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage <= 2) {
        handleNavigate(targetPage);
      }
    },
    [currentPage, progressValue, handleNavigate, isMobile]
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    const pageWidth = window.innerWidth;
    const newPage = Math.round(currentScroll / pageWidth);

    if (newPage !== currentPage) {
      const newDirection = newPage > currentPage ? 'forward' : 'backward';
      setScrollDirection(newDirection);
      setCurrentPage(newPage);

      // Handle progress value when entering page 2
      if (newPage === 1) {
        if (currentPage === 2) {
          setProgressValue(100);
          setIsProgressComplete(true);
        } else if (currentPage === 0) {
          setProgressValue(0);
          setIsProgressComplete(false);
        }
      }
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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