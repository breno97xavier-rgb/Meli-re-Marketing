/**
 * Melière Marketing — Funnel Tracking Module (INT.2B / INT.2C)
 *
 * Provides anonymous/pseudonymous first-touch attribution and funnel tracking:
 * - Session Token management via sessionStorage (UUID v4)
 * - First-Touch attribution preservation (UTMs, referrer, landing URL/path)
 * - Remote Supabase RPC ingestion:
 *     - public.ingest_funnel_session
 *     - public.ingest_funnel_event
 *
 * Strict Privacy:
 * - No PII (names, emails, phones, input content)
 * - No fingerprinting or IP tracking
 * - No localStorage persistence
 * - Resilient and non-blocking execution
 */

import { captureUtmParams, getStoredUtmParams } from './utm';

export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export type FunnelEventType =
  | 'landing_view'
  | 'briefing_cta_click'
  | 'briefing_view'
  | 'whatsapp_click'
  | 'form_start'
  | 'form_step_completed'
  | 'form_back'
  | 'form_error'
  | 'form_submit';

export interface LandingViewMetadata {
  section?: string;
  [key: string]: unknown;
}

export interface BriefingCtaClickMetadata {
  cta_location: string;
  service_context?: string;
  [key: string]: unknown;
}

export interface BriefingViewMetadata {
  entry_mode: 'cta' | 'direct';
  [key: string]: unknown;
}

export interface WhatsappClickMetadata {
  cta_location: string;
  [key: string]: unknown;
}

export interface FormStartMetadata {
  initial_field: string;
  [key: string]: unknown;
}

export interface FormStepCompletedMetadata {
  step_title: string;
  [key: string]: unknown;
}

export interface FormBackMetadata {
  from_step: number;
  to_step: number;
  [key: string]: unknown;
}

export type FormErrorCategory = 'validation' | 'network' | 'server';

export interface FormErrorMetadata {
  error_category: FormErrorCategory;
  field_name_context?: string;
  [key: string]: unknown;
}

export interface FormSubmitMetadata {
  validation_passed: boolean;
  [key: string]: unknown;
}

export interface FunnelSessionContext {
  session_token: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_url?: string;
  landing_path?: string;
  referrer?: string;
  device_category: DeviceCategory;
  viewport_width: number;
  viewport_height: number;
}

const SESSION_TOKEN_KEY = 'meliere_funnel_session_token';
const SESSION_CTX_KEY = 'meliere_funnel_session_ctx';
const BRIEFING_ENTRY_MODE_KEY = 'meliere_briefing_entry_mode';

// In-memory fallback if sessionStorage is unavailable/restricted
let inMemorySessionToken: string | null = null;
let inMemorySessionCtx: FunnelSessionContext | null = null;
let inMemoryEntryMode: 'cta' | 'direct' | null = null;

// Track in-flight initialization promise to prevent race conditions
let sessionInitPromise: Promise<string> | null = null;
let sessionInitialized = false;

/**
 * Determine device category based on viewport width
 */
export function getDeviceCategory(): DeviceCategory {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Generate a cryptographically random UUID v4
 */
function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Standard UUID v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create the unique session token for the current tab/session.
 * Persisted strictly in sessionStorage (never localStorage).
 */
export function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') {
    if (!inMemorySessionToken) inMemorySessionToken = generateUuid();
    return inMemorySessionToken;
  }

  try {
    const stored = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }

    const newToken = generateUuid();
    sessionStorage.setItem(SESSION_TOKEN_KEY, newToken);
    return newToken;
  } catch {
    if (!inMemorySessionToken) {
      inMemorySessionToken = generateUuid();
    }
    return inMemorySessionToken;
  }
}

/**
 * Capture or retrieve the first-touch session context.
 */
