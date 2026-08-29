import React, { useRef, useEffect } from 'react';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { EditorialWorkspacePreview } from './components/EditorialWorkspacePreview';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAtmosphere } from '../../context/AtmosphereContext';

/**
 * Seção Acompanhamento da Melière Marketing (Fase 4)
 * Mostra como a agência mantém rigor, organização, rotina e transparência.
 * Composta por:
 * 1. Introdução editorial com headline forte e 3 microcopies conceituais
 * 2. Preview conceitual do workspace interno de processos
 * 3. Fechamento monumental ("Organização também faz parte da estratégia.")
 * 4. Transição progressiva de atmosfera light (#EDEEEE) -> dark (#1D1D1D)
 */
export const FollowUpSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const quoteRef = useRef<HTMLQuoteElement | null>(null);
  const { setAtmosphere } = useAtmosphere();
  const reducedMotion = useReducedMotion();

  const microcopies = [
    'Cada etapa registrada.',
    'Cada decisão com contexto.',
    'Cada próximo passo mais claro.',
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
        // Entrance animation for left column narrative
        gsap.fromTo(
          textColRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'top 40%',
              scrub: 0.6,
            },
          }
        );

        // Entrance animation for closing statement
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
        1. MAIN NARRATIVE & CONCEPTUAL WORKSPACE DISPLAY
        Asymmetric Layout: Text (38%) | Workspace Interface (62%)
        ========================================================================
      */}
      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-start">
          {/* Left Column: Narrative Block (5 cols) */}
          <div ref={textColRef} className="lg:col-span-5 flex flex-col gap-5 sm:gap-7">
            <div className="flex items-center justify-between">
              <SectionEyebrow variant="coral">ACOMPANHAMENTO</SectionEyebrow>
              <div className="hidden md:block font-mono text-xs text-brand-dark/50 tracking-[0.16em] uppercase font-medium">
                ROTINA & CLAREZA
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-dark leading-[1.1]">
              O trabalho não termina<br />
              <span className="text-brand-coral">quando a entrega começa.</span>
            </h2>

            <p className="text-base sm:text-lg text-brand-dark/85 font-light leading-relaxed">
              Planejamento, execução e acompanhamento fazem parte da mesma relação. A Melière mantém o trabalho organizado para que decisões, entregas e próximos passos estejam sempre claros.
            </p>

            {/* 3 Mandated Microcopies */}
            <div className="pt-3 border-t border-brand-dark/10 space-y-3">
              {microcopies.map((copy) => (
                <div key={copy} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-brand-coral flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-mono tracking-wider text-brand-dark/80 font-medium uppercase">
                    {copy}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtext Pillar (Desktop only) */}
            <div className="hidden md:block p-4 rounded-lg bg-brand-dark/[0.03] border border-brand-dark/10">
              <p className="text-xs sm:text-sm text-brand-dark/75 font-light leading-relaxed">
                Você não contrata apenas tarefas executadas. Contrata direção contínua, governança de comunicação e acompanhamento estruturado.
              </p>
            </div>
          </div>

          {/* Right Column: Conceptual Workspace Interface (7 cols) */}
          <div className="lg:col-span-7 w-full">
            <EditorialWorkspacePreview />
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
