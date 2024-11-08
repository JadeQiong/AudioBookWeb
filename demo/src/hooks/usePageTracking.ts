// src/hooks/usePageTracking.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    ReactGA.set({ page: pagePath });
    ReactGA.pageview(pagePath);
  }, [location]);
};

export default usePageTracking;