export function getOrCreateSessionContext(): FunnelSessionContext {
  const sessionToken = getOrCreateSessionToken();

  if (typeof window === 'undefined') {
    if (inMemorySessionCtx) return inMemorySessionCtx;

    inMemorySessionCtx = {
      session_token: sessionToken,
      device_category: 'desktop',
      viewport_width: 1920,
      viewport_height: 1080,
    };
    return inMemorySessionCtx;
  }

  try {
    const storedCtx = sessionStorage.getItem(SESSION_CTX_KEY);
    if (storedCtx) {
      const parsed = JSON.parse(storedCtx) as FunnelSessionContext;
      if (parsed && parsed.session_token === sessionToken) {
        return parsed;
      }
    }
  } catch {
    if (inMemorySessionCtx && inMemorySessionCtx.session_token === sessionToken) {
      return inMemorySessionCtx;
    }
  }

  // First-touch capture
  const utms = captureUtmParams();
  const storedUtms = getStoredUtmParams();
  const mergedUtms = { ...storedUtms, ...utms };

  const ctx: FunnelSessionContext = {
    session_token: sessionToken,
    utm_source: mergedUtms.utm_source,
    utm_medium: mergedUtms.utm_medium,
    utm_campaign: mergedUtms.utm_campaign,
    utm_content: mergedUtms.utm_content,
    utm_term: mergedUtms.utm_term,
    landing_url: window.location.href,
    landing_path: window.location.pathname,
    referrer: document.referrer || undefined,
    device_category: getDeviceCategory(),
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  };

  try {
    sessionStorage.setItem(SESSION_CTX_KEY, JSON.stringify(ctx));
  } catch {
    inMemorySessionCtx = ctx;
  }

  return ctx;
}

/**
 * Supabase configuration resolver
 */
function getSupabaseConfig() {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    'https://ycagvwsvccgdjzpbhrfi.supabase.co';
  const anonKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    '';

  return { url, anonKey };
}

/**
 * Execute a Supabase REST RPC call with dual-parameter compatibility.
 */
async function invokeSupabaseRpc(
  rpcName: string,
  params: Record<string, unknown>
): Promise<boolean> {
  const { url, anonKey } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/rpc/${rpcName}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (anonKey) {
    headers.apikey = anonKey;
    headers.Authorization = `Bearer ${anonKey}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (res.ok) {
      return true;
    }

    // Compatibility retry for PostgreSQL RPCs that expose p_* argument names.
    if (res.status === 400 || res.status === 404) {
      const pPrefixedParams: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(params)) {
        pPrefixedParams[`p_${key}`] = value;
      }

      const retryRes = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(pPrefixedParams),
      });

      if (retryRes.ok) {
        return true;
      }
    }

    if (import.meta.env?.DEV) {
      console.warn(
        `[funnelTracking] RPC ${rpcName} responded with status:`,
        res.status
      );
    }

    return false;
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[funnelTracking] Network error invoking RPC ${rpcName}:`,
        error
      );
    }

    return false;
  }
}

/**
 * Initialize the funnel session in the Supabase backend
 * (public.ingest_funnel_session).
 * Idempotent: safe against multiple calls / React StrictMode.
 */
export async function initializeFunnelSession(): Promise<string> {
  if (sessionInitialized) {
    return getOrCreateSessionToken();
  }

  if (sessionInitPromise) {
    return sessionInitPromise;
  }

  const ctx = getOrCreateSessionContext();

  sessionInitPromise = (async () => {
    const payload = {
      session_token: ctx.session_token,
      utm_source: ctx.utm_source ?? null,
      utm_medium: ctx.utm_medium ?? null,
      utm_campaign: ctx.utm_campaign ?? null,
      utm_content: ctx.utm_content ?? null,
      utm_term: ctx.utm_term ?? null,
      landing_url: ctx.landing_url ?? null,
      landing_path: ctx.landing_path ?? null,
      referrer: ctx.referrer ?? null,
      device_category: ctx.device_category,
      viewport_width: ctx.viewport_width ?? null,
      viewport_height: ctx.viewport_height ?? null,
    };

    await invokeSupabaseRpc('ingest_funnel_session', payload);
    sessionInitialized = true;
    return ctx.session_token;
  })();

  return sessionInitPromise;
}

/**
 * Track an anonymous funnel event (public.ingest_funnel_event).
 * Guaranteed to wait for session initialization to avoid SESSION_NOT_FOUND.
 */
