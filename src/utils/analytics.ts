// Google Analytics 工具函数
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// 页面浏览跟踪
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-LTHJZRYES6', {
      page_title,
      page_location: page_location || window.location.href,
    });
  }
};

// 事件跟踪
export const trackEvent = (
  event_name: string,
  event_category?: string,
  event_label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event_name, {
      event_category,
      event_label,
      value,
    });
  }
};

// 转换跟踪（特别适用于你的转换工具）
export const trackConversion = (
  conversion_type: string,
  file_type?: string,
  file_size?: number
) => {
  trackEvent('conversion_completed', 'file_conversion', `${conversion_type}_${file_type}`, file_size);
};

// 用户交互跟踪
export const trackUserInteraction = (action: string, element: string) => {
  trackEvent('user_interaction', 'engagement', `${action}_${element}`);
};

const analytics = {
  trackPageView,
  trackEvent,
  trackConversion,
  trackUserInteraction,
};

export default analytics; 