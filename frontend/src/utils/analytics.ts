// Google Analytics 유틸리티

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// GA 초기화
export const initGA = () => {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // gtag.js 스크립트 로드
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // dataLayer 초기화
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // 수동으로 페이지뷰 전송
  });
};

// 페이지뷰 추적
export const trackPageView = (path: string, title?: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
};

// 이벤트 추적
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

// 검색 이벤트
export const trackSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchQuery,
    results_count: resultsCount,
  });
};

// 필터 사용 이벤트
export const trackFilterUsage = (filterType: string, filterValue: any) => {
  trackEvent('filter_usage', {
    filter_type: filterType,
    filter_value: JSON.stringify(filterValue),
  });
};

// 비교 기능 사용 이벤트
export const trackComparison = (keyboardIds: number[]) => {
  trackEvent('keyboard_comparison', {
    keyboard_count: keyboardIds.length,
    keyboard_ids: keyboardIds.join(','),
  });
};

// 외부 링크 클릭 이벤트
export const trackExternalLink = (url: string, keyboardName: string) => {
  trackEvent('external_link_click', {
    link_url: url,
    keyboard_name: keyboardName,
  });
};

// 정렬 변경 이벤트
export const trackSortChange = (sortOption: string) => {
  trackEvent('sort_change', {
    sort_option: sortOption,
  });
};
