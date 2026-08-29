import React, { useRef, useEffect } from 'react';
import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * Frase de Fechamento do Método Melière (Fase 4)
 * - Fundo claro #EDEEEE
 * - Espaço negativo generoso
 * - Frase central marcante preparando diretamente a seção Acompanhamento:
 *   "Estratégia não é um documento entregue no início.
 *    É uma direção acompanhada durante o processo."
 */
export const MethodClosing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLQuoteElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'top 35%',
            scrub: 0.6,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="metodo-fechamento"
      ref={containerRef}
      className="w-full min-h-[70vh] sm:min-h-[80vh] bg-brand-light text-brand-dark flex flex-col justify-center items-center px-6 sm:px-10 md:px-16 py-28 sm:py-36 border-b border-brand-dark/10 relative overflow-hidden select-none"
    >
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-15" aria-hidden="true">
        <div className="w-full max-w-7xl mx-auto h-full border-x border-brand-dark/15" />
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Delicate Accent Mark */}
        <div className="w-10 h-[2px] bg-brand-coral mb-8 sm:mb-12 rounded-full" />

        {/* Central Closing Statement */}
        <blockquote
          ref={quoteRef}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-bold tracking-tight text-brand-dark leading-[1.18] max-w-4xl"
        >
          Estratégia não é um documento entregue no início.{' '}
          <span className="text-brand-coral font-bold block mt-2">
            É uma direção acompanhada durante o processo.
          </span>
        </blockquote>

        {/* Footnote Transition Anchor */}
        <div className="mt-12 sm:mt-16 pt-6 border-t border-brand-dark/10 flex items-center gap-3 font-mono text-xs text-brand-dark/50 tracking-[0.25em] uppercase">
          <span>DIREÇÃO</span>
          <span>//</span>
          <span>ACOMPANHAMENTO</span>
        </div>
      </div>
    </section>
  );
};
