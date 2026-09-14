/**
 * Meta Pixel (Facebook Pixel) Helper & Tracking Abstraction
 * Pixel ID: 1472944424893286
 */

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window['fbq'];
  }
}

export const META_PIXEL_ID =
  import.meta.env.VITE_META_PIXEL_ID || '1472944424893286';

let isInitialized = false;

/**
 * Initializes the Meta Pixel script safely and loads fbevents.js
 * Guaranteed to execute only once.
 */
export const initMetaPixel = (): void => {
  if (typeof window === 'undefined') return;
  if (isInitialized) return;

  try {
    /* eslint-disable */
    if (!window.fbq) {
      const fbq: any = function () {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, arguments);
        } else {
          fbq.queue.push(arguments);
        }
      };
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    }
    /* eslint-enable */

    if (window.fbq && META_PIXEL_ID) {
      window.fbq('init', META_PIXEL_ID);
      isInitialized = true;
      if (import.meta.env.DEV) {
        console.log(`[Meta Pixel] Initialized with ID: ${META_PIXEL_ID}`);
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Meta Pixel] Failed to initialize:', error);
    }
  }
};

/**
 * Dispatches PageView event to Meta Pixel
 */
export const trackMetaPageView = (): void => {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
      if (import.meta.env.DEV) {
        console.log('[Meta Pixel] Event tracked: PageView');
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Meta Pixel] Error tracking PageView:', error);
    }
  }
};

/**
 * Dispatches Lead standard event to Meta Pixel
 * Strictly triggered ONLY upon confirmed submission from Edge Function
 */
export const trackMetaLead = (): void => {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: 'Briefing Melière',
        content_category: 'Lead Generation',
      });
      if (import.meta.env.DEV) {
        console.log('[Meta Pixel] Event tracked: Lead');
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Meta Pixel] Error tracking Lead:', error);
    }
  }
};
