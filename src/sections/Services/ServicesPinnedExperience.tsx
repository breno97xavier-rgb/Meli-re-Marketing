import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { ServicesIndicator } from './components/ServicesIndicator';
import { Act01Strategy } from './components/Act01Strategy';
import { Act02Content } from './components/Act02Content';
import { Act03Performance } from './components/Act03Performance';
import { Act04DigitalPresence } from './components/Act04DigitalPresence';

/**
 * Experiência Cinética Pinned dos Serviços da Melière
 * Pinned ScrollTrigger experience transitioning seamlessly across 4 structural acts on desktop,
 * and elegant scroll-triggered reveal animations in natural vertical flow on mobile.
 */
export const ServicesPinnedExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const act01Ref = useRef<HTMLDivElement | null>(null);
  const act02Ref = useRef<HTMLDivElement | null>(null);
  const act03Ref = useRef<HTMLDivElement | null>(null);
  const act04Ref = useRef<HTMLDivElement | null>(null);

  const [currentAct, setCurrentAct] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    // Only enable ScrollTrigger pinning on desktop/tablet (>= 768px)
    if (window.innerWidth < 768) return;

    const container = containerRef.current;

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(act01Ref.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
      gsap.set(act02Ref.current, { opacity: 0, y: 40, pointerEvents: 'none' });
      gsap.set(act03Ref.current, { opacity: 0, y: 40, pointerEvents: 'none' });
      gsap.set(act04Ref.current, { opacity: 0, y: 40, pointerEvents: 'none' });

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
            setScrollProgress(p);

            // Update current act indicator based on progress thresholds
            if (p < 0.25) {
              setCurrentAct(1);
            } else if (p < 0.52) {
              setCurrentAct(2);
            } else if (p < 0.77) {
              setCurrentAct(3);
            } else {
              setCurrentAct(4);
            }
          },
        },
      });

      // 1. Transition 01 -> 02
      tl.to(
        act01Ref.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.97,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in',
        },
        0.20
      ).to(
        act02Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.08,
          ease: 'power2.out',
        },
        0.24
      );

      // 2. Transition 02 -> 03
      tl.to(
        act02Ref.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.97,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in',
        },
        0.48
      ).to(
        act03Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.08,
          ease: 'power2.out',
        },
        0.52
      );

      // 3. Transition 03 -> 04
      tl.to(
        act03Ref.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.97,
          pointerEvents: 'none',
          duration: 0.08,
          ease: 'power2.in',
        },
        0.72
      ).to(
        act04Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
          duration: 0.08,
          ease: 'power2.out',
        },
        0.76
      );

      // 4. Soft exit of Act 04 before Interlude
      tl.to(
        act04Ref.current,
        {
          opacity: 0.25,
          scale: 0.98,
          duration: 0.06,
          ease: 'power1.in',
        },
        0.94
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div id="servicos-experiencia" className="w-full bg-brand-dark text-brand-light">
      {/* =========================================================================
          MOBILE LAYOUT (< 768px): Natural Vertical Flow with Scroll-Triggered Motion
          ========================================================================= */}
      <div className="block md:hidden w-full px-5 sm:px-8 py-12 flex flex-col gap-16 border-b border-brand-light/10">
        {/* Act 01 */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 pb-12 border-b border-brand-light/10"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={reducedMotion ? false : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="font-mono text-xs text-brand-coral font-bold tracking-widest uppercase">
              ATO 01 / 04
            </span>
            <span className="font-mono text-xs text-brand-light/50 tracking-wider">
              ESTRATÉGIA
            </span>
          </motion.div>
          <Act01Strategy />
        </motion.div>

        {/* Act 02 */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 pb-12 border-b border-brand-light/10"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={reducedMotion ? false : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="font-mono text-xs text-brand-coral font-bold tracking-widest uppercase">
              ATO 02 / 04
            </span>
            <span className="font-mono text-xs text-brand-light/50 tracking-wider">
              CONTEÚDO & SOCIAL
            </span>
          </motion.div>
          <Act02Content isActive={true} />
        </motion.div>

        {/* Act 03 */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 pb-12 border-b border-brand-light/10"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={reducedMotion ? false : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="font-mono text-xs text-brand-coral font-bold tracking-widest uppercase">
              ATO 03 / 04
            </span>
            <span className="font-mono text-xs text-brand-light/50 tracking-wider">
              PERFORMANCE
            </span>
          </motion.div>
          <Act03Performance />
        </motion.div>

        {/* Act 04 */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reducedMotion ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -12 }}
            whileInView={reducedMotion ? false : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <span className="font-mono text-xs text-brand-coral font-bold tracking-widest uppercase">
              ATO 04 / 04
            </span>
            <span className="font-mono text-xs text-brand-light/50 tracking-wider">
              PRESENÇA DIGITAL
            </span>
          </motion.div>
          <Act04DigitalPresence />
        </motion.div>
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT (>= 768px): Pinned ScrollTrigger Experience
          ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full h-screen overflow-hidden select-none"
      >
        {/* Subtle Background Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/20" />
        </div>

        {/* Primary Fixed Stage */}
        <div
          ref={stageRef}
          className="w-full h-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-24 pb-10 flex flex-col justify-between relative z-10"
        >
          {/* Top Control Bar: Eyebrow */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-light/10">
            <SectionEyebrow variant="coral">SERVIÇOS</SectionEyebrow>
          </div>

          {/* Central Dynamic Stage with the 4 Coexisting Acts */}
          <div className="relative w-full flex-1 flex items-center justify-center my-auto min-h-0">
            {/* Act 01: Estratégia */}
            <div
              ref={act01Ref}
              className="absolute inset-0 w-full h-full flex items-center will-change-transform"
            >
              <Act01Strategy />
            </div>

            {/* Act 02: Conteúdo & Social Media */}
            <div
              ref={act02Ref}
              className="absolute inset-0 w-full h-full flex items-center will-change-transform"
            >
              <Act02Content
                progress={scrollProgress}
                isActive={currentAct === 2}
              />
            </div>

            {/* Act 03: Performance & Tráfego Pago */}
            <div
              ref={act03Ref}
              className="absolute inset-0 w-full h-full flex items-center will-change-transform"
            >
              <Act03Performance progress={scrollProgress} />
            </div>

            {/* Act 04: Presença Digital & Identidade */}
            <div
              ref={act04Ref}
              className="absolute inset-0 w-full h-full flex items-center will-change-transform"
            >
              <Act04DigitalPresence progress={scrollProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
