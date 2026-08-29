import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { assets } from '../../config/assets';

/**
 * Interlúdio Editorial da Melière Marketing (Fase 3)
 * - Fundo predominantemente coral (#F15A3C)
 * - Tipografia monumental Alexandria
 * - Frase central:
 *   "As pessoas compram quando estão prontas.
 *    Seu negócio precisa estar presente quando esse momento chegar."
 * - Revelação tipográfica em linhas vinculada ao scroll
 * - Movimento ambiental sutil de massa tonal e geometria de marca no background
 */
export const EditorialInterludeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const bgAuraRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;

    const ctx = gsap.context(() => {
      // 1. Kinetic Subtle Background Ambient Motion
      gsap.to(bgAuraRef.current, {
        scale: 1.15,
        rotation: 12,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 2. Scroll-Linked Typographic Masked Reveal (Responsive)
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        gsap.fromTo(
          [line1Ref.current, line2Ref.current],
          { yPercent: 40, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 0.8,
          },
        });

        tl.fromTo(
          line1Ref.current,
          {
            yPercent: 60,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          }
        ).fromTo(
          line2Ref.current,
          {
            yPercent: 60,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          },
          0.25
        );
      }
    }, container);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="interludio"
      ref={containerRef}
      className="w-full min-h-[95vh] sm:min-h-[105vh] bg-brand-coral text-brand-dark relative flex items-center justify-center px-6 sm:px-10 md:px-16 py-32 sm:py-44 overflow-hidden select-none"
      aria-label="Interlúdio Editorial Melière"
    >
      {/* 
        ========================================================================
        SUBTLE KINETIC AMBIENT BACKGROUND
        Discreet tonal shift & watermark mark geometry (No Hero reproduction)
        ========================================================================
      */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
        aria-hidden="true"
      >
        {/* Soft Radial Tonal Distortion */}
        <div
          ref={bgAuraRef}
          className="w-[700px] sm:w-[900px] md:w-[1100px] aspect-square rounded-full bg-gradient-to-tr from-brand-coral to-[#FF7A5E] opacity-40 blur-3xl will-change-transform"
        />

        {/* Subtle Brand Symbol Watermark in Background */}
        {assets.brand.symbolCoralBlack && (
          <img
            src={assets.brand.symbolCoralBlack}
            alt=""
            className="absolute w-[45vw] max-w-[520px] aspect-square object-contain opacity-[0.06] mix-blend-multiply pointer-events-none select-none"
          />
        )}

        {/* Delicate Architectural Crosshair Grid in Background */}
        <div className="absolute inset-0 opacity-15">
          <div className="w-full max-w-7xl mx-auto h-full border-x border-brand-dark/20" />
        </div>
      </div>

      {/* 
        ========================================================================
        CENTRAL EDITORIAL TYPOGRAPHY
        Monumental Alexandria typography with high-contrast pairing (#1D1D1D / #EDEEEE)
        ========================================================================
      */}
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Top Minimalist Accent */}
        <div className="w-12 h-[2px] bg-brand-dark/40 mb-10 sm:mb-14 rounded-full" aria-hidden="true" />

        {/* Monumental Phrase (Line by Line Reveal) */}
        <blockquote className="flex flex-col gap-3 sm:gap-5 max-w-5xl">
          {/* Line 1 */}
          <div className="overflow-hidden py-1">
            <div
              ref={line1Ref}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-black text-brand-dark leading-[1.08] tracking-tight uppercase will-change-transform"
            >
              As pessoas compram quando estão prontas.
            </div>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden py-1">
            <div
              ref={line2Ref}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[4.8rem] font-black text-brand-light leading-[1.08] tracking-tight uppercase will-change-transform drop-shadow-sm"
            >
              Seu negócio precisa estar presente quando esse momento chegar.
            </div>
          </div>
        </blockquote>

        {/* Bottom Editorial Footnote */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-brand-dark/15 max-w-md">
          <p className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-brand-dark/80 font-medium">
            CONSISTÊNCIA // PRESENÇA // DIREÇÃO
          </p>
        </div>
      </div>
    </section>
  );
};
