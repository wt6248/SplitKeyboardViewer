import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

// 페이지 변경 추적 훅
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};

// Analytics 훅
export const useAnalytics = () => {
  return {
    trackPageView,
  };
};
