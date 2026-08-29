import React from 'react';
import { assets } from '../../../config/assets';
import { ServiceAssetCarousel } from '../../../components/ui/ServiceAssetCarousel';

interface Act03PerformanceProps {
  progress?: number;
}

/**
 * ATO 03 — PERFORMANCE & TRÁFEGO PAGO
 * Features an auto-rotating prominent creative carousel without captions or badges.
 */
export const Act03Performance: React.FC<Act03PerformanceProps> = () => {
  const auxiliaryTags = [
    'DISTRIBUIÇÃO',
    'CAMPANHA',
    'SEGMENTAÇÃO',
    'MENSURAÇÃO',
  ];

  const creatives = assets.editalAds.creatives;

  // Pure image slides without any headers, badges, captions or bottom bars
  const slides = creatives.map((creativeUrl, idx) => (
    <div key={creativeUrl} className="w-full flex items-center justify-center p-2">
      <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[440px] lg:max-w-[460px] xl:max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden bg-brand-dark/95 border border-brand-light/20 shadow-2xl relative group">
        <img
          src={creativeUrl}
          alt={`Criativo de campanha 0${idx + 1} — Edital Concursos`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    </div>
  ));

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none">
      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-14 items-center my-auto py-1">
        {/* Left Column: Title + Copy + Auxiliary Tags (4-5 cols) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4 sm:gap-6">
          {/* Auxiliary Tags */}
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
            Performance &<br />
            <span className="text-brand-coral">Tráfego Pago</span>
          </h3>

          {/* Descriptive Copy */}
          <p className="text-base sm:text-lg md:text-[1.1rem] text-brand-light/90 font-light leading-relaxed max-w-lg">
            Distribuir bem também faz parte da estratégia. Campanhas pagas ampliam o alcance da comunicação e aproximam a mensagem das pessoas certas, no momento adequado.
          </p>
        </div>

        {/* Right Column: Prominent Auto-Scrolling Creatives Carousel (Shifted right for breathing room) */}
        <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center lg:justify-end lg:pl-6 xl:pl-10">
          <div className="w-full max-w-[540px]">
            <ServiceAssetCarousel
              items={slides}
              autoplayInterval={3500}
              showIndicators={true}
              ariaLabel="Carrossel de Criativos e Performance"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

