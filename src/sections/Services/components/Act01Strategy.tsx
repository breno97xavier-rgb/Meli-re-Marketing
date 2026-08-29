import React from 'react';
import { assets } from '../../../config/assets';

interface Act01StrategyProps {
  opacity?: number;
  scale?: number;
}

/**
 * ATO 01 — ESTRATÉGIA & ESTRUTURAÇÃO
 * Visual: Predominantly typographic & architectural structural grid.
 * Abstract composition of axes, lines, coordinates, dynamic divisions, diagnostics,
 * planning tags, and subtle Melière identity marks.
 * Feeling of organization being constructed.
 */
export const Act01Strategy: React.FC<Act01StrategyProps> = () => {
  const auxiliaryTags = [
    'DIAGNÓSTICO',
    'DIREÇÃO',
    'PLANEJAMENTO',
    'POSICIONAMENTO',
  ];

  const structuralLayers = [
    { title: 'Leitura de Mercado & Negócio', desc: 'Compreensão aprofundada do ecossistema, diferenciais e momento da marca.' },
    { title: 'Definição de Canais & Prioridades', desc: 'Alocação consciente de esforços onde a presença gera relevância e retorno real.' },
    { title: 'Integração de Frentes', desc: 'Conteúdo, tráfego, design e tecnologia operando sob a mesma diretriz estratégica.' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Main Content Area */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto py-2">
        {/* Left Column: Title + Copy + Auxiliary Tags */}
        <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
          {/* Auxiliary Tags Pill Group */}
          <div className="flex flex-wrap gap-2">
            {auxiliaryTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-brand-light/85 bg-brand-light/[0.04] border border-brand-light/15 px-3.5 py-1.5 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-[5.5rem] xl:text-[6.2rem] font-bold tracking-tight text-brand-light leading-[1.03]">
            Estratégia &<br />
            <span className="text-brand-coral">Estruturação</span>
          </h3>

          {/* Descriptive Copy */}
          <p className="text-base sm:text-lg md:text-[1.1rem] text-brand-light/90 font-light leading-relaxed max-w-xl">
            Antes de comunicar, é preciso entender o negócio, organizar prioridades e definir direção. A estratégia conecta cada frente para que marketing deixe de ser uma sequência de ações isoladas.
          </p>
        </div>

        {/* Right Column: Architectural Schematic & Organizational Matrix */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-brand-dark/90 border border-brand-light/15 p-5 sm:p-6 lg:p-7 backdrop-blur-sm relative overflow-hidden rounded-xl">
            {/* Top Bar of Schema */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-brand-light/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-coral" />
                <span className="font-mono text-xs sm:text-sm text-brand-light/90 tracking-widest uppercase font-semibold">
                  Matriz de Direção
                </span>
              </div>
              {assets.brand.symbolCoralWhite && (
                <img
                  src={assets.brand.symbolCoralWhite}
                  alt=""
                  className="w-5 h-5 object-contain opacity-70"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Step-by-Step Structural Flow */}
            <div className="space-y-3 sm:space-y-3.5">
              {structuralLayers.map((layer, index) => (
                <div
                  key={layer.title}
                  className="p-3.5 sm:p-4 bg-brand-light/[0.03] border border-brand-light/[0.08] hover:border-brand-coral/40 transition-colors group rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs sm:text-sm text-brand-coral font-bold">
                      0{index + 1}.
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold text-brand-light group-hover:text-brand-coral transition-colors">
                      {layer.title}
                    </h4>
                  </div>
                  <p className="text-sm sm:text-base text-brand-light/75 font-light leading-relaxed pl-5">
                    {layer.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
