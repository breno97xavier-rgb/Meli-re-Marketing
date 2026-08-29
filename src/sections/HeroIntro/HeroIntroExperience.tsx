import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { Button } from '../../components/ui/Button';
import { MeliereOrganicElement } from '../../components/canvas/MeliereOrganicElement';
import { ArrowUpRight } from 'lucide-react';
import { assets } from '../../config/assets';

/**
 * HeroIntroExperience (FASE 2.5 — Sequência Narrativa e Liberdade Espacial do Motion)
 * 
 * Sequência Narrativa Refinada:
 * 1. (0.00 → 0.12): CAPA INSTITUCIONAL (MELIÈRE 100% visível + motion coral vivo + eyebrow. Sem textos inferiores, sem Header)
 * 2. (0.12 → 0.22): MELIÈRE DESAPARECE COMPLETAMENTE (Recua e atinge opacity 0 em 0.22 antes de qualquer entrada de copy)
 * 3. (0.24 → 0.36): COPY ENTRA NO CENTRO VISUAL (Headline clara no centro-esquerda e texto+CTA no centro-direita, alinhados ao eixo vertical)
 * 4. (0.36 → 0.54): TEMPO DE LEITURA ESTÁVEL (MELIÈRE invisível, copy perfeitamente legível #EDEEEE sobre o fundo/motion, motion vivo)
 * 5. (0.54 → 0.66): SAÍDA DO CONTEÚDO EDITORIAL (Headline, texto e CTA saem suavemente)
 * 6. (0.64 → 0.80): EXPANSÃO ORGÂNICA TOTAL DO MOTION (Canvas fullscreen em resolução nativa sem cortes retangulares)
 * 7. (0.80 → 0.94): REVELAÇÃO DA INTRODUÇÃO (Massa coral recua revelando fundo claro #EDEEEE e a Introdução)
 * 8. (0.94 → 1.00): INTRODUÇÃO ESTABELECIDA + HEADER FIXO
 */
