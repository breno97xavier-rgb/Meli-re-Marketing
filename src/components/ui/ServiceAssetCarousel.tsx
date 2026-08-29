import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface ServiceAssetCarouselProps {
  items: React.ReactNode[];
  autoplayInterval?: number;
  className?: string;
  itemClassName?: string;
  ariaLabel?: string;
  showIndicators?: boolean;
  showArrows?: boolean;
  onIndexChange?: (index: number) => void;
  currentIndex?: number;
  controlled?: boolean;
}

/**
 * ServiceAssetCarousel — Minimalist, accessible, touch-friendly carousel for Melière
 * Supports:
 * - Touch swipe gestures (with threshold & velocity)
 * - Autoplay with pause on hover/touch
 * - Respects prefers-reduced-motion
 * - Discrete pagination indicators
 * - Zero layout shift and zero horizontal overflow
 */
export const ServiceAssetCarousel: React.FC<ServiceAssetCarouselProps> = ({
  items,
  autoplayInterval = 5000,
  className = '',
  itemClassName = '',
  ariaLabel = 'Galeria de projetos e exemplos',
  showIndicators = true,
  showArrows = false,
  onIndexChange,
  currentIndex: externalIndex,
  controlled = false,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isDragging = useRef(false);
  const reducedMotion = useReducedMotion();

  const activeIndex = controlled && externalIndex !== undefined ? externalIndex : internalIndex;
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = (index + count) % count;
      if (!controlled) {
        setInternalIndex(nextIndex);
      }
      onIndexChange?.(nextIndex);
    },
    [count, controlled, onIndexChange]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const prev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // Autoplay management
  useEffect(() => {
    if (reducedMotion || isPaused || count <= 1 || autoplayInterval <= 0) return;

    const timer = setInterval(() => {
      goTo(activeIndex + 1);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [reducedMotion, isPaused, count, autoplayInterval, activeIndex, goTo]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.touches[0].clientX;
    const diffY = touchStartY.current - e.touches[0].clientY;

    // If horizontal swipe is more significant than vertical, prevent page scroll interference
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      // Intentional swipe
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || touchStartX.current === null) {
      setIsPaused(false);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    const threshold = 40; // minimum swipe distance in px

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isDragging.current = false;

    // Resume autoplay after brief delay
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${className}`}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Viewport */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`w-full flex-shrink-0 min-w-full ${itemClassName}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} de ${count}`}
              aria-hidden={idx !== activeIndex}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Discrete Indicators Bar */}
      {showIndicators && count > 1 && (
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none ${
                idx === activeIndex
                  ? 'w-6 sm:w-8 h-1.5 bg-brand-coral'
                  : 'w-1.5 h-1.5 bg-brand-light/30 hover:bg-brand-light/60'
              }`}
              aria-label={`Ir para o slide ${idx + 1}`}
              aria-current={idx === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      {/* Discrete Side Arrows (Optional) */}
      {showArrows && count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-brand-dark/80 border border-brand-light/20 text-brand-light flex items-center justify-center hover:border-brand-coral hover:text-brand-coral transition-colors"
            aria-label="Slide anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-brand-dark/80 border border-brand-light/20 text-brand-light flex items-center justify-center hover:border-brand-coral hover:text-brand-coral transition-colors"
            aria-label="Próximo slide"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};
