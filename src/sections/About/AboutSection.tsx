import React, { useEffect, useRef } from 'react';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { assets } from '../../config/assets';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAtmosphere } from '../../context/AtmosphereContext';

/**
 * Seção Sobre — Melière Marketing (Fase 5)
 * 
 * Atmosphere: #EDEEEE (light), #1D1D1D (dark text), #F15A3C (coral accent).
 * Editorial magazine composition introducing human proximity and the founder behind the strategy.
 * 
 * Elements:
 * 1. Eyebrow: SOBRE
 * 2. Headline: "Estratégia próxima de quem faz acontecer."
 * 3. Main Narrative: "A Melière Marketing nasce da ideia de que um bom trabalho..."
 * 4. Second Block: "Por isso, cada projeto parte de contexto, organização e direção..."
 * 5. Founder Block: Breno Matos (Fundador e estrategista) + narrative of direct accompaniment
 * 6. Editorial Micro-elements: ESTRATÉGIA // DIREÇÃO // PROXIMIDADE
 * 7. Visual Signature & Location: CURITIBA — PR
 * 8. Protagonist Photograph (Main Portrait, ~50% desktop presence)
 * 9. Secondary Photograph (Offset editorial accent)
 * 10. Monumental Closing: "Estratégia se constrói de perto."
 */
export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const photoMainRef = useRef<HTMLDivElement | null>(null);
  const photoSecRef = useRef<HTMLDivElement | null>(null);
  const founderCardRef = useRef<HTMLDivElement | null>(null);
  const narrativeRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = useReducedMotion();
  const { setAtmosphere } = useAtmosphere();

  const editorialPillars = ['ESTRATÉGIA', 'DIREÇÃO', 'PROXIMIDADE'];

  useEffect(() => {
    if (!containerRef.current) return;

    // Transition atmosphere to light (#EDEEEE) when entering Sobre
    const atmosphereTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 55%',
      end: 'bottom 40%',
      onEnter: () => setAtmosphere('light'),
      onEnterBack: () => setAtmosphere('light'),
      onLeaveBack: () => setAtmosphere('dark'),
    });

    if (reducedMotion) {
      return () => atmosphereTrigger.kill();
    }

    const ctx = gsap.context(() => {
      // Headline entrance
      gsap.fromTo(
        headlineRef.current,
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Main photograph reveal
      if (photoMainRef.current) {
        gsap.fromTo(
          photoMainRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photoMainRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Secondary photograph reveal
      if (photoSecRef.current) {
        gsap.fromTo(
          photoSecRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: photoSecRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Narrative text block reveal
      if (narrativeRef.current) {
        gsap.fromTo(
          narrativeRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Founder block reveal
      if (founderCardRef.current) {
        gsap.fromTo(
          founderCardRef.current,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderCardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Closing statement reveal
      if (closingRef.current) {
        gsap.fromTo(
          closingRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: closingRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => {
      atmosphereTrigger.kill();
      ctx.revert();
    };
  }, [reducedMotion, setAtmosphere]);

  return (
    <section
      id="sobre"
      ref={containerRef}
      className="w-full bg-brand-light text-brand-dark transition-colors duration-700 relative overflow-hidden"
    >
      {/* Background Architectural Coordinate Frame */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-dark/15" />
      </div>

      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-20 sm:pt-32 pb-20 sm:pb-28 relative z-10">
        {/* 
          ======================================================================
          01. SECTION HEADER & MONUMENTAL HEADLINE
          ======================================================================
        */}
        <div ref={headlineRef} className="max-w-5xl mb-14 sm:mb-20">
          <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-8 sm:mb-12">
            <SectionEyebrow variant="coral">SOBRE</SectionEyebrow>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-brand-dark leading-[1.08]">
            Estratégia próxima<br />
            <span className="text-brand-coral">de quem faz acontecer.</span>
          </h2>
        </div>

        {/* 
          ======================================================================
          02. EDITORIAL GRID (PHOTOGRAPHY + NARRATIVE + FOUNDER)
          ======================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-18 items-start">
          {/* 
            --------------------------------------------------------------------
            LEFT COLUMN: PROTAGONIST PHOTOGRAPHY
            --------------------------------------------------------------------
          */}
          <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-8">
            {/* Protagonist Photograph (Main Portrait) */}
            <div
              ref={photoMainRef}
              className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-brand-dark/5 border border-brand-dark/10 shadow-sm group"
            >
              <img
                src={assets.about.founderMain}
                alt="Breno Matos, fundador e estrategista da Melière Marketing."
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* 
            --------------------------------------------------------------------
            RIGHT COLUMN: NARRATIVE, FOUNDER PROFILE & EDITORIAL ACCENTS
            --------------------------------------------------------------------
          */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8 sm:gap-10">
            {/* Main Narrative Paragraphs */}
            <div ref={narrativeRef} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-brand-coral rounded-full" />
                <span className="font-mono text-xs sm:text-[13px] text-brand-dark/60 tracking-widest uppercase font-semibold">
                  POSICIONAMENTO INSTITUCIONAL
                </span>
              </div>

              <p className="text-xl sm:text-2xl lg:text-[1.65rem] text-brand-dark font-normal leading-snug tracking-tight">
                A Melière Marketing nasce da ideia de que um bom trabalho de marketing começa pela compreensão do negócio —{' '}
                <span className="text-brand-coral font-medium">não pela repetição de fórmulas</span>.
              </p>

              <p className="text-base sm:text-lg text-brand-dark/85 font-light leading-relaxed">
                Por isso, cada projeto parte de contexto, organização e direção. O objetivo é construir uma estrutura de comunicação coerente com a realidade de cada negócio e acompanhar sua evolução ao longo do trabalho.
              </p>

              {/* 3 Supporting Pillars */}
              <div className="pt-3 border-t border-brand-dark/10 flex flex-wrap gap-2.5">
                {editorialPillars.map((pillar) => (
                  <span
                    key={pillar}
                    className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.16em] text-brand-dark/90 bg-brand-dark/[0.04] border border-brand-dark/12 px-3.5 py-1.5 rounded-full font-medium"
                  >
                    {pillar}
                  </span>
                ))}
              </div>
            </div>

            {/* Founder Profile Block (Breno Matos) */}
            <div
              ref={founderCardRef}
              className="p-6 sm:p-8 rounded-2xl bg-brand-dark/[0.03] border border-brand-dark/10 space-y-4 sm:space-y-5"
            >
              <div className="pb-3 border-b border-brand-dark/10">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
                  Breno Matos
                </h3>
                <p className="font-mono text-xs sm:text-sm text-brand-coral font-medium tracking-wider mt-0.5">
                  Fundador e estrategista da Melière Marketing
                </p>
              </div>

              <p className="text-base sm:text-[1.05rem] text-brand-dark/85 font-light leading-relaxed">
                À frente da Melière, Breno acompanha diretamente estratégia, planejamento e execução dos projetos, mantendo proximidade com cada operação e conectando as diferentes frentes do trabalho.
              </p>
            </div>
          </div>
        </div>

        {/* 
          ======================================================================
          03. CLOSING STATEMENT
          ======================================================================
        */}
        <div
          ref={closingRef}
          className="mt-20 sm:mt-28 pt-14 sm:pt-18 border-t border-brand-dark/10 flex flex-col items-center text-center"
        >
          <div className="w-12 h-[2px] bg-brand-coral mb-6 sm:mb-8 rounded-full" />
          
          <blockquote className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-brand-dark leading-[1.1] max-w-4xl">
            Estratégia se constrói{' '}
            <span className="text-brand-coral">de perto.</span>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
