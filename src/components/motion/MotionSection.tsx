import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: 'dark' | 'light' | 'coral';
  onEnter?: () => void;
}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className = '',
  id,
  theme = 'dark',
  onEnter,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      if (!reducedMotion) {
        gsap.fromTo(
          el,
          { opacity: 0.95 },
          {
            opacity: 1,
            duration: 0.6,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              onEnter: () => onEnter && onEnter(),
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, onEnter]);

  return (
    <section
      id={id}
      ref={sectionRef}
      data-theme={theme}
      className={`relative w-full ${className}`}
    >
      {children}
    </section>
  );
};
