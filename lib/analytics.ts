export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag && process.env.NEXT_PUBLIC_GA_ID) {
    (window as any).gtag('event', eventName, properties);
  }
};
