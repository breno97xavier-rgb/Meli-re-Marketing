import React, { useRef, useEffect } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.2,
  className = '',
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !layerRef.current) return;

    const el = layerRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: speed * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [speed, reducedMotion]);

  return (
    <div ref={layerRef} className={`relative will-change-transform ${className}`}>
      {children}
    </div>
  );
};
