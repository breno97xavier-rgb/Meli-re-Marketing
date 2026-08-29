import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { SectionEyebrow } from '../../../components/ui/SectionEyebrow';

export interface MethodStepData {
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export const METHOD_STEPS: MethodStepData[] = [
  {
    number: '01',
    title: 'Entender',
    description:
      'Conhecer o negócio, sua realidade, seus objetivos, sua operação e aquilo que precisa ser construído.',
    tags: ['NEGÓCIO', 'CONTEXTO', 'OBJETIVOS', 'OPERAÇÃO'],
  },
  {
    number: '02',
    title: 'Diagnosticar',
    description:
      'Analisar a presença atual, identificar prioridades, limitações, oportunidades e pontos que precisam de organização.',
    tags: ['PRESENÇA ATUAL', 'PRIORIDADES', 'LIMITAÇÕES', 'OPORTUNIDADES'],
  },
  {
    number: '03',
    title: 'Estruturar',
    description:
      'Transformar o diagnóstico em direção: posicionamento, planejamento, prioridades, canais e organização das entregas.',
    tags: ['POSICIONAMENTO', 'PLANEJAMENTO', 'CANAIS', 'PRIORIDADES'],
  },
  {
    number: '04',
    title: 'Executar',
    description:
      'Colocar a estratégia em prática por meio dos serviços definidos para aquele negócio.',
    tags: ['CONTEÚDO', 'MÍDIA', 'WEB', 'IDENTIDADE'],
  },
  {
    number: '05',
    title: 'Acompanhar',
    description:
      'Observar a execução, organizar informações, acompanhar indicadores e manter proximidade com o cliente durante o processo.',
    tags: ['RELATÓRIOS', 'INDICADORES', 'ROTINA', 'PROXIMIDADE'],
  },
  {
    number: '06',
    title: 'Ajustar',
    description:
      'Usar aquilo que foi observado para revisar decisões, corrigir rotas e orientar os próximos ciclos de trabalho.',
    tags: ['ANÁLISE', 'DECISÃO', 'AJUSTE', 'PRÓXIMO CICLO'],
  },
];

/**
 * Experiência Cinética Pinned do Método Melière (Fase 4)
 * Orquestra as 6 etapas em uma transformação contínua e fluida através do scroll no desktop,
 * e em cascata narrativa suave no mobile, com foco absoluto em tipografia nobre, clareza e hierarquia visual.
 */
export const MethodPinnedExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // Enable pinned scroll only on desktop/tablet (>= 768px)
    if (window.innerWidth < 768) return;

    const container = containerRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=450%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Map progress to 6 steps
            if (p < 0.18) {
              setCurrentStep(1);
            } else if (p < 0.35) {
              setCurrentStep(2);
            } else if (p < 0.52) {
              setCurrentStep(3);
            } else if (p < 0.69) {
              setCurrentStep(4);
            } else if (p < 0.86) {
              setCurrentStep(5);
            } else {
              setCurrentStep(6);
            }
          },
        },
      });

      tl.to({}, { duration: 1 });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  const activeData = METHOD_STEPS[currentStep - 1];

  return (
    <div id="metodo-experiencia" className="w-full bg-brand-light text-brand-dark">
      {/* =========================================================================
          MOBILE LAYOUT (< 768px): Natural Vertical Flow with Motion Reveals
          ========================================================================= */}
      <div className="block md:hidden w-full px-5 sm:px-8 py-12 flex flex-col gap-12 border-b border-brand-dark/10">
        {METHOD_STEPS.map((step) => (
          <motion.div
            key={step.number}
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 pb-10 border-b border-brand-dark/10 last:border-b-0 last:pb-0"
          >
            {/* Step Number */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -10 }}
              whileInView={reducedMotion ? false : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="flex items-center"
            >
              <span className="font-mono text-base text-brand-coral font-bold tracking-wider">
                {step.number}
              </span>
            </motion.div>

            <motion.h3
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark whitespace-nowrap"
            >
              {step.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base sm:text-lg text-brand-dark/85 font-light leading-relaxed"
            >
              {step.description}
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={reducedMotion ? false : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {step.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs uppercase tracking-wider text-brand-dark/80 bg-brand-dark/[0.04] border border-brand-dark/15 px-3.5 py-1.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT (>= 768px): Pinned Stage Experience (Pure Typography & Hierarquia)
          ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full h-screen overflow-hidden select-none"
      >
        {/* Background Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-dark/15" />
        </div>

        {/* Main Pinned Stage */}
        <div className="w-full h-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 pt-20 sm:pt-24 pb-12 flex flex-col justify-between relative z-10">
          {/* Top Header Bar with Eyebrow only */}
          <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-brand-dark/10">
            <SectionEyebrow variant="coral">MÉTODO</SectionEyebrow>
          </div>

          {/* Central 2-Column Balanced Stage with strict non-overlapping boundaries */}
          <div className="relative w-full flex-1 grid grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center my-auto min-h-0 py-8">
            {/* Left Column: Number & Step Title (5-6 cols) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col justify-center gap-3 sm:gap-4 transition-all duration-500 min-w-0 pr-2 lg:pr-6">
              <span className="font-mono text-xl sm:text-2xl text-brand-coral font-bold tracking-widest">
                {activeData.number}
              </span>

              <h3 className="text-3xl md:text-4xl lg:text-[3.3rem] xl:text-[4.1rem] 2xl:text-[4.6rem] font-bold tracking-tight text-brand-dark leading-none whitespace-nowrap">
                {activeData.title}
              </h3>
            </div>

            {/* Right Column: Narrative Description + Auxiliary Tags (6-7 cols) */}
            <div className="col-span-12 md:col-span-6 lg:col-span-7 flex flex-col justify-center gap-6 lg:gap-8 transition-all duration-500 min-w-0 pl-2 lg:pl-6 xl:pl-8">
              {/* Descriptive Body */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.05rem] xl:text-[2.35rem] text-brand-dark/90 font-light leading-snug lg:leading-[1.3] max-w-2xl">
                {activeData.description}
              </p>

              {/* Auxiliary Tags */}
              <div className="pt-1 flex flex-wrap gap-2 sm:gap-2.5">
                {activeData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-brand-dark/80 bg-brand-dark/[0.04] border border-brand-dark/15 px-3.5 py-1.5 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Clean Bottom Divider */}
          <div className="border-t border-brand-dark/10 pt-2" />
        </div>
      </div>
    </div>
  );
};

