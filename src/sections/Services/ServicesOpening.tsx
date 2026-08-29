import React from 'react';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { assets } from '../../config/assets';

/**
 * Abertura da Seção Serviços (Estrutura antes de escala)
 * Sets the conceptual stage with generous negative space before the pinned multi-act experience begins.
 */
export const ServicesOpening: React.FC = () => {
  return (
    <section
      id="servicos-abertura"
      className="w-full min-h-0 py-16 sm:py-24 lg:min-h-[75vh] bg-brand-dark text-brand-light flex flex-col justify-between px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-brand-light/10 relative overflow-hidden"
    >
      {/* Subtle Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden="true">
        <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto h-full border-x border-brand-light/20" />
      </div>

      <div className="w-full max-w-[1400px] 2xl:max-w-[1520px] mx-auto flex flex-col justify-between flex-1 relative z-10 gap-8 sm:gap-12">
        {/* Top Eyebrow */}
        <div className="flex items-center justify-between">
          <SectionEyebrow variant="coral">SERVIÇOS</SectionEyebrow>
        </div>

        {/* Central Monumental Headline & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start my-auto py-2 sm:py-6">
          {/* Main Headline (7 cols) with position shifted right to match green highlight */}
          <div className="lg:col-span-7 flex flex-col lg:pl-10 xl:pl-16">
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] font-bold tracking-tight text-brand-light leading-[1.03]">
              Estrutura antes<br />
              <span className="text-brand-coral">de escala.</span>
            </h2>
          </div>

          {/* Explanatory Narrative Column (5 cols) shifted down and font size increased by 200% on desktop */}
          <div className="lg:col-span-5 flex flex-col justify-end lg:pt-16 xl:pt-24">
            <p className="text-base sm:text-xl md:text-2xl lg:text-[2.1rem] xl:text-[2.35rem] text-brand-light/90 font-light leading-snug lg:leading-[1.25] max-w-xl">
              Marketing funciona melhor quando cada frente deixa de operar isoladamente e passa a fazer parte de uma estrutura.
            </p>
          </div>
        </div>

        {/* Bottom Closing Statement shifted to the right as indicated in green */}
        <div className="pt-6 sm:pt-8 border-t border-brand-light/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm sm:text-base text-brand-light/70 font-light max-w-2xl leading-relaxed lg:ml-10 xl:ml-16">
            Estratégia, conteúdo, mídia, presença digital e identidade trabalhando na mesma direção.
          </p>
        </div>
      </div>
    </section>
  );
};
