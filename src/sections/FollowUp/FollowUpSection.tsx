import React, { useRef, useEffect } from 'react';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAtmosphere } from '../../context/AtmosphereContext';

/**
 * Seção Acompanhamento da Melière Marketing
 * Layout predominantemente tipográfico e editorial:
 * 1. Bloco superior: 2 colunas com Eyebrow + Headline à esquerda e Parágrafo principal à direita
 * 2. Bloco intermediário: 3 pontos estruturados em grid horizontal
 * 3. Bloco inferior: Callout institucional de governança e direção contínua
 * 4. Fechamento monumental: "Organização também faz parte da estratégia."
 */
export const FollowUpSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const topBlockRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const calloutRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLQuoteElement | null>(null);
  const { setAtmosphere } = useAtmosphere();
  const reducedMotion = useReducedMotion();

  const points = [
    {
      number: '01',
      text: 'Cada etapa registrada.',
    },
    {
      number: '02',
      text: 'Cada decisão com contexto.',
    },
    {
      number: '03',
      text: 'Cada próximo passo mais claro.',
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Transition atmosphere to dark when reaching the closing monumental statement
    const st = ScrollTrigger.create({
      trigger: closingRef.current || containerRef.current,
      start: 'top 55%',
      end: 'bottom 40%',
      onEnter: () => setAtmosphere('dark'),
      onLeaveBack: () => setAtmosphere('light'),
    });

    if (!reducedMotion) {
      const ctx = gsap.context(() => {
        // Entrance animation for top block
        if (topBlockRef.current) {
          gsap.fromTo(
            topBlockRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: topBlockRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // Entrance animation for 3 items
        if (itemsRef.current) {
          gsap.fromTo(
            itemsRef.current,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: itemsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // Entrance animation for callout
        if (calloutRef.current) {
          gsap.fromTo(
            calloutRef.current,
            { y: 25, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: calloutRef.current,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // Entrance animation for closing statement
        if (quoteRef.current) {
          gsap.fromTo(
            quoteRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: closingRef.current,
                start: 'top 75%',
                end: 'top 40%',
                scrub: 0.6,
              },
            }
          );
        }
      }, containerRef);

      return () => {
        st.kill();
        ctx.revert();
      };
    }

    return () => {
      st.kill();
    };
  }, [reducedMotion, setAtmosphere]);

  return (
    <section
      id="acompanhamento"
      ref={containerRef}
      className="w-full bg-brand-light text-brand-dark transition-colors duration-700 relative overflow-hidden"
    >
      {/* 
        ========================================================================
        1. MAIN EDITORIAL NARRATIVE
        Balanced Composition: Upper 2-column text block | 3-column horizontal grid | Wide Callout
        ========================================================================
      */}
      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-28 flex flex-col gap-12 sm:gap-16 lg:gap-20">
        
        {/* BLOCO SUPERIOR: 2 COLUNAS DE TEXTO */}
        <div ref={topBlockRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-start">
          {/* Coluna Esquerda: Eyebrow + Headline */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-5 sm:gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <SectionEyebrow variant="coral">ACOMPANHAMENTO</SectionEyebrow>
              <div className="font-mono text-xs text-brand-dark/50 tracking-[0.16em] uppercase font-medium">
                ROTINA & CLAREZA
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-brand-dark leading-[1.1]">
              O trabalho não termina<br />
              <span className="text-brand-coral">quando a entrega começa.</span>
            </h2>
          </div>

          {/* Coluna Direita: Parágrafo Principal */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-end lg:pt-12">
            <p className="text-lg sm:text-xl md:text-2xl text-brand-dark/85 font-light leading-relaxed">
              Planejamento, execução e acompanhamento fazem parte da mesma relação. A Melière mantém o trabalho organizado para que decisões, entregas e próximos passos estejam sempre claros.
            </p>
          </div>
        </div>

        {/* BLOCO INTERMEDIÁRIO: 3 PONTOS EM GRID HORIZONTAL */}
        <div ref={itemsRef} className="pt-8 sm:pt-12 border-t border-brand-dark/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {points.map((point) => (
              <div
                key={point.number}
                className="p-6 sm:p-7 rounded-2xl bg-brand-dark/[0.025] border border-brand-dark/10 flex flex-col justify-between gap-4 hover:border-brand-coral/40 transition-colors"
              >
                <span className="font-mono text-xs sm:text-sm text-brand-coral font-semibold tracking-wider">
                  {point.number}
                </span>
                <span className="text-sm sm:text-base font-mono tracking-wider text-brand-dark font-semibold uppercase leading-snug">
                  {point.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCO INFERIOR: CALLOUT INSTITUCIONAL */}
        <div ref={calloutRef} className="w-full max-w-4xl">
          <div className="p-6 sm:p-8 rounded-2xl bg-brand-dark/[0.04] border border-brand-dark/12 flex items-start gap-4 sm:gap-5">
            <div className="w-1.5 h-12 bg-brand-coral rounded-full flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base md:text-lg text-brand-dark/80 font-light leading-relaxed">
              Você não contrata apenas tarefas executadas. Contrata direção contínua, governança de comunicação e acompanhamento estruturado.
            </p>
          </div>
        </div>

      </div>

      {/* 
        ========================================================================
        2. MONUMENTAL CLOSING STATEMENT
        Progressive dark shift (#1D1D1D) preparing the transition to Manifesto
        "Organização também faz parte da estratégia."
        ========================================================================
      */}
      <div
        ref={closingRef}
        className="w-full bg-brand-dark text-brand-light py-28 sm:py-36 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-t border-brand-light/10 relative overflow-hidden select-none"
      >
        {/* Subtle Background Architectural Axis */}
        <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/15" />
        </div>

        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Accent Line */}
          <div className="w-12 h-[2px] bg-brand-coral mb-8 sm:mb-12 rounded-full" />

          {/* Monumental Headline */}
          <blockquote
            ref={quoteRef}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-brand-light leading-[1.1] max-w-4xl"
          >
            Organização também faz parte{' '}
            <span className="text-brand-coral block mt-2">
              da estratégia.
            </span>
          </blockquote>

          {/* Footnote Coordinates */}
          <div className="mt-12 sm:mt-16 pt-6 border-t border-brand-light/10 flex items-center gap-4 font-mono text-xs text-brand-light/40 tracking-[0.25em] uppercase">
            <span>PROCESSO</span>
            <span>//</span>
            <span>PRESENÇA</span>
            <span>//</span>
            <span>MELIÈRE MARKETING</span>
          </div>
        </div>
      </div>
    </section>
  );
};