export const HeroIntroExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const introStageRef = useRef<HTMLDivElement | null>(null);
  
  // Monumental Wordmark ref
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  
  // Hero editorial text elements (central visual grid)
  const heroEyebrowRef = useRef<HTMLDivElement | null>(null);
  const heroAmbientTagRef = useRef<HTMLDivElement | null>(null);
  const heroContentCenterRef = useRef<HTMLDivElement | null>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubtextRef = useRef<HTMLParagraphElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);

  // Intro container & text elements
  const introContainerRef = useRef<HTMLDivElement | null>(null);
  const introEyebrowRef = useRef<HTMLDivElement | null>(null);
  const introHeadlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const introHeadlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const introHeadlineLine3Ref = useRef<HTMLSpanElement | null>(null);
  const introTextRef = useRef<HTMLParagraphElement | null>(null);
  const introClosingRef = useRef<HTMLDivElement | null>(null);
  const introMemoryMarkRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion = useReducedMotion();
  const { setAtmosphere, setHeaderVisible } = useAtmosphere();

  // Master GSAP ScrollTrigger timeline with scrub across the sequence
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Set initial state of central copy explicitly to 0 (invisible on State 1)
      gsap.set(heroContentCenterRef.current, {
        opacity: 0,
        y: 40,
        pointerEvents: 'none',
      });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: isMobile ? '+=280%' : '+=380%',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);

            // ESTADO 5: Header aparece SOMENTE em p >= 0.94 quando a Introdução está consolidada
            if (p >= 0.94) {
              setHeaderVisible(true);
            } else {
              setHeaderVisible(false);
            }

            // Mudança cromática para a atmosfera clara (#EDEEEE) ao atingir p >= 0.80
            if (p >= 0.80) {
              setAtmosphere('light');
            } else {
              setAtmosphere('dark');
            }
          },
        },
      });

      // Refresh ScrollTrigger calculations
      ScrollTrigger.refresh();

      // -------------------------------------------------------------
      // 1. (0.00 → 0.12): CAPA INSTITUCIONAL INICIAL
      // MELIÈRE, motion coral e eyebrow estão 100% visíveis no frame 0.
      // Headline, subtexto, CTA e Header permanecem estritamente ocultos.
      // -------------------------------------------------------------

      // -------------------------------------------------------------
      // 2. (0.12 → 0.22): MELIÈRE DESAPARECE COMPLETAMENTE
      // MELIÈRE recua e chega a opacity: 0 exatamente em 0.22 antes da entrada da copy.
      // -------------------------------------------------------------
      masterTl
        .to(
          wordmarkRef.current,
          {
            scale: 1.05,
            yPercent: -10,
            opacity: 0,
            duration: 0.10,
            ease: 'power2.inOut',
          },
          0.12
        );

      // -------------------------------------------------------------
      // 3. (0.24 → 0.36): COPY ENTRA NO CENTRO VISUAL DA VIEWPORT
      // Headline clara no centro-esquerda e texto+CTA no centro-direita entram após MELIÈRE ser 0.
      // -------------------------------------------------------------
      masterTl
        .to(
          heroContentCenterRef.current,
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.12,
            ease: 'power2.out',
          },
          0.24
        );

      // -------------------------------------------------------------
      // 4. (0.36 → 0.54): TEMPO DE LEITURA ESTÁVEL
      // MELIÈRE 100% invisível, copy perfeitamente legível (#EDEEEE), motion vivo ao centro.
      // (Nenhum elemento textual se move neste intervalo)
      // -------------------------------------------------------------

      // -------------------------------------------------------------
      // 5. (0.54 → 0.66): SAÍDA DO CONTEÚDO EDITORIAL
      // Headline, texto e CTA saem suavemente para cima.
      // Eyebrows superiores também se desvanecem.
      // -------------------------------------------------------------
      masterTl
        .to(
          heroContentCenterRef.current,
          {
            opacity: 0,
            y: -35,
            pointerEvents: 'none',
            duration: 0.12,
            ease: 'power2.in',
          },
          0.54
        )
        .to(
          [heroEyebrowRef.current, heroAmbientTagRef.current],
          {
            opacity: 0,
            y: -15,
            duration: 0.10,
            ease: 'power2.in',
          },
          0.56
        );

      // -------------------------------------------------------------
      // 6. (0.64 → 0.80): EXPANSÃO ORGÂNICA TOTAL DO MOTION NA VIEWPORT
      // O motion coral assume o protagonismo total no canvas fullscreen e expande organicamente
      // sem qualquer corte de container intermediário ou overlay retangular.
      // -------------------------------------------------------------
      masterTl
        .to(
          heroStageRef.current,
          {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.12,
            ease: 'power2.in',
          },
          0.72
        );

      // -------------------------------------------------------------
      // 7. (0.80 → 0.94): REVELAÇÃO DA SEÇÃO INTRODUÇÃO (#EDEEEE)
      // O fundo claro e a Introdução revelam-se suavemente sobre a atmosfera.
      // O Header AINDA NÃO APARECE.
      // -------------------------------------------------------------
      masterTl
        .fromTo(
          introStageRef.current,
          {
            opacity: 0,
            scale: 0.98,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            scale: 1,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 0.14,
          },
          0.80
        )
        // Conteúdo da Introdução entra de forma editorial e assentada
        .fromTo(
          introEyebrowRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.10, ease: 'power2.out' },
          0.82
        )
        .fromTo(
          introMemoryMarkRef.current,
          { opacity: 0, scale: 0.75 },
          { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' },
          0.82
        )
        .fromTo(
          [introHeadlineLine1Ref.current, introHeadlineLine2Ref.current, introHeadlineLine3Ref.current],
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.14, ease: 'power3.out' },
          0.84
        )
        .fromTo(
          introTextRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.12, ease: 'power2.out' },
          0.88
        )
        .fromTo(
          introClosingRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
          0.90
        );

      // -------------------------------------------------------------
      // 8. (0.94 → 1.00): INTRODUÇÃO ESTABELECIDA + HEADER FIXO
      // Acionado via onUpdate (p >= 0.94 -> setHeaderVisible(true))
      // -------------------------------------------------------------
    }, container);

    return () => {
      ctx.revert();
      setAtmosphere('dark');
      setHeaderVisible(false);
    };
  }, [reducedMotion, setAtmosphere, setHeaderVisible]);

  // Accessible fallback for users with prefers-reduced-motion
  if (reducedMotion) {
    return (
      <div id="home-experience" className="w-full flex flex-col">
        {/* Static Accessible Hero Section */}
        <section
          id="home"
          className="min-h-[90vh] bg-brand-dark text-brand-light py-28 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center border-b border-brand-light/10 relative overflow-hidden"
        >
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col items-center text-center relative z-10">
            {/* Monumental Wordmark (Official Typography + Symbol in 'è' + Subtitle) */}
            <div className="w-full flex justify-center mb-6 drop-shadow-md">
              <img
                src={assets.brand.wordmarkOfficial}
                alt="Melière — Marketing & Estruturação"
                className="w-[85vw] max-w-[320px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[760px] h-auto object-contain"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>

            <div className="max-w-3xl flex flex-col items-center gap-6">
              <SectionEyebrow variant="coral">ESTRUTURAÇÃO DE MARKETING</SectionEyebrow>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-light leading-tight">
                Seu negócio não precisa apenas aparecer.{' '}
                <span className="text-brand-light block sm:inline font-bold">Precisa construir presença.</span>
              </h1>
              <p className="text-base sm:text-lg text-brand-light/80 font-light leading-relaxed max-w-2xl">
                Estruturação, estratégia, conteúdo, tráfego e presença digital construídos com direção, acompanhamento e consistência.
              </p>
              <Button href="#contato" variant="primary" size="lg">
                <span>Fale sobre seu negócio</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Static Accessible Introduction Section (Coral accent preserved on light background) */}
        <section
          id="introducao"
          className="min-h-[85vh] bg-brand-light text-brand-dark py-28 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center border-b border-brand-dark/10"
        >
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <SectionEyebrow variant="coral">ESTRUTURAÇÃO DE MARKETING</SectionEyebrow>
              {assets.brand.symbolCoralBlack && (
                <img
                  src={assets.brand.symbolCoralBlack}
                  alt="Melière"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
                />
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-dark leading-[1.12]">
                  Crescer sem estrutura transforma marketing em improviso.
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center lg:pl-6">
                <p className="text-base sm:text-lg text-brand-dark/85 font-light leading-relaxed">
                  A Melière organiza a presença do seu negócio antes de tentar acelerá-la. Estratégia, identidade, conteúdo, tráfego e acompanhamento trabalham juntos para construir uma comunicação consistente, profissional e preparada para crescer.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-brand-coral pl-6 py-4 bg-brand-dark/[0.025] max-w-3xl">
              <p className="text-base sm:text-lg font-medium text-brand-dark tracking-wide">
                Marketing não deveria ser uma sequência de ações isoladas.{' '}
                <span className="text-brand-coral font-semibold">Ele precisa funcionar como estrutura.</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      id="home-experience"
      className="relative w-full h-screen overflow-hidden bg-brand-dark select-none"
    >
      {/* 
        ========================================================================
        LAYER 0: MOTION VIEWPORT LAYER (z-10) — LIVRE DE RESTRIÇÃO DE GRID
        Camada direta de viewport (100vw x 100vh) com canvas de resolução nativa.
        A expansão ocorre diretamente através dos cálculos 2D do Canvas, sem
        cortes retangulares de container ou overlays intermediários.
        ========================================================================
      */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none overflow-visible flex items-center justify-center">
        <MeliereOrganicElement
          scrollProgress={scrollProgress}
          interactive={true}
        />
      </div>

      {/* 
        ========================================================================
        LAYER 1: HERO STAGE — CAMADA EDITORIAL (z-20 / z-30)
        ========================================================================
      */}
      <section
        id="home"
        ref={heroStageRef}
        className="absolute inset-0 z-20 w-full h-full flex flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-7 pb-8 overflow-hidden pointer-events-none"
        aria-label="Hero Melière Marketing"
      >
        {/* Subtle Background Architectural Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/20" />
        </div>

        {/* TOP LAYER (z-30): Subtle Brand Eyebrow Identification */}
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex items-center justify-between relative z-30 pt-1 pointer-events-auto">
          <div ref={heroEyebrowRef}>
            <SectionEyebrow variant="coral">ESTRUTURAÇÃO DE MARKETING</SectionEyebrow>
          </div>
          
          {/* Subtle Ambient Identification */}
          <div ref={heroAmbientTagRef} className="hidden sm:flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-brand-light/50 font-medium">
            <span>PRESENÇA DIGITAL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-coral" />
            <span>ESTRATÉGIA</span>
          </div>
        </div>

        {/* 
          ======================================================================
          CENTER COMPOSITION (z-30):
          1. Estado 1: Monumental "MELIÈRE" (Solid 100% no frame 0)
          2. Estado 2 & 3: Copy Editorial Central (Headline centro-esquerda + Texto/CTA centro-direita)
          Ambos compartilham a mesma área nobre do eixo vertical central da viewport!
          ======================================================================
        */}
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex-1 relative flex items-center justify-center my-auto min-h-0">
          {/* 
            A) OFFICIAL MONUMENTAL WORDMARK (Estado 1)
            Official typography with symbol in place of 'è' + marketing & estruturação.
            100% visível no início, desaparece completamente (opacity: 0) em p = 0.22
          */}
          <div
            ref={wordmarkRef}
            className="absolute inset-0 z-20 w-full flex flex-col items-center justify-center text-center pointer-events-none select-none will-change-transform px-4 sm:px-6"
          >
            <img
              src={assets.brand.wordmarkOfficial}
              alt="Melière — Marketing & Estruturação"
              className="w-[88vw] max-w-[340px] sm:max-w-[500px] md:max-w-[640px] lg:max-w-[780px] xl:max-w-[880px] 2xl:max-w-[960px] h-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)] opacity-100 block"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </div>

          {/* 
            B) CENTRAL EDITORIAL COPY (Estado 2 & 3: Posicionamento & Leitura)
            Ocupa o centro visual da viewport após MELIÈRE atingir opacity 0!
            Esquerda: Headline clara (#EDEEEE) | Direita: Texto complementar + CTA
          */}
          <div
            ref={heroContentCenterRef}
            className="relative z-30 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center will-change-transform opacity-0 translate-y-10 pointer-events-none py-4"
          >
            {/* Left/Main Column: Positioning Headline (7 cols) — Centro-Esquerda (100% #EDEEEE para contraste perfeito sobre o motion coral) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1
                ref={heroHeadlineRef}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.2rem] font-bold tracking-tight text-brand-light leading-[1.14] max-w-2xl"
              >
                Seu negócio não precisa apenas aparecer.{' '}
                <span className="text-brand-light block sm:inline font-bold">Precisa construir presença.</span>
              </h1>
            </div>

            {/* Right Column: Subtext + CTA (5 cols) — Centro-Direita */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-5 sm:gap-7">
              <p
                ref={heroSubtextRef}
                className="text-sm sm:text-base md:text-[1.05rem] text-brand-light/85 font-light leading-relaxed max-w-md lg:text-right"
              >
                Estruturação, estratégia, conteúdo, tráfego e presença digital construídos com direção, acompanhamento e consistência.
              </p>

              <div ref={heroCtaRef} className="pointer-events-auto">
                <Button
                  href="#contato"
                  variant="primary"
                  size="md"
                  id="hero-cta-button"
                  className="group relative overflow-hidden transition-all duration-300 shadow-md"
                >
                  <span>Fale sobre seu negócio</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer for clean visual balance */}
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-6 sm:h-8" aria-hidden="true" />
      </section>

      {/* 
        ========================================================================
        LAYER 2: INTRODUCTION STAGE — LIGHT ATMOSPHERE (#EDEEEE) (z-40)
        Reveals organically from the coral transformation with monumental editorial layout
        (Coral highlights preserved here where background is light #EDEEEE)
        ========================================================================
      */}
      <div
        ref={introStageRef}
        className="absolute inset-0 z-40 w-full h-full bg-brand-light text-brand-dark overflow-hidden pointer-events-none opacity-0"
      >
        <section
          id="introducao"
          ref={introContainerRef}
          className="w-full h-full flex flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-24 pb-12 relative"
          aria-label="Introdução Melière Marketing"
        >
          {/* Subtle Architectural Grid Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-15" aria-hidden="true">
            <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-dark/20" />
          </div>

          <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col justify-between h-full relative z-10 pointer-events-auto">
            {/* Top Bar: Eyebrow + Inherited Brand Symbol Memory */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div ref={introEyebrowRef}>
                <SectionEyebrow variant="coral">ESTRUTURAÇÃO DE MARKETING</SectionEyebrow>
              </div>

              {/* Inherited Coral Symbol Mark with Black Accent (3.png) */}
              <div ref={introMemoryMarkRef} className="flex items-center">
                {assets.brand.symbolCoralBlack ? (
                  <img
                    src={assets.brand.symbolCoralBlack}
                    alt=""
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
                    aria-hidden="true"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-coral/20 border border-brand-coral flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-brand-coral rounded-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Central Asymmetric Grid: Monumental Typography + Displaced Explanatory Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start my-auto py-4">
              {/* Left Column: Monumental Headline (7 cols) — Coral accent active on light background */}
              <div className="lg:col-span-7 flex flex-col">
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-bold tracking-tight text-brand-dark leading-[1.08] flex flex-col">
                  <span ref={introHeadlineLine1Ref} className="block will-change-transform">
                    Crescer sem estrutura
                  </span>
                  <span ref={introHeadlineLine2Ref} className="block will-change-transform text-brand-coral">
                    transforma marketing
                  </span>
                  <span ref={introHeadlineLine3Ref} className="block will-change-transform">
                    em improviso.
                  </span>
                </h2>
              </div>

              {/* Right Displaced Explanatory Column (5 cols) with generous lateral and vertical breathing room */}
              <div className="lg:col-span-5 flex flex-col justify-center lg:pt-5 lg:pl-6">
                <p
                  ref={introTextRef}
                  className="text-base sm:text-lg md:text-[1.12rem] text-brand-dark/85 font-light leading-relaxed will-change-transform max-w-xl"
                >
                  A Melière organiza a presença do seu negócio antes de tentar acelerá-la. Estratégia, identidade, conteúdo, tráfego e acompanhamento trabalham juntos para construir uma comunicação consistente, profissional e preparada para crescer.
                </p>
              </div>
            </div>

            {/* Bottom Editorial Closing Statement with Structural Left Border Accent */}
            <div
              ref={introClosingRef}
              className="border-l-2 border-brand-coral pl-6 py-4 bg-brand-dark/[0.025] max-w-3xl will-change-transform"
            >
              <p className="text-base sm:text-lg md:text-[1.05rem] font-medium text-brand-dark tracking-wide leading-relaxed">
                Marketing não deveria ser uma sequência de ações isoladas.{' '}
                <span className="text-brand-coral font-semibold">Ele precisa funcionar como estrutura.</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
