/**
 * UTM Tracking Helpers
 * Extracts UTM and referrer parameters from query string and retains them in sessionStorage.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

const UTM_STORAGE_KEY = 'meliere_utm_params';

export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAnyUtm =
      urlParams.has('utm_source') ||
      urlParams.has('utm_medium') ||
      urlParams.has('utm_campaign') ||
      urlParams.has('utm_content') ||
      urlParams.has('utm_term');

    if (hasAnyUtm) {
      const currentUtms: UtmParams = {
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        referrer: document.referrer || undefined,
      };

      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(currentUtms));
      return currentUtms;
    }

    // Retrieve saved UTMs from session if available
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {
    // Graceful fallback if storage is restricted
  }

  return {};
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch {
    // ignore
  }
  return {};
}
