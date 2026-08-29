import React, { useRef, useEffect } from 'react';
import { gsap } from '../../../lib/gsap';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface EditorialWorkspacePreviewProps {
  className?: string;
}

/**
 * Interface Conceitual de Organização & Workspace Interno da Melière
 * Representa visualmente em código o rigor de processos, planejamento e rotina da agência:
 * - Calendário Editorial de Entregas (Planejamento)
 * - Checklist de Próximas Ações
 * - Status de Etapas (Acompanhamento)
 * - Gráfico Conceitual de Leitura (PERÍODO / LEITURA / AJUSTE — sem números falsos)
 * - Card de Reunião & Ciclo de Alinhamento
 */
export const EditorialWorkspacePreview: React.FC<EditorialWorkspacePreviewProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calendarCardRef = useRef<HTMLDivElement | null>(null);
  const actionsCardRef = useRef<HTMLDivElement | null>(null);
  const statusCardRef = useRef<HTMLDivElement | null>(null);
  const reportCardRef = useRef<HTMLDivElement | null>(null);
  const meetingCardRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Gentle sequenced reveal on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 85%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        [calendarCardRef.current, actionsCardRef.current],
        { y: 25, opacity: 0.2 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' }
      )
        .fromTo(
          [statusCardRef.current, meetingCardRef.current],
          { y: 25, opacity: 0.2 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' },
          0.15
        )
        .fromTo(
          reportCardRef.current,
          { y: 30, opacity: 0.2 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.3
        );

      // Animate the conceptual reading line stroke
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.fromTo(
          pathRef.current,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 65%',
              end: 'bottom 75%',
              scrub: 0.8,
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-brand-dark/95 border border-brand-light/15 rounded-xl p-4 sm:p-6 lg:p-7 shadow-2xl text-brand-light font-sans select-none backdrop-blur-md relative overflow-hidden ${className}`}
    >
      {/* Top Workspace System Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-brand-light/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-light/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-light/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-light/20" />
          </div>
          <div className="h-4 w-[1px] bg-brand-light/15 mx-1" />
          <span className="font-mono text-xs sm:text-[13px] uppercase tracking-widest text-brand-light/80 font-semibold">
            ROTEIRO & ACOMPANHAMENTO // CICLO ATIVO
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-brand-coral font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-coral animate-pulse" />
          <span className="hidden sm:inline uppercase tracking-wider">ROTINA SINCRONIZADA</span>
        </div>
      </div>

      {/* Grid of Workspace Modules */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        {/* ------------------------------------------------------------- */}
        {/* 1. PLANEJAMENTO — Calendário Editorial (7 cols)               */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={calendarCardRef}
          className="md:col-span-7 bg-brand-light/[0.02] border border-brand-light/10 rounded-lg p-4 sm:p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-brand-light/[0.08]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-brand-light/90 font-semibold">
              <span className="text-brand-coral font-bold">01</span>
              <span>Planejamento & Entregas</span>
            </div>
            <span className="text-xs font-mono text-brand-light/50 font-medium uppercase tracking-widest">
              SEMANAL
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-2.5 rounded bg-brand-light/[0.02] border border-brand-light/[0.06]">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-coral" />
                <span className="text-xs sm:text-sm text-brand-light/90 font-medium">
                  Conteúdo semanal
                </span>
              </div>
              <span className="font-mono text-xs text-brand-coral bg-brand-coral/10 px-2 py-0.5 rounded border border-brand-coral/20 uppercase tracking-wider font-medium">
                Em andamento
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between p-2.5 rounded bg-brand-light/[0.02] border border-brand-light/[0.06]">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light/40" />
                <span className="text-xs sm:text-sm text-brand-light/90 font-medium">
                  Campanha institucional
                </span>
              </div>
              <span className="font-mono text-xs text-brand-light/70 bg-brand-light/[0.04] px-2 py-0.5 rounded border border-brand-light/10 uppercase tracking-wider font-medium">
                Revisão
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-between p-2.5 rounded bg-brand-light/[0.02] border border-brand-light/[0.06]">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-light/40" />
                <span className="text-xs sm:text-sm text-brand-light/90 font-medium">
                  Relatório mensal
                </span>
              </div>
              <span className="font-mono text-xs text-brand-light/50 bg-brand-light/[0.02] px-2 py-0.5 rounded border border-brand-light/[0.08] uppercase tracking-wider font-medium">
                Agendado
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. PRÓXIMAS AÇÕES — Checklist de Operação (5 cols)            */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={actionsCardRef}
          className="md:col-span-5 bg-brand-light/[0.02] border border-brand-light/10 rounded-lg p-4 sm:p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-brand-light/[0.08]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-brand-light/90 font-semibold">
              <span className="text-brand-coral font-bold">02</span>
              <span>Próximas Ações</span>
            </div>
            <span className="text-xs font-mono text-brand-coral/80 uppercase tracking-wider font-medium">
              ATIVO
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs sm:text-[13px] text-brand-light/90 font-light">
              <span className="w-4 h-4 rounded border border-brand-coral bg-brand-coral/20 flex items-center justify-center text-[10px] text-brand-coral font-bold flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>Alinhamento de pauta & temas</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-[13px] text-brand-light/90 font-light">
              <span className="w-4 h-4 rounded border border-brand-coral bg-brand-coral/20 flex items-center justify-center text-[10px] text-brand-coral font-bold flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>Ajuste de criativos e direção visual</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-[13px] text-brand-light/70 font-light">
              <span className="w-4 h-4 rounded border border-brand-light/20 bg-brand-light/[0.02] flex items-center justify-center text-[10px] text-transparent flex-shrink-0 mt-0.5">
                •
              </span>
              <span>Envio de leitura quinzenal</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. ACOMPANHAMENTO — Status de Etapas (6 cols)                 */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={statusCardRef}
          className="md:col-span-6 bg-brand-light/[0.02] border border-brand-light/10 rounded-lg p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-brand-light/[0.08]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-brand-light/90 font-semibold">
              <span className="text-brand-coral font-bold">03</span>
              <span>Status de Etapas</span>
            </div>
            <span className="text-xs font-mono text-brand-light/50 font-medium uppercase tracking-widest">
              PROGRESSO
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs sm:text-[13px] font-mono text-brand-light/80 mb-1">
                <span>Diagnóstico & Estruturação</span>
                <span className="text-brand-coral font-semibold">Concluído</span>
              </div>
              <div className="w-full h-1.5 bg-brand-light/10 rounded-full overflow-hidden">
                <div className="w-full h-full bg-brand-coral" />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-xs sm:text-[13px] font-mono text-brand-light/80 mb-1">
                <span>Execução de Ciclo</span>
                <span className="text-brand-coral font-semibold">Ativo</span>
              </div>
              <div className="w-full h-1.5 bg-brand-light/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-brand-coral" />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-xs sm:text-[13px] font-mono text-brand-light/60 mb-1">
                <span>Revisão & Ajuste</span>
                <span className="text-brand-light/50">Agendado</span>
              </div>
              <div className="w-full h-1.5 bg-brand-light/10 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-brand-light/30" />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. REUNIÕES & ALINHAMENTO (6 cols)                            */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={meetingCardRef}
          className="md:col-span-6 bg-brand-light/[0.02] border border-brand-light/10 rounded-lg p-4 sm:p-5 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-brand-light/[0.08]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-brand-light/90 font-semibold">
              <span className="text-brand-coral font-bold">04</span>
              <span>Ciclo de Alinhamento</span>
            </div>
            <span className="text-xs font-mono text-brand-light/50 font-medium uppercase tracking-widest">
              ROTINA
            </span>
          </div>

          <div className="p-3 bg-brand-light/[0.03] border border-brand-light/[0.08] rounded flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs sm:text-sm text-brand-light font-medium">
                Alinhamento Quinzenal
              </span>
              <span className="text-xs text-brand-light/60 font-light">
                Revisão de prioridades e próximos passos
              </span>
            </div>
            <div className="font-mono text-xs text-brand-coral uppercase tracking-wider px-2 py-1 bg-brand-coral/10 rounded border border-brand-coral/20 font-medium">
              Confirmado
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. RELATÓRIO — Gráfico Conceitual Abstrato (12 cols)          */}
        {/* Sem números falsos ou +32%: PERÍODO / LEITURA / AJUSTE         */}
        {/* ------------------------------------------------------------- */}
        <div
          ref={reportCardRef}
          className="md:col-span-12 bg-brand-light/[0.02] border border-brand-light/10 rounded-lg p-3.5 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-brand-light/[0.08]">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-[13px] uppercase tracking-wider text-brand-light/90 font-semibold">
              <span className="text-brand-coral font-bold">05</span>
              <span>Leitura de Direção & Acompanhamento</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono text-brand-light/60 uppercase tracking-widest font-medium">
              <span>PERÍODO</span>
              <span className="text-brand-coral font-semibold">LEITURA</span>
              <span>AJUSTE</span>
            </div>
          </div>

          {/* Conceptual Clean Continuous Curve (No fake numbers, pure process trajectory) */}
          <div className="relative w-full h-24 sm:h-28 pt-2">
            <svg
              viewBox="0 0 600 100"
              className="w-full h-full overflow-visible"
              aria-label="Gráfico conceitual de leitura e ajuste de rota"
            >
              {/* Subtle Horizontal Reference Axis Grid */}
              <line x1="0" y1="20" x2="600" y2="20" className="stroke-brand-light/[0.06] stroke-1 stroke-dasharray-4-4" />
              <line x1="0" y1="50" x2="600" y2="50" className="stroke-brand-light/[0.06] stroke-1 stroke-dasharray-4-4" />
              <line x1="0" y1="80" x2="600" y2="80" className="stroke-brand-light/[0.06] stroke-1 stroke-dasharray-4-4" />

              {/* Conceptual Reading Curve */}
              <path
                ref={pathRef}
                d="M 10,75 C 100,75 140,55 220,60 C 300,65 360,35 450,40 C 520,45 560,25 590,20"
                fill="none"
                className="stroke-brand-coral stroke-[2.5]"
              />

              {/* Key Direction Nodes with Labels */}
              <g>
                <circle cx="10" cy="75" r="4" className="fill-brand-coral" />
                <circle cx="220" cy="60" r="4" className="fill-brand-coral" />
                <circle cx="450" cy="40" r="4" className="fill-brand-coral" />
                <circle cx="590" cy="20" r="5" className="fill-brand-coral stroke-brand-light stroke-2" />
              </g>
            </svg>

            {/* Bottom Axis Milestones */}
            <div className="flex justify-between items-center font-mono text-[8.5px] sm:text-[11px] md:text-xs text-brand-light/50 pt-2.5 mt-1 border-t border-brand-light/[0.06] font-medium tracking-tight sm:tracking-normal">
              <span className="text-left whitespace-nowrap">
                <span className="sm:hidden">INÍCIO</span>
                <span className="hidden sm:inline">ETAPA INICIAL</span>
              </span>
              <span className="text-center whitespace-nowrap px-1">
                <span className="sm:hidden">DADOS</span>
                <span className="hidden sm:inline">OBSERVAÇÃO & DADOS</span>
              </span>
              <span className="text-center whitespace-nowrap px-1">
                <span className="sm:hidden">ROTA</span>
                <span className="hidden sm:inline">DECISÃO DE ROTA</span>
              </span>
              <span className="text-right text-brand-coral font-semibold whitespace-nowrap">
                PRÓXIMO CICLO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Coordinate Tag */}
      <div className="mt-4 pt-3 border-t border-brand-light/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 font-mono text-[11px] sm:text-xs md:text-[13px] text-brand-light/50 font-medium">
        <span>SISTEMA DE GESTÃO EDITORIAL</span>
        <span className="text-brand-coral/90 uppercase tracking-wider sm:tracking-widest font-semibold text-[10px] sm:text-xs">
          TRANSPARÊNCIA // REGISTRO // ROTINA
        </span>
      </div>
    </div>
  );
};
