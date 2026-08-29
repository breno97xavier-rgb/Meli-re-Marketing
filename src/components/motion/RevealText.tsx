import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealTextProps {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  threshold?: number;
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  tag: Tag = 'div',
  className = '',
  delay = 0,
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !elementRef.current) return;

    const el = elementRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, reducedMotion]);

  return React.createElement(
    Tag,
    {
      ref: elementRef,
      className: `${reducedMotion ? 'opacity-100' : ''} ${className}`,
    },
    children
  );
};
