import React, { useRef, useState, useCallback } from 'react';
import Page1 from './page/Page1';
import Page2 from './page/Page2';
import Page3 from './page/Page3';
import './App.css';
import Header from './components/common/Header';
import Loader from './components/common/Loading';
import { data } from './data';

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_SCROLL = 5;

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'backward'>('forward');
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const isScrollingRef = useRef(false);
  const totalBatches = Math.ceil(data.length / ITEMS_PER_SCROLL);
  const totalPages = totalBatches + 2; // +2 for Page1 and Page3

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
          if (currentBatch >= totalBatches - 1) {
            handleNavigate(2);
          } else {
            handleNavigate(1, currentBatch + 1);
          }
        }
        return;
      }

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage < totalPages) {
        handleNavigate(targetPage);
      }
    },
    [currentPage, currentBatch, handleNavigate, totalBatches, totalPages]
  );

  const handleProgressUpdate = useCallback((value: number) => {
    setProgressValue(value);
    if (value === 1) {
      setIsProgressComplete(true);
    }
  }, []);

  const handleForwardComplete = useCallback(() => {
    if (currentBatch >= totalBatches - 1) {
      handleNavigate(2);
    } else {
      handleNavigate(1, currentBatch + 1);
    }
  }, [currentBatch, handleNavigate, totalBatches]);

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
        {Array.from({length: totalBatches}).map((_, index) => (
         <div className="pageStyle" key={index}>
         <Page2
           onForwardComplete={handleForwardComplete}
           onBackwardComplete={handleBackwardComplete}
           scrollDirection={scrollDirection}
           isProgressComplete={isProgressComplete}
           onProgressUpdate={handleProgressUpdate}
           currentBatch={currentBatch}
           data={data.slice(index * ITEMS_PER_SCROLL, (index + 1) * ITEMS_PER_SCROLL)}
         />
       </div> 
        ))}
          
        <div className="pageStyle">
          <Page3 />
        </div>
      </div>
    </>
  );
};

export default App;