export async function trackFunnelEvent(
  eventType: FunnelEventType,
  metadata: Record<string, unknown> = {},
  stepNumber: number | null = null
): Promise<void> {
  try {
    const sessionToken = await initializeFunnelSession();

    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '/';

    const payload = {
      session_token: sessionToken,
      event_type: eventType,
      path: currentPath,
      step_number: stepNumber,
      metadata: metadata || {},
    };

    await invokeSupabaseRpc('ingest_funnel_event', payload);
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[funnelTracking] Failed to track event ${eventType}:`,
        err
      );
    }
  }
}

/**
 * Manage Briefing entry mode ('cta' vs 'direct') across client navigation.
 */
export function setBriefingEntryMode(mode: 'cta' | 'direct'): void {
  try {
    sessionStorage.setItem(BRIEFING_ENTRY_MODE_KEY, mode);
  } catch {
    inMemoryEntryMode = mode;
  }
}

export function getAndClearBriefingEntryMode(): 'cta' | 'direct' {
  let mode: 'cta' | 'direct' = 'direct';

  try {
    const stored = sessionStorage.getItem(BRIEFING_ENTRY_MODE_KEY);
    if (stored === 'cta' || stored === 'direct') {
      mode = stored;
      sessionStorage.removeItem(BRIEFING_ENTRY_MODE_KEY);
    }
  } catch {
    if (inMemoryEntryMode) {
      mode = inMemoryEntryMode;
      inMemoryEntryMode = null;
    }
  }

  return mode;
}

/**
 * High-Level Tracking Helpers
 */

/**
 * 1. Landing View
 */
export async function trackLandingView(): Promise<void> {
  return trackFunnelEvent('landing_view', { section: 'landing' });
}

/**
 * 2. Briefing CTA Click
 */
export function trackBriefingCtaClick(
  ctaLocation: string,
  serviceContext?: string
): void {
  setBriefingEntryMode('cta');

  const metadata: BriefingCtaClickMetadata = {
    cta_location: ctaLocation,
  };

  if (serviceContext) {
    metadata.service_context = serviceContext;
  }

  trackFunnelEvent('briefing_cta_click', metadata).catch(() => {});
}

/**
 * 3. Briefing View
 */
export async function trackBriefingView(
  entryModeOverride?: 'cta' | 'direct'
): Promise<void> {
  const entryMode =
    entryModeOverride || getAndClearBriefingEntryMode();

  const metadata: BriefingViewMetadata = {
    entry_mode: entryMode,
  };

  return trackFunnelEvent('briefing_view', metadata);
}

/**
 * 4. WhatsApp Click
 */
export function trackWhatsappClick(ctaLocation: string): void {
  const metadata: WhatsappClickMetadata = {
    cta_location: ctaLocation,
  };

  trackFunnelEvent('whatsapp_click', metadata).catch(() => {});
}

/**
 * 5. Form Start (INT.2C)
 * Triggered on the first meaningful interaction with form fields.
 * Backend idempotency guarantees one persisted form_start per session.
 */
export function trackFormStart(
  initialField: string = 'lead_type'
): void {
  const metadata: FormStartMetadata = {
    initial_field: initialField,
  };

  trackFunnelEvent('form_start', metadata, 1).catch(() => {});
}

/**
 * 6. Form Step Completed (INT.2C)
 * Triggered only when a step is validated and the user advances.
 */
export function trackFormStepCompleted(
  stepNumber: number,
  stepTitle: string
): void {
  const metadata: FormStepCompletedMetadata = {
    step_title: stepTitle,
  };

  trackFunnelEvent(
    'form_step_completed',
    metadata,
    stepNumber
  ).catch(() => {});
}

/**
 * 7. Form Back (INT.2C)
 * Triggered on explicit in-form backward navigation.
 */
export function trackFormBack(
  fromStep: number,
  toStep: number
): void {
  const metadata: FormBackMetadata = {
    from_step: fromStep,
    to_step: toStep,
  };

  trackFunnelEvent('form_back', metadata, toStep).catch(() => {});
}

/**
 * 8. Form Error (INT.2C)
 * Sends only the backend-approved structural error contract.
 *
 * `validation_failed` remains accepted as a compatibility input because
 * BriefingPage already uses it. It is normalized to `validation` before
 * anything is sent to funnel_events.
 */
export function trackFormError(
  stepNumber: number,
  errorType:
    | FormErrorCategory
    | 'validation_failed'
    | 'network_error'
    | 'submit_failed' = 'validation'
): void {
  const category: FormErrorCategory =
    errorType === 'network' || errorType === 'network_error'
      ? 'network'
      : errorType === 'server' || errorType === 'submit_failed'
        ? 'server'
        : 'validation';

  const metadata: FormErrorMetadata = {
    error_category: category,
  };

  trackFunnelEvent('form_error', metadata, stepNumber).catch(() => {});
}

/**
 * 9. Form Submit (INT.2C)
 * Triggered when user attempts submission on valid final step,
 * before network resolution.
 */
export function trackFormSubmit(stepNumber: number = 6): void {
  const metadata: FormSubmitMetadata = {
    validation_passed: true,
  };

  trackFunnelEvent('form_submit', metadata, stepNumber).catch(() => {});
}
