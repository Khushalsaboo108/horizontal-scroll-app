import React, { useRef, useState, useCallback } from 'react';
import Page1 from './page/Page1';
import Page2 from './page/Page2';
import Page3 from './page/Page3';
import './App.css';
import Header from './components/common/Header';
import Loader from './components/common/Loading';
import { data } from './data';

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_SCROLL = 3;

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const isScrollingRef = useRef(false);

  const handleNavigate = useCallback(
    (targetPage: number, targetBatch: number = 0) => {
      if (!containerRef.current || isScrollingRef.current) return;

      isScrollingRef.current = true;
      const pageWidth = window.innerWidth;
      containerRef.current.scrollTo({
        left: targetPage * pageWidth,
        behavior: 'smooth',
      });

      setCurrentPage(targetPage);
      setCurrentBatch(targetBatch);
      setScrollDirection(targetPage > currentPage ? 'forward' : 'backward');

      if (targetPage === 1) {
        setProgressValue(0);
        setIsProgressComplete(false);
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    },
    [currentPage]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isScrollingRef.current) return;

      if (currentPage === 1) {
        if (e.deltaY < 0) {
          // Scrolling up
          if (currentBatch === 0) {
            handleNavigate(0);
          } else {
            handleNavigate(1, currentBatch - 1);
          }
        } else {
          // Scrolling down
          const maxBatch = Math.ceil(data.length / ITEMS_PER_SCROLL) - 1;
          if (currentBatch >= maxBatch) {
            handleNavigate(2);
          } else {
            handleNavigate(1, currentBatch + 1);
          }
        }
        return;
      }

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage <= 2) {
        handleNavigate(targetPage);
      }
    },
    [currentPage, currentBatch, handleNavigate]
  );

  const handleProgressUpdate = useCallback((value: number) => {
    setProgressValue(value);
    if (value === 100) {
      setIsProgressComplete(true);
    }
  }, []);

  const handleForwardComplete = useCallback(() => {
    const maxBatch = Math.ceil(data.length / ITEMS_PER_SCROLL) - 1;
    if (currentBatch >= maxBatch) {
      handleNavigate(2);
    } else {
      handleNavigate(1, currentBatch + 1);
    }
  }, [currentBatch, handleNavigate]);

  const handleBackwardComplete = useCallback(() => {
    if (currentBatch === 0) {
      handleNavigate(0);
    } else {
      handleNavigate(1, currentBatch - 1);
    }
  }, [currentBatch, handleNavigate]);

  return (
    <>
      <Loader />
      <Header />
      <div
        ref={containerRef}
        onWheel={handleWheel}
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
            currentBatch={currentBatch}
            data={data}
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