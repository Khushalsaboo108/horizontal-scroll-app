import { useEffect, useState } from 'react';
import '../commonStyle/Loading.css';

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loader-container ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;