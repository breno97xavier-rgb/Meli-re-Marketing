import React from 'react';

interface MethodCoreVisualProps {
  currentStep: number; // 1 to 6
  progress: number; // 0 to 1
}

/**
 * Visual Central Dinâmico do Método Melière
 * Uma estrutura arquitetônica/geométrica em evolução contínua ao longo das 6 etapas:
 * 01 — Entender: ponto inicial, nós dispersos, estrutura aberta.
 * 02 — Diagnosticar: conexões surgindo, retângulos de foco, priorização.
 * 03 — Estruturar: matriz cartesiana alinhada, eixos ortogonais, ordem precisa.
 * 04 — Executar: vetores de dispersão/fluxos radiando para as 4 frentes.
 * 05 — Acompanhar: anéis concêntricos de leitura, feedback loops convergindo para o centro.
 * 06 — Ajustar: espiral de reorientação de rota e reinício de ciclo.
 */
export const MethodCoreVisual: React.FC<MethodCoreVisualProps> = ({ currentStep }) => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[480px] xl:max-w-[530px] 2xl:max-w-[560px] aspect-square flex items-center justify-center p-3.5 sm:p-4 select-none">
      {/* Background Architectural Frame */}
      <div className="absolute inset-0 rounded-2xl border border-brand-dark/[0.08] bg-brand-light/40 backdrop-blur-sm pointer-events-none" />

      {/* SVG Canvas for Transformative Geometric Process */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full relative z-10 transition-all duration-700 ease-out"
        aria-hidden="true"
      >
        {/* Background Ambient Grid */}
        <g className="stroke-brand-dark/[0.06] stroke-[1] stroke-dasharray-2-2">
          <line x1="60" y1="200" x2="340" y2="200" />
          <line x1="200" y1="60" x2="200" y2="340" />
          <circle cx="200" cy="200" r="80" fill="none" />
          <circle cx="200" cy="200" r="140" fill="none" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 01 — ENTENDER: Ponto inicial + nós orbitais dispersos   */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Central Origin Node */}
          <circle cx="200" cy="200" r="8" className="fill-brand-coral" />
          <circle cx="200" cy="200" r="18" className="stroke-brand-coral/40 stroke-1 fill-none animate-ping" />

          {/* Dispersed Nodes & Subtle Dashed Radii */}
          <g className="stroke-brand-dark/20 stroke-1 stroke-dasharray-4-4">
            <line x1="200" y1="200" x2="110" y2="120" />
            <line x1="200" y1="200" x2="290" y2="130" />
            <line x1="200" y1="200" x2="130" y2="280" />
            <line x1="200" y1="200" x2="280" y2="290" />
          </g>

          {/* Node 1: Negócio */}
          <circle cx="110" cy="120" r="5.5" className="fill-brand-dark/80" />
          <text x="110" y="98" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/90 font-semibold tracking-wider">
            NEGÓCIO
          </text>

          {/* Node 2: Contexto */}
          <circle cx="290" cy="130" r="5.5" className="fill-brand-dark/80" />
          <text x="290" y="108" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/90 font-semibold tracking-wider">
            CONTEXTO
          </text>

          {/* Node 3: Objetivos */}
          <circle cx="130" cy="280" r="5.5" className="fill-brand-dark/80" />
          <text x="130" y="308" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/90 font-semibold tracking-wider">
            OBJETIVOS
          </text>

          {/* Node 4: Operação */}
          <circle cx="280" cy="290" r="5.5" className="fill-brand-dark/80" />
          <text x="280" y="318" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/90 font-semibold tracking-wider">
            OPERAÇÃO
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 02 — DIAGNOSTICAR: Conexões de rede + áreas de foco     */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Diagnostic Cross-Links */}
          <g className="stroke-brand-dark/30 stroke-[1.5]">
            <line x1="120" y1="130" x2="280" y2="130" />
            <line x1="120" y1="130" x2="120" y2="270" />
            <line x1="280" y1="130" x2="280" y2="270" />
            <line x1="120" y1="270" x2="280" y2="270" />
            <line x1="120" y1="130" x2="280" y2="270" className="stroke-brand-coral/50" />
            <line x1="280" y1="130" x2="120" y2="270" className="stroke-brand-coral/50" />
          </g>

          {/* Focus Enclosing Boxes */}
          <rect x="95" y="105" width="50" height="50" className="fill-brand-coral/[0.08] stroke-brand-coral stroke-1" />
          <rect x="255" y="245" width="50" height="50" className="fill-brand-coral/[0.08] stroke-brand-coral stroke-1" />

          {/* Nodes */}
          <circle cx="120" cy="130" r="6" className="fill-brand-coral" />
          <circle cx="280" cy="130" r="5" className="fill-brand-dark/80" />
          <circle cx="120" cy="270" r="5" className="fill-brand-dark/80" />
          <circle cx="280" cy="270" r="6" className="fill-brand-coral" />

          {/* Center Diagnostic Scope */}
          <circle cx="200" cy="200" r="30" className="stroke-brand-coral stroke-[1.5] fill-none" />
          <line x1="200" y1="160" x2="200" y2="240" className="stroke-brand-coral stroke-1" />
          <line x1="160" y1="200" x2="240" y2="200" className="stroke-brand-coral stroke-1" />

          {/* Labels */}
          <text x="200" y="80" textAnchor="middle" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            ANÁLISE DE PRIORIDADES
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 03 — ESTRUTURAR: Matriz Cartesiana Alinhada             */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Rigid Orthogonal Matrix Grid */}
          <g className="stroke-brand-dark/25 stroke-[1.5]">
            {/* Horizontal rows */}
            <line x1="80" y1="120" x2="320" y2="120" />
            <line x1="80" y1="170" x2="320" y2="170" />
            <line x1="80" y1="230" x2="320" y2="230" />
            <line x1="80" y1="280" x2="320" y2="280" />

            {/* Vertical columns */}
            <line x1="120" y1="80" x2="120" y2="320" />
            <line x1="170" y1="80" x2="170" y2="320" />
            <line x1="230" y1="80" x2="230" y2="320" />
            <line x1="280" y1="80" x2="280" y2="320" />
          </g>

          {/* Primary Backbone Axis */}
          <line x1="60" y1="200" x2="340" y2="200" className="stroke-brand-coral stroke-2" />
          <line x1="200" y1="60" x2="200" y2="340" className="stroke-brand-coral stroke-2" />

          {/* Structural Center Anchor */}
          <rect x="185" y="185" width="30" height="30" className="fill-brand-coral stroke-brand-dark stroke-2" />
          <circle cx="200" cy="200" r="4" className="fill-brand-light" />

          {/* Matrix Quadrants Data Nodes */}
          <circle cx="120" cy="120" r="5" className="fill-brand-dark/80" />
          <circle cx="280" cy="120" r="5" className="fill-brand-dark/80" />
          <circle cx="120" cy="280" r="5" className="fill-brand-dark/80" />
          <circle cx="280" cy="280" r="5" className="fill-brand-dark/80" />

          {/* Highlighted Module Blocks */}
          <rect x="125" y="125" width="40" height="40" className="fill-brand-dark/[0.06] stroke-brand-dark/20 stroke-1" />
          <rect x="235" y="235" width="40" height="40" className="fill-brand-dark/[0.06] stroke-brand-dark/20 stroke-1" />

          <text x="200" y="48" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/85 font-semibold tracking-widest uppercase">
            EIXO ESTRUTURAL DEFINIDO
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 04 — EXECUTAR: Vetores de Fluxo Radiando para Frentes   */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Core Engine */}
          <circle cx="200" cy="200" r="24" className="fill-brand-dark stroke-brand-coral stroke-2" />
          <circle cx="200" cy="200" r="8" className="fill-brand-coral" />

          {/* 4 Cardinal Outward Flow Arrows & Lines */}
          {/* Top: Conteúdo */}
          <g className="stroke-brand-coral stroke-2">
            <line x1="200" y1="176" x2="200" y2="80" />
            <polygon points="195,85 200,75 205,85" className="fill-brand-coral" />
          </g>
          <text x="200" y="60" textAnchor="middle" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            CONTEÚDO
          </text>

          {/* Right: Mídia */}
          <g className="stroke-brand-coral stroke-2">
            <line x1="224" y1="200" x2="320" y2="200" />
            <polygon points="315,195 325,200 315,205" className="fill-brand-coral" />
          </g>
          <text x="332" y="204" textAnchor="start" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            MÍDIA
          </text>

          {/* Bottom: Web */}
          <g className="stroke-brand-coral stroke-2">
            <line x1="200" y1="224" x2="200" y2="320" />
            <polygon points="195,315 200,325 205,315" className="fill-brand-coral" />
          </g>
          <text x="200" y="348" textAnchor="middle" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            WEB
          </text>

          {/* Left: Identidade */}
          <g className="stroke-brand-coral stroke-2">
            <line x1="176" y1="200" x2="80" y2="200" />
            <polygon points="85,195 75,200 85,205" className="fill-brand-coral" />
          </g>
          <text x="68" y="204" textAnchor="end" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            IDENTIDADE
          </text>

          {/* Wave Pulses */}
          <circle cx="200" cy="200" r="55" className="stroke-brand-dark/20 stroke-1 fill-none stroke-dasharray-4-4" />
          <circle cx="200" cy="200" r="95" className="stroke-brand-dark/15 stroke-1 fill-none stroke-dasharray-6-6" />
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 05 — ACOMPANHAR: Feedback Loops Convergindo ao Centro   */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Concentric Observation Rings */}
          <circle cx="200" cy="200" r="110" className="stroke-brand-dark/20 stroke-1 fill-none" />
          <circle cx="200" cy="200" r="75" className="stroke-brand-dark/30 stroke-1 fill-none stroke-dasharray-4-4" />
          <circle cx="200" cy="200" r="40" className="stroke-brand-coral/60 stroke-[1.5] fill-brand-coral/[0.04]" />

          {/* Inward Converging Vectors (Feedback arrows toward center) */}
          <g className="stroke-brand-coral stroke-[1.5]">
            {/* Top-left in */}
            <line x1="110" y1="110" x2="170" y2="170" />
            <polygon points="165,160 172,172 160,165" className="fill-brand-coral" />

            {/* Top-right in */}
            <line x1="290" y1="110" x2="230" y2="170" />
            <polygon points="235,160 228,172 240,165" className="fill-brand-coral" />

            {/* Bottom-right in */}
            <line x1="290" y1="290" x2="230" y2="230" />
            <polygon points="240,235 228,228 235,240" className="fill-brand-coral" />

            {/* Bottom-left in */}
            <line x1="110" y1="290" x2="170" y2="230" />
            <polygon points="160,235 172,228 165,240" className="fill-brand-coral" />
          </g>

          {/* Central Collector Node */}
          <circle cx="200" cy="200" r="12" className="fill-brand-coral stroke-brand-dark stroke-2" />
          <circle cx="200" cy="200" r="4" className="fill-brand-light" />

          {/* Metric Pulses */}
          <circle cx="110" cy="110" r="4" className="fill-brand-dark/80" />
          <circle cx="290" cy="110" r="4" className="fill-brand-dark/80" />
          <circle cx="290" cy="290" r="4" className="fill-brand-dark/80" />
          <circle cx="110" cy="290" r="4" className="fill-brand-dark/80" />

          <text x="200" y="48" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/85 font-semibold tracking-widest uppercase">
            LEITURA CONTÍNUA & FEEDBACK
          </text>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* ETAPA 06 — AJUSTAR: Loop Contínuo & Próximo Ciclo             */}
        {/* ------------------------------------------------------------- */}
        <g
          className={`transition-all duration-700 ease-out ${
            currentStep === 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Continuous Cycle Spiral / Circular Arc Loop */}
          <path
            d="M 200,80 A 120,120 0 1,1 90,240 A 90,90 0 1,1 200,120 A 60,60 0 1,1 150,220"
            fill="none"
            className="stroke-brand-coral stroke-2"
          />

          {/* Directional Reorientation Arrows on the loop */}
          <g className="fill-brand-coral">
            <polygon points="200,75 210,80 200,85" />
            <polygon points="325,200 320,210 315,200" />
            <polygon points="150,215 145,225 155,225" />
          </g>

          {/* Central Iterative Core */}
          <circle cx="200" cy="200" r="16" className="fill-brand-dark stroke-brand-coral stroke-2" />
          <circle cx="200" cy="200" r="6" className="fill-brand-coral" />

          {/* Radial Realigned Markers */}
          <line x1="200" y1="200" x2="270" y2="130" className="stroke-brand-dark/40 stroke-[1.5] stroke-dasharray-3-3" />
          <circle cx="270" cy="130" r="6" className="fill-brand-coral" />
          <text x="282" y="122" className="font-mono text-[13px] fill-brand-coral font-bold tracking-wider">
            NOVO CICLO
          </text>

          <text x="200" y="48" textAnchor="middle" className="font-mono text-[13px] fill-brand-dark/85 font-semibold tracking-widest uppercase">
            EVOLUÇÃO E CORREÇÃO DE ROTA
          </text>
        </g>
      </svg>
    </div>
  );
};
