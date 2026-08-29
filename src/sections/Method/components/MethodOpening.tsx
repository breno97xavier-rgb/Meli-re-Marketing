import React, { useRef, useEffect } from 'react';
import { SectionEyebrow } from '../../../components/ui/SectionEyebrow';
import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * Abertura da Seção Método da Melière Marketing (Fase 4)
 * - Fundo claro #EDEEEE
 * - Tipografia escura com acento coral
 * - Espaço negativo generoso
 * - Entrada tipográfica sutil vinculada ao scroll
 */
export const MethodOpening: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { y: 25, opacity: 0 },
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
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="metodo-abertura"
      ref={containerRef}
      className="w-full min-h-0 py-16 sm:py-24 lg:min-h-[75vh] bg-brand-light text-brand-dark flex flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-brand-dark/10 relative overflow-hidden"
    >
      {/* Subtle Structural Wireframe Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-dark/15" />
      </div>

      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col justify-between flex-1 relative z-10 gap-8 sm:gap-12">
        {/* Top Eyebrow */}
        <div className="flex items-center justify-between">
          <SectionEyebrow variant="coral">MÉTODO</SectionEyebrow>
        </div>

        {/* Central Headline & Narrative Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-start my-auto py-2 sm:py-6">
          {/* Main Headline (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <h2
              ref={headlineRef}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] font-bold tracking-tight text-brand-dark leading-[1.03]"
            >
              Antes de executar,<br />
              <span className="text-brand-coral">é preciso entender.</span>
            </h2>
          </div>

          {/* Explanatory Narrative (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center lg:pt-2 gap-5 sm:gap-6">
            <p
              ref={textRef}
              className="text-2xl sm:text-3xl md:text-[2.1rem] lg:text-[2.3rem] text-brand-dark font-light leading-snug"
            >
              Cada negócio parte de um contexto diferente. Por isso, o trabalho começa pela leitura da operação, dos objetivos e da presença atual antes de qualquer decisão de comunicação.
            </p>

            <p className="text-sm sm:text-base text-brand-dark/70 font-light max-w-xl leading-relaxed">
              Seis etapas coordenadas que conectam diagnóstico, direção, prática e acompanhamento contínuo.
            </p>
          </div>
        </div>

        {/* Bottom Direction Border */}
        <div className="pt-4 border-t border-brand-dark/10" />
      </div>
    </section>
  );
};
