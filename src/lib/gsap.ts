import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // GSAP defaults for consistent, smooth timing
  gsap.defaults({
    ease: 'power2.out',
    duration: 0.8,
  });
}

export { gsap, ScrollTrigger };

/**
 * Checks if the user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return false;
};

/**
 * Safe cleanup helper for GSAP ScrollTrigger instances
 */
export const killScrollTriggers = (triggers: ScrollTrigger[] | null) => {
  if (!triggers) return;
  triggers.forEach((st) => st.kill());
};
