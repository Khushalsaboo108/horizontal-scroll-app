import React, { useRef, useState, useCallback } from "react";
import Page1 from "./page/Page1";
import Page2 from "./page/Page2";
import Page3 from "./page/Page3";
import "./App.css";
import Header from "./components/common/Header";
import Loader from "./components/common/Loading";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<
    "forward" | "backward"
  >("forward");
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const isScrollingRef = useRef(false);

  const handleNavigate = useCallback(
    (targetPage: number) => {
      if (!containerRef.current || isScrollingRef.current) return;

      isScrollingRef.current = true;
      const pageWidth = window.innerWidth;
      containerRef.current.scrollTo({
        left: targetPage * pageWidth,
        behavior: "smooth",
      });

      setCurrentPage(targetPage);
      setScrollDirection(targetPage > currentPage ? "forward" : "backward");

      // Reset scrolling lock after animation
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
        if (e.deltaY < 0 && progressValue === 0) {
          handleNavigate(0);
        } else if (e.deltaY > 0 && progressValue === 100) {
          handleNavigate(2);
        }
        return;
      }

      const targetPage = currentPage + (e.deltaY > 0 ? 1 : -1);
      if (targetPage >= 0 && targetPage <= 2) {
        if (currentPage === 2 && targetPage === 1) {
          setProgressValue(100);
          setIsProgressComplete(true);
        }
        handleNavigate(targetPage);
      }
    },
    [currentPage, progressValue, handleNavigate]
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const currentScroll = containerRef.current.scrollLeft;
    const pageWidth = window.innerWidth;
    const newPage = Math.round(currentScroll / pageWidth);

    if (newPage !== currentPage) {
      setScrollDirection(newPage > currentPage ? "forward" : "backward");
      setCurrentPage(newPage);

      if (newPage === 1 && currentPage === 0) {
        setProgressValue(0);
        setIsProgressComplete(false);
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
