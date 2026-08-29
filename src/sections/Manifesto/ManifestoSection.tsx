import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAtmosphere } from '../../context/AtmosphereContext';

/**
 * Manifesto Section — Melière Marketing (Fase 5)
 * 
 * Atmosphere: #1D1D1D (dark), #EDEEEE (light text), #F15A3C (coral accent).
 * Pure typography + generous negative space + editorial rhythm.
 * No UI cards, no image assets, no mockups, no 3D gimmicks.
 */
export const ManifestoSection: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const stickyStageRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const { setAtmosphere } = useAtmosphere();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Maintain dark atmosphere during Manifesto
    const atmosphereTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setAtmosphere('dark'),
      onEnterBack: () => setAtmosphere('dark'),
    });

    if (reducedMotion || window.innerWidth < 768) {
      return () => atmosphereTrigger.kill();
    }

    const ctx = gsap.context(() => {
      // Scroll-driven pinned scrub timeline on desktop
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyStageRef.current,
        pinSpacing: false,
        scrub: 0.6,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => {
      atmosphereTrigger.kill();
      ctx.revert();
    };
  }, [reducedMotion, setAtmosphere]);

  const p = scrollProgress;

  // Opacity & Transform helpers for smooth interpolation on desktop
  const getStageStyle = (start: number, peakStart: number, peakEnd: number, end: number) => {
    if (reducedMotion) return { opacity: 1, transform: 'none', pointerEvents: 'auto' as const };
    let opacity = 0;
    let translateY = 20;

    if (p >= start && p <= peakStart) {
      const denom = peakStart - start;
      const progress = denom > 0 ? (p - start) / denom : 1;
      opacity = progress;
      translateY = 20 * (1 - progress);
    } else if (p > peakStart && p < peakEnd) {
      opacity = 1;
      translateY = 0;
    } else if (p >= peakEnd && p <= end) {
      const denom = end - peakEnd;
      const progress = denom > 0 ? (p - peakEnd) / denom : 0;
      opacity = 1 - progress;
      translateY = -20 * progress;
    }

    if (isNaN(opacity)) opacity = 0;
    if (isNaN(translateY)) translateY = 0;

    const safeOpacity = Math.max(0, Math.min(1, opacity));
    const isVisible = safeOpacity > 0.02;
    return {
      opacity: safeOpacity,
      transform: `translateY(${translateY}px)`,
      pointerEvents: isVisible ? ('auto' as const) : ('none' as const),
      display: isVisible ? 'flex' : 'none',
    };
  };

  const verb1Active = reducedMotion || p >= 0.80;
  const verb2Active = reducedMotion || p >= 0.85;
  const verb3Active = reducedMotion || p >= 0.90;
  const verb4Active = reducedMotion || p >= 0.95;

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="w-full bg-brand-dark text-brand-light relative"
    >
      {/* =========================================================================
          MOBILE LAYOUT (< 768px): Natural Vertical Flow with Dynamic Motion
          ========================================================================= */}
      <div className="block md:hidden w-full px-5 sm:px-8 py-16 flex flex-col gap-16 border-b border-brand-light/10">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pb-4 border-b border-brand-light/10"
        >
          <SectionEyebrow variant="coral">MANIFESTO</SectionEyebrow>
        </motion.div>

        {/* 01. Opening */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-light leading-[1.12]">
            Marketing não começa<br />
            <span className="text-brand-coral">na publicação.</span>
          </h2>
          <p className="font-mono text-xs text-brand-light/50 uppercase tracking-widest pt-2">
            POSTURA & FUNDAMENTO
          </p>
        </motion.div>

        {/* 02. Thought 1 */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="py-8 border-y border-brand-light/10"
        >
          <p className="text-xl sm:text-2xl font-light text-brand-light/95 leading-relaxed">
            Começa quando um negócio <span className="text-brand-light font-semibold">entende onde está</span>, o que precisa organizar e <span className="text-brand-coral font-medium">como quer ser percebido</span>.
          </p>
        </motion.div>

        {/* 03. Protagonist Statement */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-light leading-snug">
            Publicar sem direção é ocupar espaço.
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-coral leading-snug">
            Comunicar com direção é construir presença.
          </p>
        </motion.div>

        {/* 04. Argumentation */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 text-base text-brand-light/85 font-light leading-relaxed"
        >
          <p>
            Não acreditamos em fórmulas que servem para todo mundo. Estratégia depende de contexto, momento, objetivo e capacidade de execução.
          </p>
          <p>
            Por isso, antes de pensar em volume, <span className="text-brand-light font-semibold">pensamos em estrutura</span>. Antes de executar, entendemos. E depois de executar, <span className="text-brand-coral font-medium">acompanhamos</span>.
          </p>
        </motion.div>

        {/* 05. Slogan Finale */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 border-t border-brand-light/10 space-y-6"
        >
          <div className="font-mono text-xs text-brand-coral tracking-[0.25em] uppercase font-semibold">
            SÍNTESE INSTITUCIONAL
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="p-3 sm:p-4 rounded-xl border border-brand-light/15 bg-brand-light/[0.03] flex flex-col justify-center min-w-0"
            >
              <span className="font-mono text-xs text-brand-coral font-bold block mb-1">01</span>
              <span className="text-sm sm:text-base md:text-lg font-bold text-brand-light tracking-tight truncate sm:whitespace-nowrap">ENTENDER.</span>
            </motion.div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="p-3 sm:p-4 rounded-xl border border-brand-light/15 bg-brand-light/[0.03] flex flex-col justify-center min-w-0"
            >
              <span className="font-mono text-xs text-brand-coral font-bold block mb-1">02</span>
              <span className="text-sm sm:text-base md:text-lg font-bold text-brand-light tracking-tight truncate sm:whitespace-nowrap">ESTRUTURAR.</span>
            </motion.div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.19 }}
              className="p-3 sm:p-4 rounded-xl border border-brand-light/15 bg-brand-light/[0.03] flex flex-col justify-center min-w-0"
            >
              <span className="font-mono text-xs text-brand-coral font-bold block mb-1">03</span>
              <span className="text-sm sm:text-base md:text-lg font-bold text-brand-light tracking-tight truncate sm:whitespace-nowrap">COMUNICAR.</span>
            </motion.div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 15 }}
              whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="p-3 sm:p-4 rounded-xl border border-brand-coral/40 bg-brand-coral/[0.08] flex flex-col justify-center min-w-0"
            >
              <span className="font-mono text-xs text-brand-coral font-bold block mb-1">04</span>
              <span className="text-sm sm:text-base md:text-lg font-bold text-brand-coral tracking-tight truncate sm:whitespace-nowrap">ACOMPANHAR.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT (>= 768px): Progressive Kinetic Stage
          ========================================================================= */}
      <div className="hidden md:block h-[320vh]">
        <div
          ref={stickyStageRef}
          className="w-full h-screen sticky top-0 flex flex-col justify-between overflow-hidden px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-24 pb-10 select-none"
        >
          {/* Background Architectural Axis */}
          <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
            <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/15" />
          </div>

          {/* Top Header Bar */}
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex items-center justify-between pb-3 border-b border-brand-light/10 relative z-10">
            <SectionEyebrow variant="coral">MANIFESTO</SectionEyebrow>
          </div>

          {/* Central Editorial Display Viewport */}
          <div className="relative w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex-1 flex items-center justify-center min-h-0 my-auto py-6 z-10">
            {/* Beat 01 */}
            <div
              style={getStageStyle(0.0, 0.05, 0.14, 0.20)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="overflow-hidden pb-2">
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] xl:text-[8.2rem] font-bold tracking-tight text-brand-light leading-[1.03]">
                  Marketing não começa
                </h2>
              </div>
              <div className="overflow-hidden pt-1">
                <span className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] xl:text-[8.2rem] font-bold tracking-tight text-brand-coral leading-[1.03] block">
                  na publicação.
                </span>
              </div>
              <div className="mt-8 font-mono text-xs sm:text-sm text-brand-light/50 uppercase tracking-[0.25em]">
                POSTURA & FUNDAMENTO
              </div>
            </div>

            {/* Beat 02 */}
            <div
              style={getStageStyle(0.18, 0.24, 0.34, 0.40)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto"
            >
              <div className="w-10 h-[2px] bg-brand-coral/60 mb-8 rounded-full" />
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem] font-light text-brand-light leading-snug tracking-tight">
                Começa quando um negócio <span className="text-brand-light font-semibold">entende onde está</span>, o que precisa organizar e <span className="text-brand-coral font-medium">como quer ser percebido</span>.
              </p>
            </div>

            {/* Beat 03 */}
            <div
              style={getStageStyle(0.38, 0.44, 0.58, 0.64)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto space-y-6 sm:space-y-8"
            >
              <div className="space-y-4 sm:space-y-6">
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-brand-light leading-[1.12]">
                  Publicar sem direção é ocupar espaço.
                </p>
                <p className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.4rem] font-bold tracking-tight text-brand-coral leading-[1.06]">
                  Comunicar com direção é construir presença.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3 font-mono text-xs sm:text-sm text-brand-light/50 tracking-[0.2em] uppercase">
                <span className="w-6 h-[1px] bg-brand-coral" />
                <span>ESSÊNCIA DA MELIÈRE</span>
                <span className="w-6 h-[1px] bg-brand-coral" />
              </div>
            </div>

            {/* Beat 04 */}
            <div
              style={getStageStyle(0.62, 0.68, 0.76, 0.82)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-8"
            >
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-light text-brand-light/90 leading-relaxed tracking-tight">
                Não acreditamos em fórmulas que servem para todo mundo.{' '}
                <span className="text-brand-light font-medium">
                  Estratégia depende de contexto, momento, objetivo e capacidade de execução.
                </span>
              </p>

              <div className="w-12 h-[1px] bg-brand-light/20" />

              <p className="text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] font-light text-brand-light/80 leading-relaxed">
                Por isso, antes de pensar em volume, <span className="text-brand-light font-semibold">pensamos em estrutura</span>. Antes de executar, entendemos. E depois de executar, <span className="text-brand-coral font-medium">acompanhamos</span>.
              </p>
            </div>

            {/* Beat 05 */}
            <div
              style={getStageStyle(0.80, 0.85, 1.0, 1.0)}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 sm:px-4 w-full max-w-[1360px] 2xl:max-w-[1480px] mx-auto"
            >
              <div className="font-mono text-xs sm:text-sm md:text-2xl lg:text-3xl text-brand-coral tracking-[0.25em] uppercase mb-8 sm:mb-12 font-semibold">
                SÍNTESE INSTITUCIONAL
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-4 xl:gap-6 w-full">
                {/* 01. Entender */}
                <div
                  className={`flex flex-col items-center justify-center px-4 sm:px-6 xl:px-8 py-6 sm:py-7 rounded-2xl border transition-all duration-500 ${
                    verb1Active
                      ? 'opacity-100 translate-y-0 bg-brand-light/[0.03] border-brand-light/15'
                      : 'opacity-0 translate-y-6 border-transparent'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm text-brand-coral mb-2 font-bold">01</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] xl:text-[2.15rem] 2xl:text-[2.35rem] font-bold text-brand-light tracking-tight whitespace-nowrap">
                    ENTENDER.
                  </span>
                </div>

                {/* 02. Estruturar */}
                <div
                  className={`flex flex-col items-center justify-center px-4 sm:px-6 xl:px-8 py-6 sm:py-7 rounded-2xl border transition-all duration-500 ${
                    verb2Active
                      ? 'opacity-100 translate-y-0 bg-brand-light/[0.03] border-brand-light/15'
                      : 'opacity-0 translate-y-6 border-transparent'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm text-brand-coral mb-2 font-bold">02</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] xl:text-[2.15rem] 2xl:text-[2.35rem] font-bold text-brand-light tracking-tight whitespace-nowrap">
                    ESTRUTURAR.
                  </span>
                </div>

                {/* 03. Comunicar */}
                <div
                  className={`flex flex-col items-center justify-center px-4 sm:px-6 xl:px-8 py-6 sm:py-7 rounded-2xl border transition-all duration-500 ${
                    verb3Active
                      ? 'opacity-100 translate-y-0 bg-brand-light/[0.03] border-brand-light/15'
                      : 'opacity-0 translate-y-6 border-transparent'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm text-brand-coral mb-2 font-bold">03</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] xl:text-[2.15rem] 2xl:text-[2.35rem] font-bold text-brand-light tracking-tight whitespace-nowrap">
                    COMUNICAR.
                  </span>
                </div>

                {/* 04. Acompanhar */}
                <div
                  className={`flex flex-col items-center justify-center px-4 sm:px-6 xl:px-8 py-6 sm:py-7 rounded-2xl border transition-all duration-500 ${
                    verb4Active
                      ? 'opacity-100 translate-y-0 bg-brand-coral/[0.08] border-brand-coral/40 shadow-lg shadow-brand-coral/5'
                      : 'opacity-0 translate-y-6 border-transparent'
                  }`}
                >
                  <span className="font-mono text-xs sm:text-sm text-brand-coral mb-2 font-bold">04</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] xl:text-[2.15rem] 2xl:text-[2.35rem] font-bold text-brand-coral tracking-tight whitespace-nowrap">
                    ACOMPANHAR.
                  </span>
                </div>
              </div>

              <div
                className={`mt-8 sm:mt-10 transition-opacity duration-700 ${
                  verb4Active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="font-mono text-xs sm:text-sm text-brand-light/60 tracking-[0.2em] uppercase font-medium">
                  ESTRUTURA CONTÍNUA DE TRABALHO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
